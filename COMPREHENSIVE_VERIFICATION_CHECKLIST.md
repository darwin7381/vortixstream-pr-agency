# 🎯 全面驗證檢查清單

> **目標：100% 確保沒有任何遺漏**

## 📋 檢查清單（逐項執行）

### ✅ 第 1 項：CSS 變數完整性

**檢查所有 CSS 變數是否存在且值正確**

<function_calls>
<invoke name="run_terminal_cmd">
<parameter name="command">cd /Users/JL/Development/bd/a-new-pr-agency/frontend && cat > /tmp/check-1-variables.sh << 'SCRIPT'
#!/bin/bash
echo "=== 第 1 項：CSS 變數檢查 ==="
echo ""

# 提取 backup 中所有變數名稱
backup_vars=$(sed -n '1,7886p' src/index.css.backup | grep "^\s*--" | sed 's/^\s*//' | cut -d':' -f1 | sort -u)
current_vars=$(cat src/styles/variables.css | grep "^\s*--" | sed 's/^\s*//' | cut -d':' -f1 | sort -u)

echo "backup 變數總數: $(echo "$backup_vars" | wc -l | tr -d ' ')"
echo "current 變數總數: $(echo "$current_vars" | wc -l | tr -d ' ')"
echo ""

# 檢查缺失
missing=$(comm -23 <(echo "$backup_vars") <(echo "$current_vars"))
if [ -n "$missing" ]; then
  echo "❌ 缺失的變數："
  echo "$missing" | head -20
  echo "..."
  echo "總計缺失: $(echo "$missing" | wc -l | tr -d ' ') 個"
else
  echo "✅ 所有變數都存在"
fi

# 檢查關鍵變數的值
echo ""
echo "關鍵變數值檢查："
for var in "font-sans" "font-heading" "brand-500" "padding-section-large-desktop"; do
  backup_val=$(grep "^\s*--$var:" src/index.css.backup | head -1 | cut -d':' -f2- | xargs)
  current_val=$(grep "^\s*--$var:" src/styles/variables.css | head -1 | cut -d':' -f2- | xargs)
  echo "  --$var:"
  echo "    backup:  $backup_val"
  echo "    current: $current_val"
  [ "$backup_val" = "$current_val" ] && echo "    ✅ 匹配" || echo "    ❌ 不匹配"
done
SCRIPT
chmod +x /tmp/check-1-variables.sh
/tmp/check-1-variables.sh

