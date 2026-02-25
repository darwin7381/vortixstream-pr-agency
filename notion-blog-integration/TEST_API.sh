#!/bin/bash

# 測試 Notion Blog 同步 API
# 模擬 N8N 發送的 HTTP 請求

echo "🧪 測試 Notion Blog 同步 API"
echo "================================"
echo ""

# 設定變數
BACKEND_URL="http://localhost:8000"
WEBHOOK_SECRET="${NOTION_WEBHOOK_SECRET:-your-webhook-secret-here}"  # 從環境變數或 backend/.env 讀取

# 測試 1: 創建新文章（模擬 N8N Publish 觸發）
echo "測試 1: 創建新文章"
echo "---"

curl -X POST "${BACKEND_URL}/api/admin/blog/sync-from-notion" \
  -H "X-Notion-Webhook-Secret: ${WEBHOOK_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9"
  }' | jq '.'

echo ""
echo "✅ 如果看到文章資料，表示創建成功！"
echo ""
echo "================================"
echo ""

# 測試 2: 檢查資料庫
echo "測試 2: 檢查資料庫"
echo "---"

psql postgresql://JL@localhost:5432/vortixpr -c "
SELECT 
  id,
  title,
  category,
  slug,
  sync_source,
  notion_page_id,
  LENGTH(content) as content_length,
  created_at
FROM blog_posts 
WHERE notion_page_id = '01c95bf2-3e7f-8222-ba1d-01f4e4f334f9';
"

echo ""
echo "✅ 應該看到一筆資料，sync_source = 'notion'"
echo ""
echo "================================"
echo ""

# 測試 3: 更新文章（模擬 N8N Update 觸發）
echo "測試 3: 更新文章"
echo "---"

curl -X POST "${BACKEND_URL}/api/admin/blog/sync-from-notion" \
  -H "X-Notion-Webhook-Secret: ${WEBHOOK_SECRET}" \
  -H "Content-Type: application/json" \
  -d '{
    "notion_page_id": "01c95bf2-3e7f-8222-ba1d-01f4e4f334f9"
  }' | jq '.'

echo ""
echo "✅ _sync_action 應該是 'updated'"
echo ""
echo "================================"
echo ""

# 測試 4: 錯誤的 secret（應該被拒絕）
echo "測試 4: 錯誤的 Webhook Secret"
echo "---"

curl -X POST "${BACKEND_URL}/api/admin/blog/sync-from-notion" \
  -H "X-Notion-Webhook-Secret: wrong-secret" \
  -H "Content-Type: application/json" \
  -d '{"notion_page_id": "test-id"}'

echo ""
echo ""
echo "✅ 應該返回 403 Forbidden"
echo ""
echo "================================"
echo ""

echo "🎉 測試完成！"
echo ""
echo "📝 清理測試資料（可選）："
echo "psql postgresql://JL@localhost:5432/vortixpr -c \"DELETE FROM blog_posts WHERE notion_page_id = '01c95bf2-3e7f-8222-ba1d-01f4e4f334f9';\""
