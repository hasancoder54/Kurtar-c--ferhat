const { MongoClient } = require('mongodb');

// Environment Variable (Vercel/Netlify panelinden eklediğin MONGO_URI)
const uri = process.env.MONGO_URI; 
const client = new MongoClient(uri);

export default async function handler(req, res) {
    // CORS ayarları (Frontend'den erişim için)
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        await client.connect();
        const db = client.db('hasan_storage');
        const collection = db.collection('images');

        // SADECE GÖRSELLERİ GETİRME (GET İSTEĞİ)
        if (req.method === 'GET') {
            // .sort({ _id: -1 }) -> En son eklenen en üstte görünür
            const images = await collection.find({}).sort({ _id: -1 }).toArray();
            return res.status(200).json(images);
        }

        // GÖRSEL EKLEME (POST İSTEĞİ - Yönetim panelinden yükleme yaparken çalışır)
        if (req.method === 'POST') {
            const { url } = req.body;
            if (!url) return res.status(400).json({ error: "URL gerekli" });
            
            const result = await collection.insertOne({ 
                url, 
                createdAt: new Date() 
            });
            return res.status(201).json(result);
        }

        // GÖRSEL SİLME (DELETE İSTEĞİ)
        if (req.method === 'DELETE') {
            const { id } = req.query;
            const { ObjectId } = require('mongodb');
            await collection.deleteOne({ _id: new ObjectId(id) });
            return res.status(200).json({ message: 'Görsel silindi' });
        }

    } catch (error) {
        console.error("MongoDB Hatası:", error);
        return res.status(500).json({ error: "Sunucu hatası: " + error.message });
    } finally {
        // Bağlantıyı açık bırakmak serverless fonksiyonlarda bazen daha hızlıdır 
        // ama güvenlik/limit için kapatıyoruz.
        await client.close();
    }
}
