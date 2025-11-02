# Your Bite - Complete Setup Guide 🚀

This guide will walk you through setting up the Your Bite Order Management System from scratch.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Firebase account (free tier is sufficient)
- A code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:
- React 18
- React Router v6
- Firebase SDK
- Tailwind CSS
- Vite

### 2. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `your-bite-management` (or your choice)
4. Disable Google Analytics (optional for this project)
5. Click "Create Project"

### 3. Enable Firestore Database

1. In your Firebase project, go to **Build** → **Firestore Database**
2. Click "Create database"
3. Select "Start in test mode" (we'll add rules later)
4. Choose your preferred location (closest to your users)
5. Click "Enable"

### 4. Get Firebase Configuration

1. In Firebase Console, click the gear icon ⚙️ → **Project settings**
2. Scroll down to "Your apps" section
3. Click the web icon `</>` to add a web app
4. Register app with nickname: "Your Bite Web"
5. Copy the `firebaseConfig` object

It should look like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-bite-management.firebaseapp.com",
  projectId: "your-bite-management",
  storageBucket: "your-bite-management.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

### 5. Update Firebase Configuration in Project

Open `src/firebase.js` and replace the placeholder config with your actual Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 6. Deploy Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace the existing rules with:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Dishes collection
    match /dishes/{dishId} {
      allow read, write: if true;
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read, write: if true;
    }
  }
}
```

3. Click **Publish**

**Note:** These rules allow unrestricted access. For production, you should add authentication.

### 7. Run Development Server

```bash
npm run dev
```

Your app should now be running at `http://localhost:5173` 🎉

## First Time Usage

### Add Your First Menu Items

1. Navigate to the **Menu** page (Home)
2. Click "➕ Add New Dish"
3. Fill in the form:
   - **Name:** e.g., "Pasta Alfredo"
   - **Price:** e.g., 450
   - **Category:** Select from dropdown
   - **Image URL:** (Optional) Paste an image URL or leave empty for default
   - **Available:** Keep checked
4. Click "Add Dish"

Repeat for all your menu items!

### Test Order Flow

1. Go to **Take Order** page
2. Click "Add to Order" on menu items
3. Adjust quantities in the cart sidebar
4. Click "Place Order"
5. You should see a confirmation: "Order #101 placed successfully! 🎉"

### Manage Orders in Kitchen

1. Go to **Kitchen** page
2. You'll see your placed order with status "Pending"
3. Change status using the dropdown:
   - Pending → Preparing → Ready → Delivered
4. Orders update in real-time!

### View Analytics

1. Go to **Dashboard** page
2. See total orders, sales, and most sold items
3. Click "📥 Export CSV" to download order data

## Deployment Guide

### Option 1: Deploy to Vercel (Recommended)

1. Install Vercel CLI (optional):
   ```bash
   npm install -g vercel
   ```

2. Push your code to GitHub

3. Go to [vercel.com](https://vercel.com)

4. Click "New Project"

5. Import your GitHub repository

6. Configure:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

7. Click "Deploy"

Your app will be live at `https://your-bite-xxxx.vercel.app`

### Option 2: Deploy to Netlify

1. Build your project:
   ```bash
   npm run build
   ```

2. Go to [netlify.com](https://netlify.com)

3. Drag and drop the `dist` folder

4. Your app is live!

### Option 3: Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase Hosting:
   ```bash
   firebase init hosting
   ```
   
   - Select your Firebase project
   - Public directory: `dist`
   - Single-page app: `Yes`
   - GitHub integration: `No`

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy
   ```

## Troubleshooting

### Issue: "npm is not recognized"

**Solution:** Install Node.js from [nodejs.org](https://nodejs.org/)

### Issue: Firestore permission denied

**Solution:** 
1. Check your Firestore rules are published
2. Verify your Firebase config in `src/firebase.js` is correct

### Issue: Orders not showing up

**Solution:**
1. Check browser console for errors
2. Verify Firestore collections exist (`dishes` and `orders`)
3. Check Firebase project is active

### Issue: Build fails

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

## Customization Tips

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  primary: '#YOUR_COLOR',
  secondary: '#YOUR_COLOR',
  // ...
}
```

### Add More Categories

Edit category arrays in:
- `src/pages/MenuPage.jsx`
- `src/pages/OrdersPage.jsx`

### Modify Order Number Format

In `src/pages/OrdersPage.jsx`, find the `handlePlaceOrder` function and modify:

```javascript
orderNumber: `#${orderNumber}` // Change format here
```

## Best Practices

1. **Regular Backups:** Export your Firestore data regularly
2. **Test Mode:** Test new features on a separate Firebase project first
3. **Mobile Testing:** Always test on actual mobile devices
4. **Performance:** Monitor Firebase usage in Firebase Console
5. **Updates:** Keep dependencies updated with `npm update`

## Support & Resources

- **Firebase Documentation:** https://firebase.google.com/docs
- **React Documentation:** https://react.dev
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Vite Documentation:** https://vitejs.dev

## Next Steps

- [ ] Add authentication for admin access
- [ ] Implement order notifications (email/SMS)
- [ ] Add print receipt functionality
- [ ] Create customer-facing order status page
- [ ] Add inventory management
- [ ] Integrate payment gateway

---

**Need Help?**

If you encounter any issues, check the browser console for error messages and refer to the Firebase Console for database issues.

**Serving Bites That Feel Right 🍔💛**
