const uri = "mongodb://sakthiswaran451_db_user:Sakthi1234@cluster0-shard-00-00.iuslyqu.mongodb.net:27017,cluster0-shard-00-01.iuslyqu.mongodb.net:27017,cluster0-shard-00-02.iuslyqu.mongodb.net:27017/ai-performance-suite?ssl=true&replicaSet=atlas-f35giv-shard-0&authSource=admin&retryWrites=true&w=majority";
console.log("URI Length:", uri.length);
console.log("URI Start:", uri.substring(0, 50));
console.log("URI End:", uri.substring(uri.length - 50));
for (let i = 0; i < uri.length; i++) {
    if (uri[i] === "'") console.log("Single quote found at index:", i);
}
