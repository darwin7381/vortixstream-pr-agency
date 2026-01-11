#!/bin/bash

# 檢查專案中是否有寫死的 localhost 網址
# 使用方法: ./check-localhost.sh

echo "🔍 檢查專案中寫死的 localhost 網址..."
echo ""

FOUND_ISSUES=0

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 檢查後端源碼 (backend/app/)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -r "localhost" backend/app/ --include="*.py" | grep -v "# " | grep -v "\"\"\"" > /dev/null 2>&1; then
    echo "❌ 發現 localhost："
    grep -rn "localhost" backend/app/ --include="*.py" | grep -v "# " | grep -v "\"\"\"" | head -10
    FOUND_ISSUES=$((FOUND_ISSUES + 1))
else
    echo "✅ 未發現 localhost"
fi
echo ""

if grep -r "127\.0\.0\.1" backend/app/ --include="*.py" > /dev/null 2>&1; then
    echo "❌ 發現 127.0.0.1："
    grep -rn "127\.0\.0\.1" backend/app/ --include="*.py" | head -10
    FOUND_ISSUES=$((FOUND_ISSUES + 1))
else
    echo "✅ 未發現 127.0.0.1"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 檢查前端源碼 (frontend/src/)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if grep -r "localhost" frontend/src/ --include="*.ts" --include="*.tsx" | grep -v "//" | grep -v "import.meta.env" > /dev/null 2>&1; then
    echo "❌ 發現寫死的 localhost（非環境變數）："
    grep -rn "localhost" frontend/src/ --include="*.ts" --include="*.tsx" | grep -v "//" | grep -v "import.meta.env" | head -10
    FOUND_ISSUES=$((FOUND_ISSUES + 1))
else
    echo "✅ 未發現寫死的 localhost"
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📁 檢查環境變數文件"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "backend/.env" ]; then
    if grep "localhost" backend/.env > /dev/null 2>&1; then
        echo "⚠️  backend/.env 包含 localhost（本地開發正常，生產環境必須修改）："
        grep -n "localhost" backend/.env
        echo ""
    else
        echo "✅ backend/.env 未包含 localhost"
    fi
else
    echo "⚠️  backend/.env 不存在"
fi

if [ -f "frontend/.env" ]; then
    if grep "localhost" frontend/.env > /dev/null 2>&1; then
        echo "⚠️  frontend/.env 包含 localhost（本地開發正常，生產環境必須修改）："
        grep -n "localhost" frontend/.env
        echo ""
    else
        echo "✅ frontend/.env 未包含 localhost"
    fi
else
    echo "⚠️  frontend/.env 不存在"
fi

if [ -f "frontend/.env.local" ]; then
    if grep "localhost" frontend/.env.local > /dev/null 2>&1; then
        echo "⚠️  frontend/.env.local 包含 localhost（本地開發正常，生產環境必須修改）："
        grep -n "localhost" frontend/.env.local
        echo ""
    else
        echo "✅ frontend/.env.local 未包含 localhost"
    fi
fi
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 檢查結果"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FOUND_ISSUES -eq 0 ]; then
    echo "✅ 所有檢查通過！源碼中未發現寫死的 localhost"
    echo ""
    echo "⚠️  請記得："
    echo "1. 確保生產環境的 .env 文件不包含 localhost"
    echo "2. 在 Railway 上設定正確的環境變數"
    echo "3. 前端修改環境變數後需要重新 build"
    exit 0
else
    echo "❌ 發現 $FOUND_ISSUES 個問題！"
    echo ""
    echo "請修正上述問題後再部署到生產環境"
    echo "詳細說明請參考: PRODUCTION_ENV_SETUP.md"
    exit 1
fi




