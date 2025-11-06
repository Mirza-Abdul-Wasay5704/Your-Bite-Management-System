import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

/**
 * Migration script to add servingSize field to all existing dishes
 * Run this once to update the database
 */
export const migrateServingSize = async () => {
  try {
    console.log('Starting migration: Adding servingSize to all dishes...');
    
    const dishesRef = collection(db, 'dishes');
    const snapshot = await getDocs(dishesRef);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    const updatePromises = snapshot.docs.map(async (dishDoc) => {
      const dishData = dishDoc.data();
      
      // Only update if servingSize doesn't exist
      if (!dishData.servingSize) {
        await updateDoc(doc(db, 'dishes', dishDoc.id), {
          servingSize: 'Single Serving' // Default value
        });
        console.log(`✅ Updated dish: ${dishData.name} (ID: ${dishDoc.id})`);
        updatedCount++;
      } else {
        console.log(`⏭️ Skipped dish: ${dishData.name} (already has servingSize)`);
        skippedCount++;
      }
    });
    
    await Promise.all(updatePromises);
    
    console.log('\n🎉 Migration Complete!');
    console.log(`✅ Updated: ${updatedCount} dishes`);
    console.log(`⏭️ Skipped: ${skippedCount} dishes`);
    console.log(`📊 Total: ${snapshot.docs.length} dishes`);
    
    return {
      success: true,
      updated: updatedCount,
      skipped: skippedCount,
      total: snapshot.docs.length
    };
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
