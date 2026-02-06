const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://cluster0.iuslyqu.mongodb.net/ai-performance-suite?appName=Cluster0";
const client = new MongoClient(uri, {
    auth: {
        username: "sakthiswaran451_db_user",
        password: "Sakthi1234"
    }
});
async function run() {
    try {
        console.log("Starting connection test...");
        await client.connect();
        console.log("Connected successfully to server ✅");
    } catch (e) {
        console.error("Connection failed ❌");
        console.error(e);
    } finally {
        await client.close();
    }
}
run();
