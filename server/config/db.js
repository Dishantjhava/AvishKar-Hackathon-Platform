const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    if (uri && uri.includes(":@")) {
      uri = uri.replace(":@", ":%40");
    }
    
    // Attempt standard connection
    let conn;
    try {
      conn = await mongoose.connect(uri);
    } catch (dnsErr) {
      if (dnsErr.message.includes("querySrv") || dnsErr.message.includes("ECONNREFUSED")) {
        console.log("⚠️ Local DNS failed to resolve MongoDB SRV. Switching to Google DNS fallback (8.8.8.8)...");
        require("dns").setServers(["8.8.8.8", "8.8.4.4"]);
        conn = await mongoose.connect(uri);
      } else {
        throw dnsErr;
      }
    }

    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
