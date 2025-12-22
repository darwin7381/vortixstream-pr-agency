#!/bin/bash

# VortixPR Backend Development Server

echo "🚀 Starting VortixPR Backend..."
echo ""

# 檢查 .env 檔案
if [ ! -f .env ]; then
    echo "⚠️  .env file not found!"
    echo "Please copy .env.example to .env and configure it."
    echo ""
    echo "cp .env.example .env"
    exit 1
fi

# 檢查 uv
if ! command -v uv &> /dev/null; then
    echo "❌ uv not found!"
    echo "Please install uv: curl -LsSf https://astral.sh/uv/install.sh | sh"
    exit 1
fi

# 啟動伺服器
echo "✅ Starting server on http://localhost:8000"
echo "📖 API Docs: http://localhost:8000/docs"
echo ""

uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

