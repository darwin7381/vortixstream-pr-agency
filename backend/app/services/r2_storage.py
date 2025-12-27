"""
Cloudflare R2 存儲服務
"""
import boto3
import logging
import uuid
import mimetypes
from typing import Optional, List, BinaryIO
from datetime import datetime

from ..config import settings

logger = logging.getLogger(__name__)


class R2StorageService:
    """Cloudflare R2 存儲服務"""
    
    def __init__(self):
        """初始化 R2 客戶端"""
        # 檢查必要的環境變數
        if not settings.R2_ACCOUNT_ID or not settings.R2_ACCESS_KEY_ID or not settings.R2_SECRET_ACCESS_KEY:
            logger.warning("⚠️ R2 credentials not set - storage features disabled")
            self.enabled = False
            self.s3_client = None
            return
        
        self.enabled = True
        self.endpoint_url = f'https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com'
        self.bucket_name = settings.R2_BUCKET_NAME or 'default-bucket'
        self.public_url = settings.R2_PUBLIC_URL
        
        try:
            self.s3_client = boto3.client(
                's3',
                endpoint_url=self.endpoint_url,
                aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                region_name='auto'
            )
            logger.info(f"📦 R2 Storage Service initialized - Bucket: {self.bucket_name}")
        except Exception as e:
            logger.error(f"❌ Failed to initialize R2 client: {e}")
            self.enabled = False
            self.s3_client = None
    
    def upload_file(
        self,
        file_content: bytes,
        filename: str,
        folder: str = "uploads",
        content_type: Optional[str] = None
    ) -> dict:
        """
        上傳檔案到 R2
        
        如果 R2 未啟用，拋出錯誤
        
        Args:
            file_content: 檔案二進制內容
            filename: 原始檔名
            folder: 存儲資料夾（例如：blog, pricing, pr-packages）
            content_type: MIME 類型（如果不提供會自動偵測）
        
        Returns:
            dict: {
                'key': 檔案在 R2 的 key,
                'url': 公開訪問 URL,
                'size': 檔案大小,
                'content_type': MIME 類型
            }
        """
        if not self.enabled or not self.s3_client:
            raise Exception("R2 Storage is not enabled. Please set R2 credentials.")
        
        try:
            # 生成唯一的檔名（保留原始副檔名）
            file_ext = filename.rsplit('.', 1)[-1] if '.' in filename else ''
            unique_id = str(uuid.uuid4())
            file_key = f"{folder}/{unique_id}.{file_ext}" if file_ext else f"{folder}/{unique_id}"
            
            # 偵測 content type
            if not content_type:
                content_type, _ = mimetypes.guess_type(filename)
                content_type = content_type or 'application/octet-stream'
            
            # 上傳到 R2
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=file_key,
                Body=file_content,
                ContentType=content_type,
                Metadata={
                    'original_filename': filename,
                    'uploaded_at': datetime.now().isoformat()
                }
            )
            
            # 生成公開 URL
            if self.public_url:
                public_url = f"https://{self.public_url}/{file_key}"
            else:
                # 使用 R2 S3 API URL（需要 bucket 有公開訪問權限）
                public_url = f"{self.endpoint_url}/{self.bucket_name}/{file_key}"
            
            logger.info(f"✅ File uploaded: {file_key} ({len(file_content)} bytes)")
            
            return {
                'key': file_key,
                'url': public_url,
                'size': len(file_content),
                'content_type': content_type,
                'original_filename': filename
            }
            
        except Exception as e:
            logger.error(f"❌ Failed to upload file: {e}")
            raise
    
    def delete_file(self, file_key: str) -> bool:
        """刪除檔案"""
        try:
            self.s3_client.delete_object(
                Bucket=self.bucket_name,
                Key=file_key
            )
            logger.info(f"✅ File deleted: {file_key}")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to delete file {file_key}: {e}")
            return False
    
    def list_files(
        self,
        folder: Optional[str] = None,
        limit: int = 100
    ) -> List[dict]:
        """
        列出檔案
        
        Args:
            folder: 資料夾前綴（例如：blog, pricing）
            limit: 最大返回數量
        
        Returns:
            List[dict]: 檔案列表
        """
        try:
            params = {
                'Bucket': self.bucket_name,
                'MaxKeys': limit
            }
            
            if folder:
                params['Prefix'] = f"{folder}/"
            
            response = self.s3_client.list_objects_v2(**params)
            
            files = []
            if 'Contents' in response:
                for obj in response['Contents']:
                    # 生成公開 URL
                    if self.public_url:
                        url = f"https://{self.public_url}/{obj['Key']}"
                    else:
                        url = f"{self.endpoint_url}/{self.bucket_name}/{obj['Key']}"
                    
                    files.append({
                        'key': obj['Key'],
                        'url': url,
                        'size': obj['Size'],
                        'last_modified': obj['LastModified'].isoformat(),
                        'filename': obj['Key'].split('/')[-1]
                    })
            
            logger.info(f"📂 Listed {len(files)} files from folder: {folder or 'root'}")
            return files
            
        except Exception as e:
            logger.error(f"❌ Failed to list files: {e}")
            return []
    
    def get_file_url(self, file_key: str) -> str:
        """獲取檔案的公開 URL"""
        if self.public_url:
            return f"https://{self.public_url}/{file_key}"
        else:
            return f"{self.endpoint_url}/{self.bucket_name}/{file_key}"


# 全域實例
r2_storage = R2StorageService()

