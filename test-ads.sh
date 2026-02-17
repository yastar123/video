#!/bin/bash

echo "=== Adsterra Ads Testing Script ==="
echo ""

DOMAIN="bokepindonesia.my.id"
echo "Testing domain: $DOMAIN"
echo ""

# Test all ad URLs
echo "🔍 Testing Adsterra Ad URLs..."
echo ""

echo "1. 160x300 Banner:"
curl -s -I "https://www.highperformanceformat.com/6e9a519272442fa242b5a43e53ddc7fd/invoke.js" | head -1

echo "2. 160x600 Banner:"
curl -s -I "https://www.highperformanceformat.com/22bed31723f24472a78afb44a7addb6b/invoke.js" | head -1

echo "3. 300x250 Banner:"
curl -s -I "https://www.highperformanceformat.com/1ad6f564f3ca7bb42752dba86368d149/invoke.js" | head -1

echo "4. 468x60 Banner:"
curl -s -I "https://www.highperformanceformat.com/a8ea859722150189e57a87b6579578f3/invoke.js" | head -1

echo "5. 728x90 Banner:"
curl -s -I "https://www.highperformanceformat.com/5a8dd45e78414c6e5be9db9eaffed61f/invoke.js" | head -1

echo "6. Native Banner:"
curl -s -I "https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js" | head -1

echo "7. Social Bar:"
curl -s -I "https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js" | head -1

echo "8. Popunder:"
curl -s -I "https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js" | head -1

echo ""
echo "🌐 Testing Website..."
echo ""

# Test main website
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN")
echo "Website HTTP Status: $HTTP_CODE"

# Test if website is accessible
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Website accessible"
    
    echo ""
    echo "📄 Checking page source for ad scripts..."
    
    # Get page source and check for ad scripts
    PAGE_SOURCE=$(curl -s "https://$DOMAIN" | head -c 10000)
    
    echo "Checking for ad implementations:"
    
    if echo "$PAGE_SOURCE" | grep -q "6e9a519272442fa242b5a43e53ddc7fd"; then
        echo "✅ 160x300 ad found"
    else
        echo "❌ 160x300 ad not found"
    fi
    
    if echo "$PAGE_SOURCE" | grep -q "22bed31723f24472a78afb44a7addb6b"; then
        echo "✅ 160x600 ad found"
    else
        echo "❌ 160x600 ad not found"
    fi
    
    if echo "$PAGE_SOURCE" | grep -q "1ad6f564f3ca7bb42752dba86368d149"; then
        echo "✅ 300x250 ad found"
    else
        echo "❌ 300x250 ad not found"
    fi
    
    if echo "$PAGE_SOURCE" | grep -q "a8ea859722150189e57a87b6579578f3"; then
        echo "✅ 468x60 ad found"
    else
        echo "❌ 468x60 ad not found"
    fi
    
    if echo "$PAGE_SOURCE" | grep -q "5a8dd45e78414c6e5be9db9eaffed61f"; then
        echo "✅ 728x90 ad found"
    else
        echo "❌ 728x90 ad not found"
    fi
    
    if echo "$PAGE_SOURCE" | grep -q "c08de902b7930682919199d915646b97"; then
        echo "✅ Native banner found"
    else
        echo "❌ Native banner not found"
    fi
    
    if echo "$PAGE_SOURCE" | grep -q "9add34aad611a8243e9fa65055bde309"; then
        echo "✅ Social bar found"
    else
        echo "❌ Social bar not found"
    fi
    
    if echo "$PAGE_SOURCE" | grep -q "4388c91d89682a21f68164b288c042f9"; then
        echo "✅ Popunder found"
    else
        echo "❌ Popunder not found"
    fi
    
else
    echo "❌ Website not accessible (HTTP $HTTP_CODE)"
fi

echo ""
echo "📋 Ad Implementation Summary:"
echo ""
echo "Expected Ad Configuration:"
echo "- 160x300: 6e9a519272442fa242b5a43e53ddc7fd (IFRAME SYNC)"
echo "- 160x600: 22bed31723f24472a78afb44a7addb6b (IFRAME SYNC)"
echo "- 300x250: 1ad6f564f3ca7bb42752dba86368d149 (IFRAME SYNC)"
echo "- 468x60: a8ea859722150189e57a87b6579578f3 (IFRAME SYNC)"
echo "- 728x90: 5a8dd45e78414c6e5be9db9eaffed61f (IFRAME SYNC)"
echo "- Native: c08de902b7930682919199d915646b97 (NATIVE ASYNC)"
echo "- Social: 9add34aad611a8243e9fa65055bde309 (JS SYNC NO ADBLOCK BYPASS)"
echo "- Popunder: 4388c91d89682a21f68164b288c042f9 (JS SYNC NO ADBLOCK BYPASS)"

echo ""
echo "🔧 Troubleshooting Steps:"
echo "1. Check browser console for JavaScript errors"
echo "2. Disable ad blockers temporarily"
echo "3. Clear browser cache and cookies"
echo "4. Test in different browsers (Chrome, Firefox, Safari)"
echo "5. Check network tab for failed requests"
echo "6. Verify CSP headers allow ad scripts"
echo "7. Test with different IP/VPN locations"

echo ""
echo "=== Testing Complete ==="
