# Your Bite - Order Management System 🚐🍔

A fully functional web-based food stall order management system for **Your Bite** - built with React, Firebase, and Tailwind CSS.

![Your Bite](https://img.shields.io/badge/Your_Bite-FFD54F?style=for-the-badge&logo=food&logoColor=5D4037)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🎨 Brand Identity

- **Logo:** 🚐 Yellow food cart
- **Slogan:** "Serving Bites That Feel Right 🍔💛"
- **Instagram:** [@your_bite_official](https://instagram.com/your_bite_official)

### Color Palette

- **Primary:** `#FFD54F` (Warm Yellow)
- **Secondary:** `#5D4037` (Rich Brown)
- **Background:** `#FFF8E1` (Soft Cream)
- **Text:** `#212121` (Dark Charcoal)
- **Font:** Poppins

## ✨ Features

### 1️⃣ Menu Management (CRUD)
- Add, edit, and delete menu items
- Each dish includes: name, price, category, image URL, availability status
- Real-time synchronization with Firebase Firestore
- Category-based organization (Pizza, Pasta, Burgers, Desserts, Beverages, Sides)

### 2️⃣ Order Taking Page
- Browse menu with image cards
- Filter by category
- Add items to cart with quantity control
- Floating cart sidebar (responsive)
- Auto-generated order IDs
- Order confirmation popup

### 3️⃣ Kitchen Dashboard
- View all orders in real-time
- Update order status (Pending → Preparing → Ready → Delivered)
- Color-coded status badges:
  - 🟡 Pending
  - 🟠 Preparing
  - 🟢 Ready
  - ⚪ Delivered
- Filter orders by status
- Status summary cards

### 4️⃣ Sales Dashboard
- Total orders count
- Total sales revenue
- Most sold item
- Revenue breakdown by status
- Recent orders table
- Export data as CSV

## 🚀 Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Database:** Firebase Firestore
- **Routing:** React Router v6
- **Icons:** Emoji-based (no dependencies)

## 📦 Project Structure

```
src/
├── components/
│   ├── MenuCard.jsx       # Dish card component
│   ├── OrderCart.jsx      # Shopping cart sidebar
│   ├── OrderRow.jsx       # Kitchen order row
│   └── Navbar.jsx         # Navigation bar
├── pages/
│   ├── MenuPage.jsx       # Menu management (CRUD)
│   ├── OrdersPage.jsx     # Order taking interface
│   ├── KitchenPage.jsx    # Kitchen dashboard
│   └── DashboardPage.jsx  # Sales analytics
├── firebase.js            # Firebase configuration
├── App.jsx                # Main app with routing
├── main.jsx               # Entry point
└── styles/
    └── globals.css        # Global styles & Tailwind
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database**
4. Go to Project Settings → General → Your apps
5. Copy your Firebase config
6. Update `src/firebase.js` with your configuration:

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

### 3. Deploy Firestore Rules

In Firebase Console → Firestore Database → Rules, paste the content from `firestore.rules`:

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

### 4. Run Development Server

```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

## 🌐 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Deploy!

### Deploy to Netlify

1. Build the project:
   ```bash
   npm run build
   ```
2. Drag and drop the `dist` folder to [Netlify](https://netlify.com)

## 📱 Responsive Design

- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1919px)
- ✅ Mobile (320px - 767px)

The cart sidebar becomes a floating button with slide-out drawer on mobile devices.

## 🗄️ Firestore Collections

### `dishes` Collection

```javascript
{
  name: "Pasta Alfredo",
  price: 450,
  category: "Pasta",
  imageUrl: "https://...",
  isAvailable: true
}
```

### `orders` Collection

```javascript
{
  orderNumber: "#104",
  items: [
    { name: "Pasta Alfredo", price: 450, quantity: 1 },
    { name: "Fudge Brownie", price: 200, quantity: 2 }
  ],
  total: 850,
  status: "Pending",
  createdAt: timestamp
}
```

## 🎯 Usage Workflow

1. **Setup Menu** → Go to Menu page and add your dishes
2. **Take Orders** → Navigate to Orders page, select items, place order
3. **Manage Kitchen** → Use Kitchen page to update order statuses
4. **View Analytics** → Check Dashboard for sales insights
5. **Export Data** → Download CSV reports from Dashboard

## 🔐 Security Notes

- Current rules allow public read/write (suitable for internal use)
- For production, consider adding authentication
- Add rate limiting for API calls
- Implement proper validation

## 📄 License

© 2025 Your Bite. All rights reserved.

## 🙏 Credits

Built with ❤️ for Your Bite food stall operations.

---

**Serving Bites That Feel Right 🍔💛**

Follow us on Instagram: [@your_bite_official](https://instagram.com/your_bite_official)
