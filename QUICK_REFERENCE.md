# Quick Reference Guide 📖

Quick answers to common tasks and questions.

---

## 🚀 Installation & Setup

### Install Dependencies
```bash
npm install
```

### Start Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

---

## 🔥 Firebase Configuration

### Where to Update Firebase Config?
**File:** `src/firebase.js`

Replace these values:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### Get Firebase Config
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click ⚙️ → Project Settings
4. Scroll to "Your apps"
5. Copy the config object

---

## 🎨 Customization

### Change Brand Colors
**File:** `tailwind.config.js`

```javascript
colors: {
  primary: '#FFD54F',    // Change this
  secondary: '#5D4037',  // Change this
  background: '#FFF8E1', // Change this
  text: '#212121',       // Change this
}
```

### Add New Category
**Files to update:**
- `src/pages/MenuPage.jsx` (line ~22)
- `src/pages/OrdersPage.jsx` (line ~16)

```javascript
const categories = ['Pizza', 'Pasta', 'Burgers', 'Desserts', 'Beverages', 'Sides', 'YOUR_NEW_CATEGORY'];
```

### Change Font
**File:** `index.html`

Update Google Fonts link and `tailwind.config.js`:
```javascript
fontFamily: {
  sans: ['Your Font Name', 'sans-serif'],
}
```

---

## 📝 Common Tasks

### Add Sample Data
1. Open `src/sampleData.js`
2. Uncomment the `addSampleData` function at the bottom
3. Import and call it in `MenuPage.jsx`:

```javascript
import { addSampleData } from '../sampleData';

// Add a button in your component:
<button onClick={addSampleData}>Load Sample Data</button>
```

### Clear All Orders
In Firebase Console:
1. Go to Firestore Database
2. Select `orders` collection
3. Delete all documents

Or add this function to your code:
```javascript
import { collection, getDocs, deleteDoc } from 'firebase/firestore';

const clearAllOrders = async () => {
  const querySnapshot = await getDocs(collection(db, 'orders'));
  querySnapshot.forEach(async (doc) => {
    await deleteDoc(doc.ref);
  });
};
```

### Export All Dishes
Use the same CSV export logic from Dashboard but for dishes.

### Change Order Number Format
**File:** `src/pages/OrdersPage.jsx`

Find `handlePlaceOrder` function, line ~70:
```javascript
orderNumber: `#${orderNumber}` // Change format here
// Examples:
// orderNumber: `ORD-${orderNumber}`
// orderNumber: `YB${orderNumber}`
```

---

## 🔍 Troubleshooting

### "Permission Denied" Error
**Solution:** Check Firestore rules are published

In Firebase Console → Firestore → Rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /dishes/{dishId} {
      allow read, write: if true;
    }
    match /orders/{orderId} {
      allow read, write: if true;
    }
  }
}
```

### Orders Not Showing
1. Check browser console for errors
2. Verify Firebase config in `src/firebase.js`
3. Check Firestore has `orders` collection
4. Clear browser cache

### Images Not Loading
- Verify image URL is correct and accessible
- Check CORS settings if using custom image server
- Images from Unsplash should work by default

### Build Fails
```bash
# Clear everything and reinstall
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### App Won't Start
1. Check Node.js version: `node --version` (should be v16+)
2. Delete `node_modules` and reinstall
3. Check for port conflicts (default: 5173)

---

## 🌐 Deployment

### Deploy to Vercel
```bash
# Option 1: Via GitHub
1. Push code to GitHub
2. Go to vercel.com
3. Import repository
4. Deploy

# Option 2: Via CLI
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
# Build first
npm run build

# Then drag & drop 'dist' folder to netlify.com
# Or use CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## 📊 Data Management

### Backup Firestore Data
Firebase Console → Firestore → Import/Export

Or use Firebase CLI:
```bash
firebase firestore:export backup-folder
```

### Restore Firestore Data
```bash
firebase firestore:import backup-folder
```

### Reset to Default
1. Delete all documents in `dishes` collection
2. Delete all documents in `orders` collection
3. Add sample data using `sampleData.js`

---

## 🔐 Security

### Make Production-Ready
1. Enable Firebase Authentication
2. Update Firestore rules:
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Add login page
4. Protect routes

---

## 📱 Testing

### Test on Mobile
1. Start dev server: `npm run dev`
2. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. On mobile browser: `http://YOUR_IP:5173`

### Test Responsive Design
In browser DevTools:
- Press F12
- Click device toolbar icon
- Select different devices

---

## ⚡ Performance Tips

### Optimize Images
- Use WebP format
- Compress images before upload
- Use CDN for hosting

### Reduce Bundle Size
```javascript
// Use dynamic imports
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
```

### Add Service Worker (PWA)
Install Vite PWA plugin:
```bash
npm install vite-plugin-pwa -D
```

---

## 🎯 Keyboard Shortcuts

### Development
- `Ctrl + C` - Stop dev server
- `Ctrl + Shift + R` - Hard refresh browser

### Browser DevTools
- `F12` - Open DevTools
- `Ctrl + Shift + C` - Inspect element
- `Ctrl + Shift + M` - Toggle device toolbar

---

## 📋 File Locations Quick Reference

| What | Where |
|------|-------|
| Firebase Config | `src/firebase.js` |
| Colors | `tailwind.config.js` |
| Global Styles | `src/styles/globals.css` |
| Menu Page | `src/pages/MenuPage.jsx` |
| Order Page | `src/pages/OrdersPage.jsx` |
| Kitchen Page | `src/pages/KitchenPage.jsx` |
| Dashboard Page | `src/pages/DashboardPage.jsx` |
| Navigation | `src/components/Navbar.jsx` |
| Sample Data | `src/sampleData.js` |
| Security Rules | `firestore.rules` |

---

## 🔗 Useful Links

- **Firebase Console:** https://console.firebase.google.com/
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Tailwind Docs:** https://tailwindcss.com/docs
- **React Router Docs:** https://reactrouter.com/
- **Vite Docs:** https://vitejs.dev/

---

## 💡 Tips & Tricks

### Fast Development
1. Use browser DevTools for real-time CSS editing
2. Keep Firebase Console open in another tab
3. Use React DevTools extension

### Avoid Common Mistakes
- ✅ Always update both category arrays when adding categories
- ✅ Test on actual mobile devices before launch
- ✅ Backup Firestore data before major changes
- ✅ Use `.env.local` for sensitive Firebase config
- ✅ Clear browser cache after deploying changes

### Best Practices
- Commit code frequently to Git
- Test thoroughly before deployment
- Keep dependencies updated
- Monitor Firebase usage
- Export data regularly

---

## 🆘 Getting Help

1. **Check documentation:**
   - README.md
   - SETUP_GUIDE.md
   - This file

2. **Check console:**
   - Browser console (F12)
   - Terminal output

3. **Common issues:**
   - Firebase config incorrect
   - Firestore rules not published
   - Dependencies not installed
   - Port already in use

4. **Still stuck?**
   - Check Firebase Console for errors
   - Verify all files are saved
   - Restart dev server
   - Clear browser cache

---

**Quick Start Checklist:**
- [ ] npm install
- [ ] Update Firebase config
- [ ] Deploy Firestore rules
- [ ] npm run dev
- [ ] Add menu items
- [ ] Test order flow
- [ ] Deploy to production

---

**Serving Bites That Feel Right 🍔💛**
