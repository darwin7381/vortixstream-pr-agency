from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Query
from typing import List, Optional
from datetime import datetime
import logging
import mimetypes
from PIL import Image
import io

from ..core.database import db
from ..models.media import MediaFile, MediaFileCreate, MediaFileUpdate
from ..services.r2_storage import r2_storage

router = APIRouter(prefix="/media")
logger = logging.getLogger(__name__)


# 支援的圖片格式
ALLOWED_EXTENSIONS = {'.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB


@router.post("/folders", status_code=201)
async def create_folder(folder_name: str = Form(...)):
    """
    創建新資料夾
    
    在 R2 中創建一個 .keep 檔案作為資料夾佔位符
    """
    try:
        # 驗證資料夾名稱
        if not folder_name or not folder_name.strip():
            raise HTTPException(status_code=400, detail="資料夾名稱不能為空")
        
        folder_name = folder_name.strip()
        
        # 檢查資料夾是否已存在
        async with db.pool.acquire() as conn:
            existing = await conn.fetchval(
                "SELECT COUNT(*) FROM media_files WHERE folder = $1",
                folder_name
            )
        
        if existing > 0:
            raise HTTPException(status_code=400, detail=f"資料夾「{folder_name}」已存在")
        
        # 在 R2 創建 .keep 檔案（佔位符）
        keep_content = b"# This file is used to keep the folder in R2 storage"
        keep_key = f"{folder_name}/.keep"
        
        upload_result = r2_storage.upload_file(
            file_content=keep_content,
            filename=".keep",
            folder=folder_name,
            content_type="text/plain"
        )
        
        # 儲存到資料庫
        async with db.pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                INSERT INTO media_files (
                    filename, original_filename, file_key, file_url,
                    file_size, mime_type, folder, alt_text, caption, uploaded_by
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                RETURNING *
                """,
                ".keep",
                ".keep",
                keep_key,
                upload_result['url'],
                upload_result['size'],
                "text/plain",
                folder_name,
                "Folder placeholder",
                "Auto-generated folder keeper",
                "system"
            )
        
        logger.info(f"✅ Folder created: {folder_name}")
        return {
            "message": f"資料夾「{folder_name}」已創建",
            "folder": folder_name,
            "keep_file": dict(row)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"❌ Failed to create folder: {e}")
        raise HTTPException(status_code=500, detail=f"創建資料夾失敗：{str(e)}")


@router.post("/upload", response_model=MediaFile, status_code=201)
async def upload_media(
    file: UploadFile = File(...),
    folder: str = Form("uploads"),
    alt_text: Optional[str] = Form(None),
    caption: Optional[str] = Form(None),
):
    """
    上傳媒體檔案到 R2
    
    - 支援格式：jpg, jpeg, png, gif, webp, svg
    - 最大大小：10MB
    - 自動生成唯一檔名
    - 儲存到資料庫
    """
    
    # 檢查檔案副檔名
    file_ext = f".{file.filename.rsplit('.', 1)[-1].lower()}" if '.' in file.filename else ''
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"不支援的檔案格式。允許的格式：{', '.join(ALLOWED_EXTENSIONS)}"
        )
    
    # 讀取檔案內容
    content = await file.read()
    file_size = len(content)
    
    # 檢查檔案大小
    if file_size > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"檔案太大。最大允許大小：{MAX_FILE_SIZE / 1024 / 1024}MB"
        )
    
    if file_size == 0:
        raise HTTPException(status_code=400, detail="檔案是空的")
    
    try:
        # 獲取圖片尺寸
        width, height = None, None
        try:
            image = Image.open(io.BytesIO(content))
            width, height = image.size
            logger.info(f"📐 Image dimensions: {width} x {height}")
        except Exception as e:
            logger.warning(f"⚠️ Could not get image dimensions: {e}")
        
        # 上傳到 R2
        upload_result = r2_storage.upload_file(
            file_content=content,
            filename=file.filename,
            folder=folder,
            content_type=file.content_type
        )
        
        # 儲存記錄到資料庫（包含尺寸）
        async with db.pool.acquire() as conn:
            row = await conn.fetchrow(
                """
                INSERT INTO media_files (
                    filename, original_filename, file_key, file_url,
                    file_size, mime_type, folder, alt_text, caption, uploaded_by,
                    width, height
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING *
                """,
                upload_result['key'].split('/')[-1],  # filename
                upload_result['original_filename'],
                upload_result['key'],
                upload_result['url'],
                upload_result['size'],
                upload_result['content_type'],
                folder,
                alt_text,
                caption,
                "admin",
                width,
                height
            )
        
        logger.info(f"✅ Media file uploaded and saved: {upload_result['key']}")
        return dict(row)
        
    except Exception as e:
        logger.error(f"❌ Failed to upload media: {e}")
        raise HTTPException(status_code=500, detail=f"上傳失敗：{str(e)}")


@router.get("/files", response_model=List[MediaFile])
async def get_media_files(
    folder: Optional[str] = Query(None),
    limit: int = Query(100, ge=1, le=500),
    search: Optional[str] = None
):
    """取得媒體檔案列表"""
    
    async with db.pool.acquire() as conn:
        # 建立查詢條件
        conditions = []
        params = []
        param_count = 1
        
        if folder:
            conditions.append(f"folder = ${param_count}")
            params.append(folder)
            param_count += 1
        
        if search:
            conditions.append(f"(original_filename ILIKE ${param_count} OR alt_text ILIKE ${param_count})")
            params.append(f"%{search}%")
            param_count += 1
        
        where_clause = " AND ".join(conditions) if conditions else "TRUE"
        
        rows = await conn.fetch(
            f"""
            SELECT * FROM media_files
            WHERE {where_clause}
            ORDER BY created_at DESC
            LIMIT ${param_count}
            """,
            *params, limit
        )
    
    return [dict(row) for row in rows]


@router.get("/files/{file_id}", response_model=MediaFile)
async def get_media_file(file_id: int):
    """取得單個媒體檔案資訊"""
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT * FROM media_files WHERE id = $1",
            file_id
        )
    
    if not row:
        raise HTTPException(status_code=404, detail="Media file not found")
    
    return dict(row)


@router.patch("/files/{file_id}", response_model=MediaFile)
async def update_media_file(file_id: int, update: MediaFileUpdate):
    """更新媒體檔案資訊（alt text, caption）"""
    
    update_data = update.model_dump(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")
    
    set_clauses = []
    params = []
    param_count = 1
    
    for field, value in update_data.items():
        set_clauses.append(f"{field} = ${param_count}")
        params.append(value)
        param_count += 1
    
    set_clauses.append(f"updated_at = ${param_count}")
    params.append(datetime.now())
    param_count += 1
    
    params.append(file_id)
    
    async with db.pool.acquire() as conn:
        row = await conn.fetchrow(
            f"""
            UPDATE media_files
            SET {', '.join(set_clauses)}
            WHERE id = ${param_count}
            RETURNING *
            """,
            *params
        )
    
    if not row:
        raise HTTPException(status_code=404, detail="Media file not found")
    
    return dict(row)


@router.delete("/files/{file_id}", status_code=204)
async def delete_media_file(file_id: int):
    """刪除媒體檔案（從 R2 和資料庫）"""
    
    async with db.pool.acquire() as conn:
        # 先獲取檔案資訊
        row = await conn.fetchrow(
            "SELECT file_key FROM media_files WHERE id = $1",
            file_id
        )
        
        if not row:
            raise HTTPException(status_code=404, detail="Media file not found")
        
        file_key = row['file_key']
        
        # 從 R2 刪除
        r2_storage.delete_file(file_key)
        
        # 從資料庫刪除
        await conn.execute(
            "DELETE FROM media_files WHERE id = $1",
            file_id
        )
    
    logger.info(f"✅ Media file deleted: {file_key}")
    return None


@router.get("/folders")
async def get_folders():
    """取得所有資料夾列表及統計"""
    
    async with db.pool.acquire() as conn:
        rows = await conn.fetch(
            """
            SELECT 
                folder,
                COUNT(*) as file_count,
                SUM(file_size) as total_size
            FROM media_files
            GROUP BY folder
            ORDER BY folder
            """
        )
    
    return [
        {
            'folder': row['folder'],
            'file_count': row['file_count'],
            'total_size': row['total_size']
        }
        for row in rows
    ]


@router.get("/stats")
async def get_media_stats():
    """取得媒體統計資訊"""
    
    async with db.pool.acquire() as conn:
        stats = await conn.fetchrow(
            """
            SELECT 
                COUNT(*) as total_files,
                SUM(file_size) as total_size,
                COUNT(DISTINCT folder) as folder_count
            FROM media_files
            """
        )
    
    return dict(stats)


@router.post("/sync-from-r2")
async def sync_from_r2():
    """
    掃描 R2 並匯入所有檔案到資料庫
    
    - 掃描 R2 bucket 中的所有檔案
    - 匯入到資料庫（已存在的會跳過）
    - 返回匯入統計
    """
    try:
        # 列出 R2 所有檔案
        response = r2_storage.s3_client.list_objects_v2(
            Bucket=r2_storage.bucket_name
        )
        
        if 'Contents' not in response:
            return {
                "message": "R2 bucket 是空的",
                "imported": 0,
                "skipped": 0,
                "total": 0
            }
        
        total_files = len(response['Contents'])
        imported_count = 0
        skipped_count = 0
        
        async with db.pool.acquire() as conn:
            for obj in response['Contents']:
                file_key = obj['Key']
                file_size = obj['Size']
                last_modified = obj['LastModified']
                
                # 解析資料夾和檔名
                if '/' in file_key:
                    folder = '/'.join(file_key.split('/')[:-1])
                    filename = file_key.split('/')[-1]
                else:
                    folder = 'uploads'
                    filename = file_key
                
                # 跳過已存在的檔案
                exists = await conn.fetchval(
                    "SELECT id FROM media_files WHERE file_key = $1",
                    file_key
                )
                
                if exists:
                    skipped_count += 1
                    continue
                
                # 偵測 MIME 類型
                mime_type, _ = mimetypes.guess_type(filename)
                mime_type = mime_type or 'application/octet-stream'
                
                # 生成公開 URL
                file_url = r2_storage.get_file_url(file_key)
                
                # 嘗試獲取圖片尺寸
                width, height = None, None
                if mime_type.startswith('image/'):
                    try:
                        obj_data = r2_storage.s3_client.get_object(
                            Bucket=r2_storage.bucket_name,
                            Key=file_key
                        )
                        content = obj_data['Body'].read()
                        image = Image.open(io.BytesIO(content))
                        width, height = image.size
                    except:
                        pass
                
                # 插入資料庫
                await conn.execute(
                    """
                    INSERT INTO media_files (
                        filename, original_filename, file_key, file_url,
                        file_size, mime_type, folder, uploaded_by, created_at,
                        width, height
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                    """,
                    filename,
                    filename,
                    file_key,
                    file_url,
                    file_size,
                    mime_type,
                    folder,
                    "synced",
                    last_modified.replace(tzinfo=None),
                    width,
                    height
                )
                
                imported_count += 1
        
        logger.info(f"✅ R2 sync completed: {imported_count} imported, {skipped_count} skipped")
        
        return {
            "message": "同步完成",
            "imported": imported_count,
            "skipped": skipped_count,
            "total": total_files
        }
        
    except Exception as e:
        logger.error(f"❌ R2 sync failed: {e}")
        raise HTTPException(status_code=500, detail=f"同步失敗：{str(e)}")
