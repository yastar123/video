#!/bin/bash

echo "=== Adsterra Banner Deployment & Testing Script ==="
echo ""

DOMAIN="bokepindonesia.my.id"
echo "Testing domain: $DOMAIN"
echo ""

# Step 1: Deploy latest changes
echo "🚀 Step 1: Deploying latest changes..."
cd /root/video
git pull origin main
npm run build
pm2 restart all

echo "✅ Deployment completed"
echo ""

# Step 2: Wait for deployment to settle
echo "⏳ Step 2: Waiting for deployment to settle..."
sleep 10

# Step 3: Test website accessibility
echo "🌐 Step 3: Testing website accessibility..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN")
echo "Website HTTP Status: $HTTP_CODE"

if [ "$HTTP_CODE" != "200" ]; then
    echo "❌ Website not accessible, aborting test"
    exit 1
fi

echo "✅ Website accessible"
echo ""

# Step 4: Check page source for ad keys
echo "📄 Step 4: Checking page source for ad keys..."
PAGE_SOURCE=$(curl -s "https://$DOMAIN")

echo "Checking for Adsterra components:"
if echo "$PAGE_SOURCE" | grep -q "AdsterraBanner"; then
    echo "✅ AdsterraBanner component found"
else
    echo "❌ AdsterraBanner component not found"
fi

# Test all ad keys
AD_KEYS=(
    "6e9a519272442fa242b5a43e53ddc7fd:160x300"
    "22bed31723f24472a78afb44a7addb6b:160x600"
    "1ad6f564f3ca7bb42752dba86368d149:300x250"
    "a8ea859722150189e57a87b6579578f3:468x60"
    "5a8dd45e78414c6e5be9db9eaffed61f:728x90"
    "c08de902b7930682919199d915646b97:native"
    "9add34aad611a8243e9fa65055bde309:social"
)

for key_info in "${AD_KEYS[@]}"; do
    key=$(echo "$key_info" | cut -d':' -f1)
    format=$(echo "$key_info" | cut -d':' -f2)
    
    if echo "$PAGE_SOURCE" | grep -q "$key"; then
        echo "✅ $format ad key found"
    else
        echo "❌ $format ad key not found"
    fi
done

echo ""

# Step 5: Test script URLs
echo "🌐 Step 5: Testing ad script URLs..."

SCRIPT_URLS=(
    "https://www.highperformanceformat.com/6e9a519272442fa242b5a43e53ddc7fd/invoke.js:160x300"
    "https://www.highperformanceformat.com/22bed31723f24472a78afb44a7addb6b/invoke.js:160x600"
    "https://www.highperformanceformat.com/1ad6f564f3ca7bb42752dba86368d149/invoke.js:300x250"
    "https://www.highperformanceformat.com/a8ea859722150189e57a87b6579578f3/invoke.js:468x60"
    "https://www.highperformanceformat.com/5a8dd45e78414c6e5be9db9eaffed61f/invoke.js:728x90"
    "https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js:native"
    "https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js:social"
)

for url_info in "${SCRIPT_URLS[@]}"; do
    url=$(echo "$url_info" | cut -d':' -f1)
    format=$(echo "$url_info" | cut -d':' -f2)
    
    echo "Testing $format script:"
    curl -s -I "$url" | head -1
done

echo ""

# Step 6: Summary
echo "📊 Step 6: Summary"
echo "✅ Deployment completed"
echo "✅ Website accessible"
echo "✅ Ad scripts should be working"
echo ""

echo "🧪 Manual Testing Steps:"
echo "1. Open browser and go to https://$DOMAIN"
echo "2. Open Developer Tools (F12)"
echo "3. Check Console tab for script loading messages"
echo "4. Check Network tab for invoke.js requests"
echo "5. Check Elements tab for iframe elements"
echo ""

echo "🌍 If ads don't show, try with VPN from different countries:"
echo "- United States, United Kingdom, Germany, France, Canada, Australia"
echo ""

echo "=== Deployment & Testing Complete ==="
