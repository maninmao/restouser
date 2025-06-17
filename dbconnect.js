const mongoose = require('mongoose');

// const uri = "mongodb+srv://gummy13:gummy13@mycluster01.1ykefgc.mongodb.net/cloudnative?retryWrites=true&w=majority&appName=MyCluster01";
const uri = "mongodb+srv://gummy13:gummy13@cluster02.edbdxic.mongodb.net/cloudnative?retryWrites=true&w=majority&appName=Cluster02";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await mongoose.disconnect();
  }
}
run().catch(console.dir);

// STEP-3 : EXPORT MODULE mongoose because we need it in other JS file
module.exports = mongoose;
