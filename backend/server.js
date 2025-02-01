const dotenv = require('dotenv');
const app = require('./app');
const connectDB = require('./config/database');


// Load env vars
 dotenv.config({ path: './.env' });

 // Connect to Database
 connectDB();

 const PORT = process.env.PORT || 5000;

 const server =  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

 process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err}`);
  server.close(() => process.exit(1));
});