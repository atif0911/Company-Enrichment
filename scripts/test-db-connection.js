require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.DATABASE_URL;

if (!uri) {
    console.error("Error: DATABASE_URL is not defined in .env file");
    process.exit(1);
}

console.log("Attempting to connect to MongoDB...");
// console.log("URI:", uri); // Uncomment to debug (be careful with secrets)

mongoose.connect(uri)
  .then(() => {
    console.log("Connection successful!");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Connection failed:", err);
    process.exit(1);
  });
