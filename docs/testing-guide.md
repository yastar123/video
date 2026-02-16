# Testing Guide - Popunder & Smartlink Systems

## 🧪 **Cara Testing Semua Sistem**

### **1. Development Mode Debug Panels**

Semua sistem memiliki debug panels yang hanya muncul di development mode:

#### **Smartlink Rotator Debug Panel**
- **Location**: Bottom-right corner (hijau)
- **Features**:
  - Script loaded status
  - Session count tracking
  - Can trigger status
  - Manual trigger button
  - Reset functionality

#### **Delay Popunder Debug Panel** (Aktif Saat Ini)
- **Location**: Bottom-right corner (orange)
- **Features**:
  - Script loaded & AdBlock detection
  - Session/hourly counts
  - Active delays monitoring
  - Delay strategy statistics
  - Anti-detection status
  - Manual delayed trigger
  - Clear delays & reset

#### **Hybrid Popunder Debug Panel**
- **Location**: Bottom-right corner (purple)
- **Features**:
  - Popunder vs Direct link ratio
  - Trigger statistics
  - Available links status
  - Manual trigger options

#### **Multi-Event Popunder Debug Panel**
- **Location**: Bottom-right corner (merah)
- **Features**:
  - 25+ events status
  - Session statistics
  - Event cooldown tracking

---

## 🚀 **Testing Steps**

### **Step 1: Enable Development Mode**

Pastikan environment variable development:
```bash
# Di terminal
NODE_ENV=development npm run dev

# Atau di .env.local
NODE_ENV=development
```

### **Step 2: Buka Website**

1. Start development server:
```bash
npm run dev
```

2. Buka `http://localhost:3000` di browser

3. **Debug panel akan muncul** di bottom-right corner

### **Step 3: Testing Delay Popunder (Sistem Aktif)**

#### **A. Visual Testing**
1. **Lihat Debug Panel** (orange) - pastikan muncul
2. **Check Status**:
   - ✅ Script Loaded: true
   - ✅ AdBlock Detected: false/true
   - ✅ Session: 0/150
   - ✅ Hourly: 0/80

#### **B. Trigger Testing**
1. **Click "Delayed Trigger"** button:
   - Delay akan di-schedule
   - Lihat "Active Delays: 1"
   - Tunggu delay selesai

2. **Test Event Triggers**:
   - **Click** di halaman (setiap 2 klik)
   - **Right-click** (contextmenu)
   - **Scroll** halaman (>25%)
   - **Play video** (jika ada)
   - **Leave page** (beforeunload)

#### **C. Delay Strategy Testing**
1. **Klik "Delayed Trigger" berkali-kali**
2. **Lihat "Delay Strategies Used"**:
   - behavioral: X times
   - random: Y times
   - session_based: Z times

#### **D. Anti-Detection Testing**
1. **Check "Anti-Detection" section**:
   - Stealth Mode: ✅
   - Random Delays: ✅
   - Variable Timing: ✅
   - Behavior Sim: ✅

### **Step 4: Testing Smartlink Rotator**

#### **A. Visual Testing**
1. **Buka halaman utama** - lihat smartlink grid
2. **Buka halaman video** - lihat smartlink di berbagai posisi

#### **B. Rotation Testing**
1. **Wait 10 detik** - smartlink akan rotasi
2. **Lihat perubahan label**:
   - Premium Content → Exclusive Videos → Special Offers

#### **C. Analytics Testing**
1. **Klik smartlink** - akan tracking
2. **Check localStorage**:
```javascript
// Di browser console
localStorage.getItem('smartlink_analytics')
```

### **Step 5: Testing Browser Compatibility**

#### **A. Desktop Testing**
1. **Chrome**: Test semua features
2. **Firefox**: Test popup settings
3. **Edge**: Test compatibility
4. **Safari**: Test jika available

#### **B. Mobile Testing**
1. **Chrome Mobile**: Test touch events
2. **Safari Mobile**: Test iOS compatibility
3. **Android Browser**: Test general functionality

---

## 🔧 **Advanced Testing Tools**

### **1. Console Commands**

#### **Check System Status**
```javascript
// Delay Popunder Status
localStorage.getItem('delay_popunder_data')

// Smartlink Analytics
localStorage.getItem('smartlink_analytics')

// Session Data
JSON.parse(localStorage.getItem('delay_popunder_data') || '{}')
```

#### **Manual Testing**
```javascript
// Trigger manual delay popunder
// Klik button "Delayed Trigger" di debug panel

// Clear all delays
// Klik button "Clear Delays" di debug panel

// Reset semua data
// Klik button "Reset All" di debug panel
```

### **2. Network Testing**

#### **Check Script Loading**
1. **Buka DevTools** (F12)
2. **Tab Network**
3. **Refresh halaman**
4. **Cari script**: `4388c91d89682a21f68164b288c042f9.js`
5. **Status**: Should be 200 (loaded)

