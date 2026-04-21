import express from "express";
import { config } from "dotenv"; 
import cors from "cors";
import { chats } from "./data/data.js";
import connectDB from "./config/db.js";
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.send("API is Running successfully")

});

app.use('/api/user', userRoutes)

app.use(notFound)
app.use(errorHandler)

// app.get('/api/chat', (req,res)=> {
//     res.send(chats);
// });

// app.get('/api/chat/:id', (req,res)=> {
//     // console.log(req.params.id);
//     const singleChat = chats.find(c => c._id === req.params.id);
//     res.send(singleChat);
// });

const PORT = process.env.PORT || 5000;

app.listen(5000, console.log(`Server started on port ${PORT}`));
