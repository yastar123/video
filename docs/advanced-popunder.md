# Advanced Popunder Manager Documentation

## Overview

Advanced Popunder Manager adalah sistem popunder yang sangat powerful dengan frequency control tinggi dan multiple trigger methods. Sistem ini dirancang untuk maksimalkan revenue dari iklan popunder EffectiveGateCPM.

## Script Iklan

```html
<script src="https://pl28722862.effectivegatecpm.com/43/88/c9/4388c91d89682a21f68164b288c042f9.js"></script>
```

## Frequency Levels

### 1. **Low** (Konservatif)
- Frequency: 15 menit
- Max per session: 5 popunder
- Delay: 5 detik
- Trigger pattern: Setiap 5 klik

### 2. **Medium** (Seimbang)
- Frequency: 10 menit
- Max per session: 8 popunder
- Delay: 4 detik
- Trigger pattern: Setiap 3 klik

### 3. **High** (Tinggi)
- Frequency: 5 menit
- Max per session: 12 popunder
- Delay: 3 detik
- Trigger pattern: Setiap 2 klik

### 4. **Maximum** (Maksimal)
- Frequency: 2 menit
- Max per session: 20 popunder
- Delay: 2 detik
- Trigger pattern: Setiap klik

### 5. **Aggressive** (Agresif)
- Frequency: 1 menit
- Max per session: 30 popunder
- Delay: 1 detik
- Trigger pattern: Setiap event

## Trigger Methods

### 1. **Click Trigger**
- Trigger berdasarkan klik pengguna
- Pattern berbeda per frequency level
- Support untuk mobile touch events

### 2. **Scroll Trigger**
- Trigger berdasarkan scroll depth
- Threshold berbeda per frequency level:
  - Low: 80% scroll
  - Medium: 60% scroll
  - High: 40% scroll
  - Maximum: 20% scroll
  - Aggressive: 10% scroll

### 3. **Exit Intent**
- Trigger saat mouse meninggalkan viewport
- Deteksi exit intent yang akurat

### 4. **Timer Trigger**
- Trigger berdasarkan waktu:
  - Low: 60 detik
  - Medium: 45 detik
  - High: 30 detik
  - Maximum: 15 detik
  - Aggressive: 5 detik

### 5. **Multiple Trigger**
- Kombinasi dari semua trigger methods
- Offset untuk避免 trigger bersamaan

### 6. **Aggressive Trigger**
- Semua trigger aktif
- Frequency tertinggi
- Multiple trigger techniques

## AdBlock Bypass

### Techniques:
1. **Script Obfuscation**
   - Random script attributes
   - Dynamic loading
   - Multiple insertion points

2. **Fallback Methods**
   - Form submission bypass
   - Event-based triggers
   - Direct window.open

3. **Detection & Bypass**
   - AdBlock detection
   - Alternative loading methods
   - Script injection techniques

## Mobile Optimization

### Features:
- Touch event support
- Responsive popunder sizing
- Mobile-specific triggers
- Performance optimization

## Configuration Options

```typescript
interface PopunderConfig {
  enabled: boolean
  frequencyLevel: 'low' | 'medium' | 'high' | 'maximum' | 'aggressive'
  customFrequency?: number // dalam menit
  maxPerSession: number
  delay: number // dalam detik
  triggerOn: 'click' | 'scroll' | 'exit' | 'timer' | 'multiple' | 'aggressive'
  bypassAdBlock: boolean
  mobileOptimized: boolean
}
```

## Presets

### Conservative
```tsx
<AdvancedPopunder 
  config={POPUNDER_PRESETS.conservative}
/>
```

### Balanced
```tsx
<AdvancedPopunder 
  config={POPUNDER_PRESETS.balanced}
/>
```

### Aggressive
```tsx
<AdvancedPopunder 
  config={POPUNDER_PRESETS.aggressive}
/>
```

### Extreme (Current Setting)
```tsx
<AdvancedPopunder 
  config={{
    ...POPUNDER_PRESETS.extreme,
    enabled: true,
    bypassAdBlock: true,
    mobileOptimized: true
  }}
/>
```

## Implementation