#### **Check AdBlock Detection**
```javascript
// Di console
// Debug panel akan menunjukkan "AdBlock Detected: true/false"
```

### **3. Performance Testing**

#### **Monitor Performance**
```javascript
// Di debug panel lihat:
// - Session count progression
// - Delay strategy distribution
// - Active delays count
// - Trigger success rate
```

#### **Load Testing**
1. **Rapid click testing** - test global cooldown
2. **Multiple events** - test event handling
3. **Long session** - test hourly reset

---

## 📊 **Expected Results**

### **Delay Popunder (Stealth Mode)**
- ✅ Debug panel muncul (orange)
- ✅ Script loaded successfully
- ✅ AdBlock detection working
- ✅ Delays ter-schedule dengan benar
- ✅ 3 delay strategies aktif:
  - behavioral: 20±10s
  - random: 30±15s  
  - session_based: 45±20s
- ✅ Anti-detection features aktif
- ✅ Event triggers berfungsi

### **Smartlink Rotator**
- ✅ Rotasi setiap 10 detik
- ✅ 3 smartlink bergantian
- ✅ Analytics tracking berfungsi
- ✅ Progress indicator animasi
- ✅ Close button berfungsi

### **Overall System**
- ✅ Tidak ada error di console
- ✅ Semua components berfungsi
- ✅ Debug panels informative
- ✅ Performance optimal
- ✅ Mobile compatibility

---

## 🚨 **Troubleshooting Testing**

### **Jika Debug Panel Tidak Muncul**
```bash
# Pastikan development mode
export NODE_ENV=development
npm run dev
```

### **Jika Script Tidak Load**
1. **Check network tab** - cari script errors
2. **Check AdBlock** - disable untuk testing
3. **Check console** - lihat error messages

### **Jika Delays Tidak Berfungsi**
1. **Check "Can Trigger" status**
2. **Clear active delays**
3. **Reset session data**
4. **Test manual trigger**

### **Jika Smartlink Tidak Rotasi**
1. **Wait 10 detik** - pastikan cukup waktu
2. **Check browser console** - lihat errors
3. **Refresh halaman** - restart rotation

---

## 📱 **Mobile Testing Specific**

### **iOS Testing**
1. **Safari Mobile** - test touch events
2. **Chrome iOS** - test compatibility
3. **Check debug panel** - should work

### **Android Testing**
1. **Chrome Mobile** - full functionality
2. **Samsung Browser** - basic testing
3. **Check performance** - mobile optimization

---

## 🎯 **Success Criteria**

### **✅ Testing Success Indicators**

1. **Debug Panel Visible**
   - Muncul di bottom-right
   - Menampilkan data real-time
   - Buttons berfungsi

2. **Delay System Working**
   - Scripts loaded
   - Delays ter-schedule
   - Anti-detection aktif
   - Event triggers berfungsi

3. **Smartlink Rotating**
   - Rotasi otomatis
   - Analytics tracking
   - Visual indicators

4. **No Errors**
   - Console clean
   - Network requests successful
   - Performance optimal

5. **Cross-Platform**
   - Desktop browsers work
   - Mobile browsers work
   - Touch events responsive

---

## 🔄 **Production Testing**

### **Setelah Deploy**
1. **Clear browser cache**
2. **Test di production URL**
3. **Check debug panel** (tidak akan muncul di production)
4. **Monitor analytics**
5. **Test user interactions**

### **Production Monitoring**
```javascript
// Check production data
localStorage.getItem('delay_popunder_data')
localStorage.getItem('smartlink_analytics')

// Monitor performance
// Debug panel tidak visible di production
// tapi sistem tetap berfungsi
```

---

## 📝 **Testing Checklist**

### **Pre-Launch Checklist**
- [ ] Development mode aktif
- [ ] Debug panels visible
- [ ] Script loading successful
- [ ] Delay strategies working
- [ ] Smartlink rotating
- [ ] Analytics tracking
- [ ] Mobile compatibility
- [ ] No console errors
- [ ] Performance optimal

### **Post-Launch Checklist**
- [ ] Production deployment
- [ ] Cache cleared
- [ ] Real user testing
- [ ] Analytics monitoring
- [ ] Error tracking
- [ ] Performance monitoring

---

## 🎯 **Final Testing Command**

### **Complete Test Sequence**
```bash
# 1. Start development
npm run dev

# 2. Open browser
# http://localhost:3000

# 3. Test Delay Popunder
# - Lihat debug panel (orange)
# - Click "Delayed Trigger"
# - Test events (click, scroll, etc.)
# - Check delay strategies

# 4. Test Smartlink Rotator
# - Wait 10 seconds
# - See rotation
# - Click smartlink

# 5. Check Console
# - No errors
# - Success messages

# 6. Test Mobile
# - Open devtools mobile view
# - Test touch events

# 7. Reset & Repeat
# - Click "Reset All"
# - Test again
```

Ikuti guide ini untuk memastikan semua sistem berfungsi dengan optimal!
