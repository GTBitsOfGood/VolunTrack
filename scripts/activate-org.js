const { MongoClient } = require('mongodb');

async function activateOrganization() {
  const client = new MongoClient(process.env.MONGODB_URI || 'mongodb://localhost:27017');

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('test');
    const result = await db.collection('organizations').updateOne(
      { slug: 'testorg' },
      { $set: { active: true } }
    );

    if (result.matchedCount > 0) {
      console.log('✅ Organization activated successfully!');
      console.log('Modified count:', result.modifiedCount);
    } else {
      console.log('❌ Organization not found. Make sure you created it first.');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

activateOrganization();