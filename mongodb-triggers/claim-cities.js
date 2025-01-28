exports = async function () {
    const serviceName = "shawsoft-mongodb";
    const database = "strava_app";
    const collectionName = "activity_detail";
    const collection = context.services.get(serviceName).db(database).collection(collectionName);
  
    try {
      // Get the list of all unique cities in the collection
      const cities = await collection.distinct("city");
  
      if (cities.length === 0) {
        console.log("No cities found in the collection.");
        return;
      }
  
      console.log(`Processing claimed flags for ${cities.length} cities:`, cities);
  
      for (const city of cities) {
        try {
          // Reset all "claimed" flags for the city 
          const resetResult = await collection.updateMany(
            { city: city },
            { $set: { claimed: false } }
          );
  
          console.log(
            `Reset claimed flags for city: ${city}. Modified count: ${resetResult.modifiedCount}`
          );
  
          // Find the document with the highest activity_points in the city
          const topActivity = await collection
            .find({ city: city })
            .sort({ activity_points: -1 })
            .limit(1)
            .toArray();
  
          if (topActivity.length > 0) {
            const updateResult = await collection.updateOne(
              { _id: topActivity[0]._id },
              { $set: { claimed: true } }
            );
  
            console.log(
              `Marked document as claimed for city: ${city}. Document ID: ${
                topActivity[0]._id
              }. Modified count: ${updateResult.modifiedCount}`
            );
          } else {
            console.log(`No activities found for city: ${city}.`);
          }
        } catch (cityErr) {
          console.error(`Error processing city: ${city}.`, cityErr.message);
        }
      }
    } catch (err) {
      console.error("Error updating claimed flags for all cities:", err.message);
    }
  };