### Basic Usage
```tsx
import { AdvancedPopunder } from '@/components/advanced-popunder'

function App() {
  return (
    <div>
      <AdvancedPopunder 
        config={{
          enabled: true,
          frequencyLevel: 'maximum',
          maxPerSession: 20,
          delay: 2,
          triggerOn: 'aggressive',
          bypassAdBlock: true,
          mobileOptimized: true
        }}
      />
      {/* Your app content */}
    </div>
  )
}
```

### Custom Configuration
```tsx
<AdvancedPopunder 
  config={{
    enabled: true,
    frequencyLevel: 'custom',
    customFrequency: 3, // 3 menit
    maxPerSession: 15,
    delay: 2,
    triggerOn: 'multiple',
    bypassAdBlock: true,
    mobileOptimized: true
  }}
/>
```

## Analytics & Tracking

### Automatic Tracking:
- Session count
- Trigger frequency
- Last triggered time
- AdBlock detection status

### Manual Tracking:
```tsx
import { useSmartlinkAnalytics } from '@/hooks/use-smartlink-analytics'

function MyComponent() {
  const { trackClick } = useSmartlinkAnalytics()
  
  const handleCustomTrigger = () => {
    trackClick('custom_popunder', 'custom_url')
  }
}
```

## Session Management

### Data Storage:
```typescript
interface SessionData {
  count: number
  lastTriggered: number | null
  sessionStart: number
  frequencyLevel: string
}
```

### Storage Location:
- LocalStorage untuk persistency
- Session-based tracking
- Automatic cleanup

## Debug Mode

### Development Features:
- Real-time status display
- Manual trigger testing
- Session reset functionality
- Performance monitoring

### Debug Panel:
- Script loaded status
- AdBlock detection
- Current frequency level
- Session statistics
- Trigger capabilities

## Performance Optimization

### Techniques:
1. **Lazy Loading**
   - Delayed script injection
   - Conditional loading
   - Resource prioritization

2. **Event Optimization**
   - Passive event listeners
   - Throttled scroll handlers
   - Efficient click detection

3. **Memory Management**
   - Cleanup on unmount
   - Garbage collection
   - Resource deallocation

## Browser Compatibility

### Supported Browsers:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers

### Fallbacks:
- Legacy browser support
- Script loading fallbacks
- Alternative trigger methods

## Troubleshooting

### Common Issues:

1. **Popunder tidak muncul**
   - Check browser popup settings
   - Verify AdBlock status
   - Check script loading

2. **Frequency tidak berfungsi**
   - Clear localStorage
   - Check session data
   - Verify time calculations

3. **AdBlock detection gagal**
   - Update detection methods
   - Check fallback mechanisms
   - Verify script attributes

### Debug Commands:
```javascript
// Check localStorage
localStorage.getItem('advanced_popunder_data')

// Reset session
localStorage.removeItem('advanced_popunder_data')

// Check AdBlock
// Look for adsbox elements in DOM
```

## Best Practices

### 1. **Frequency Management**
- Start dengan conservative setting
- Monitor user feedback
- Adjust frequency gradually

### 2. **User Experience**
- Balance revenue vs UX
- Consider mobile limitations
- Test across devices

### 3. **Compliance**
- Follow browser policies
- Respect user preferences
- Consider legal requirements

## Advanced Features

### 1. **Dynamic Frequency**
- Time-based adjustments
- User behavior analysis
- Performance optimization

### 2. **A/B Testing**
- Multiple configurations
- Performance comparison
- Revenue optimization

### 3. **Geo-Targeting**
- Location-based frequency
- Regional compliance
- Custom triggers

## Future Enhancements

1. **Machine Learning Integration**
2. **Real-time Analytics Dashboard**
3. **Advanced Bypass Techniques**
4. **Cross-domain Tracking**
5. **Performance Monitoring**

## Security Considerations

1. **Script Validation**
2. **XSS Prevention**
3. **CSP Compliance**
4. **Secure Storage**
5. **Privacy Protection**

## Monitoring & Alerts

### Metrics to Track:
- Popunder success rate
- AdBlock bypass success
- User engagement
- Revenue impact
- Performance metrics

### Alert Conditions:
- Low success rates
- High failure rates
- Performance degradation
- Security issues
