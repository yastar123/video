#!/bin/bash

echo "=== Adsterra Ads Debug Script ==="
echo ""

# Variables
DOMAIN="bokepindonesia.my.id"
echo "Domain: $DOMAIN"
echo ""

# Test all Adsterra ad keys
echo "Testing Adsterra Ad Keys..."
echo ""

# IFRAME BANNERS
echo "📱 IFRAME Banners:"
echo ""

echo "1. 160x300 - Key: 6e9a519272442fa242b5a43e53ddc7fd"
curl -s "https://www.highperformanceformat.com/6e9a519272442fa242b5a43e53ddc7fd/invoke.js" | head -c 100
echo ""

echo "2. 160x600 - Key: 22bed31723f24472a78afb44a7addb6b"
curl -s "https://www.highperformanceformat.com/22bed31723f24472a78afb44a7addb6b/invoke.js" | head -c 100
echo ""

echo "3. 300x250 - Key: 1ad6f564f3ca7bb42752dba86368d149"
curl -s "https://www.highperformanceformat.com/1ad6f564f3ca7bb42752dba86368d149/invoke.js" | head -c 100
echo ""

echo "4. 468x60 - Key: a8ea859722150189e57a87b6579578f3"
curl -s "https://www.highperformanceformat.com/a8ea859722150189e57a87b6579578f3/invoke.js" | head -c 100
echo ""

echo "5. 728x90 - Key: 5a8dd45e78414c6e5be9db9eaffed61f"
curl -s "https://www.highperformanceformat.com/5a8dd45e78414c6e5be9db9eaffed61f/invoke.js" | head -c 100
echo ""

# JS BANNERS
echo "📱 JS Banners:"
echo ""

echo "6. Native Banner - Key: c08de902b7930682919199d915646b97"
curl -s "https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js" | head -c 100
echo ""

echo "7. Social Bar - Key: 9add34aad611a8243e9fa65055bde309"
curl -s "https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js" | head -c 100
echo ""

echo "8. Popunder - Key: 4388c91d89682a21f68164b288c042f9"
curl -s "https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js" | head -c 100
echo ""

# Test website accessibility
echo "🌐 Testing Website Accessibility:"
echo ""

echo "Testing main domain..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN")
echo "HTTPS Status: $HTTP_CODE"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Website accessible"
else
    echo "❌ Website not accessible (HTTP $HTTP_CODE)"
fi

echo ""

# Test specific ad URLs on the website
echo "🔍 Testing Ad Implementation on Website:"
echo ""

echo "Checking for ad scripts in page source..."
PAGE_SOURCE=$(curl -s "https://$DOMAIN" | head -c 5000)

if echo "$PAGE_SOURCE" | grep -q "6e9a519272442fa242b5a43e53ddc7fd"; then
    echo "✅ 160x300 ad found in page"
else
    echo "❌ 160x300 ad not found in page"
fi

if echo "$PAGE_SOURCE" | grep -q "22bed31723f24472a78afb44a7addb6b"; then
    echo "✅ 160x600 ad found in page"
else
    echo "❌ 160x600 ad not found in page"
fi

if echo "$PAGE_SOURCE" | grep -q "1ad6f564f3ca7bb42752dba86368d149"; then
    echo "✅ 300x250 ad found in page"
else
    echo "❌ 300x250 ad not found in page"
fi

if echo "$PAGE_SOURCE" | grep -q "a8ea859722150189e57a87b6579578f3"; then
    echo "✅ 468x60 ad found in page"
else
    echo "❌ 468x60 ad not found in page"
fi

if echo "$PAGE_SOURCE" | grep -q "5a8dd45e78414c6e5be9db9eaffed61f"; then
    echo "✅ 728x90 ad found in page"
else
    echo "❌ 728x90 ad not found in page"
fi

if echo "$PAGE_SOURCE" | grep -q "c08de902b7930682919199d915646b97"; then
    echo "✅ Native banner found in page"
else
    echo "❌ Native banner not found in page"
fi

if echo "$PAGE_SOURCE" | grep -q "9add34aad611a8243e9fa65055bde309"; then
    echo "✅ Social bar found in page"
else
    echo "❌ Social bar not found in page"
fi

if echo "$PAGE_SOURCE" | grep -q "4388c91d89682a21f68164b288c042f9"; then
    echo "✅ Popunder found in page"
else
    echo "❌ Popunder not found in page"
fi

echo ""
echo "=== Debug Complete ==="
echo ""
echo "Next Steps:"
echo "1. Check browser console for JavaScript errors"
echo "2. Verify ad blockers are disabled"
echo "3. Check network tab for failed requests"
echo "4. Verify CSP headers allow ad scripts"
echo "5. Test in different browsers (Chrome, Firefox, Safari)"
