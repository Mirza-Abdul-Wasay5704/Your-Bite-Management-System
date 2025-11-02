// Sample data for Your Bite - Use this to quickly populate your menu

export const sampleDishes = [
  {
    name: "Chicken Tikka Pizza",
    price: 650,
    category: "Pizza",
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    isAvailable: true
  },
  {
    name: "Margherita Pizza",
    price: 550,
    category: "Pizza",
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
    isAvailable: true
  },
  {
    name: "Pasta Alfredo",
    price: 450,
    category: "Pasta",
    imageUrl: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    isAvailable: true
  },
  {
    name: "Spaghetti Bolognese",
    price: 500,
    category: "Pasta",
    imageUrl: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=400",
    isAvailable: true
  },
  {
    name: "Classic Beef Burger",
    price: 400,
    category: "Burgers",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400",
    isAvailable: true
  },
  {
    name: "Chicken Burger",
    price: 380,
    category: "Burgers",
    imageUrl: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=400",
    isAvailable: true
  },
  {
    name: "Zinger Burger",
    price: 420,
    category: "Burgers",
    imageUrl: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=400",
    isAvailable: true
  },
  {
    name: "Fudge Brownie",
    price: 200,
    category: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400",
    isAvailable: true
  },
  {
    name: "Chocolate Lava Cake",
    price: 250,
    category: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400",
    isAvailable: true
  },
  {
    name: "Ice Cream Sundae",
    price: 180,
    category: "Desserts",
    imageUrl: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
    isAvailable: true
  },
  {
    name: "Fresh Lemonade",
    price: 120,
    category: "Beverages",
    imageUrl: "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9d?w=400",
    isAvailable: true
  },
  {
    name: "Mango Smoothie",
    price: 150,
    category: "Beverages",
    imageUrl: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400",
    isAvailable: true
  },
  {
    name: "Cold Coffee",
    price: 140,
    category: "Beverages",
    imageUrl: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400",
    isAvailable: true
  },
  {
    name: "French Fries",
    price: 150,
    category: "Sides",
    imageUrl: "https://images.unsplash.com/photo-1576107232684-1279f390859f?w=400",
    isAvailable: true
  },
  {
    name: "Loaded Nachos",
    price: 280,
    category: "Sides",
    imageUrl: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400",
    isAvailable: true
  },
  {
    name: "Onion Rings",
    price: 180,
    category: "Sides",
    imageUrl: "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400",
    isAvailable: true
  }
];

// Function to add sample data to Firestore
// Uncomment and use this in your MenuPage if needed

/*
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';
import { sampleDishes } from './sampleData';

export const addSampleData = async () => {
  try {
    for (const dish of sampleDishes) {
      await addDoc(collection(db, 'dishes'), dish);
    }
    console.log('Sample data added successfully!');
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
};
*/
