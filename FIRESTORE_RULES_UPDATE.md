# How to Update Firestore Rules

## Issue
The customer database is not working because Firestore rules don't include the `customers` collection.

## Solution - Update Rules in Firebase Console

Since Firebase CLI is not installed, update the rules manually:

### Step 1: Go to Firebase Console
1. Open https://console.firebase.google.com/
2. Select your project: **Your Bite Management System**
3. Click on **Firestore Database** in the left sidebar
4. Click on the **Rules** tab at the top

### Step 2: Replace the Current Rules
Replace ALL the current rules with this:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Dishes collection - Allow all operations for now (no auth)
    match /dishes/{dishId} {
      allow read, write: if true;
    }
    
    // Orders collection - Allow all operations for now (no auth)
    match /orders/{orderId} {
      allow read, write: if true;
    }
    
    // Customers collection - Allow all operations for now (no auth)
    match /customers/{customerId} {
      allow read, write: if true;
    }
  }
}
```

### Step 3: Publish the Rules
1. Click the **Publish** button
2. Wait for confirmation that rules are published

### Step 4: Refresh Your App
1. Reload http://localhost:5173
2. Try placing an order with customer information
3. Check the Customers page

## What Changed
Added this new rule to allow read/write access to the customers collection:

```
// Customers collection - Allow all operations for now (no auth)
match /customers/{customerId} {
  allow read, write: if true;
}
```

## Verification
After updating:
1. Orders should save successfully
2. Customer page should load without errors
3. No "permission denied" errors in console
