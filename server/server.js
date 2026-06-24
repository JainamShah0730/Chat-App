import express from "express";
import { config } from "dotenv"; 
import cors from "cors";
import { chats } from "./data/data.js";
import connectDB from "./config/db.js";
import userRoutes from './routes/userRoutes.js';
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes  from "./routes/messageRoutes.js";
import { Server, Socket } from "socket.io";
config();
connectDB();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req,res) => {
    res.send("API is Running successfully")

});

app.use('/api/user', userRoutes)
app.use('/api/chat', chatRoutes)
app.use("/api/message", messageRoutes)

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

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

const server = app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Kill the process using it or set a different PORT.`);
    } else {
        console.error('Server error:', err);
    }
    process.exit(1);
});

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        // Allow Vite dev server origin; adjust if your client runs on a different port
        origin: process.env.CLIENT_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("setup", (userData) => {
        socket.join(userData._id)
        socket.emit("connected")
    });

    socket.on("join chat", (room) => {
        socket.join(room)
        console.log("User Joined Room: "+room)
    })

    socket.on("typing", (room) => socket.in(room).emit("typing"))
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"))


    socket.on("new message",(newMessageRecieved) => {
        var chat = newMessageRecieved.chat

        if(!chat.users) return console.log("chat.users not defined")

            chat.users.forEach(user => {
                if(user._id == newMessageRecieved.sender._id) return

                socket.in(user._id).emit("message recieved", newMessageRecieved)
            })
    })
    socket.off("setup", ()=>{
        console.log("USER DISCONNECTED")
        socket.leave(userData._id)
    })
});