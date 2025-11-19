import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose";
import authRoutes from './routes/auth.js'
import cors from 'cors';
import customerRoutes from './routes/customer.js'
import quotationRoutes from './routes/quotation.js'
dotenv.config() // Load env vars
const PORT = 4000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

mongoose.connect(process.env.MONGODB_URI).then(()=> console.log("MONGODB IS CONNECTED SUCCCESSFULLY!")).catch((err)=> console.log(`ERROR while connecting mongo db=> ${err.message} `))


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
// Routes
app.use("/auth", authRoutes);
app.use("/customers", customerRoutes)
app.use("/quotations", quotationRoutes)



// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: err.message });
});

app.listen(PORT, ()=> console.log(`Server is running on http://localhost:${PORT}`))
