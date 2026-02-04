const { MongoClient } = require('mongodb');

// URI kontrolü
const uri = process.env.MONGO_URI;

module.exports = async (req, res) => {
    // CORS ayarları
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (!uri) {
        return res.status(500).json({ error: "MONGO_URI eksik! Vercel panelinden ekleyin." });
    }

    const client = new MongoClient(uri);

    try {
        await client.connect();
        const db = client.db('hasan_storage');
        const collection = db.collection('images');

        const images = await collection.find({}).sort({ _id: -1 }).toArray();
        return res.status(200).json(images);

    } catch (error) {
        console.error("Hata Detayı:", error);
        return res.status(500).json({ error: "DB Bağlantı Hatası: " + error.message });
    } finally {
        await client.close();
    }
};
