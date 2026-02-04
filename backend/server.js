import { Server } from 'socket.io'
import { createServer } from 'node:http'
import express from 'express'

const app = express()
const PORT = 5000

const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
    }
})

const ROOM = "room"

io.on('connection', (socket) => {
    console.log("User connected to server:", socket.id)

    socket.on("joinRoom", async (userName) => {

        console.log(`${userName} joined the room`)
        await socket.join(ROOM)

        //send to all
        // io.to(ROOM).emit("RoomNotice", userName)

        //send to all except sender
        socket.to(ROOM).emit("RoomNotice", userName)

        //send message event
        socket.on("chatMessages", (msg) => {
            socket.to(ROOM).emit("chatMessages", msg)
        })

        //typers 
        socket.on('typing', (userName) => {
            socket.to(ROOM).emit('typing', userName)
        })

        //stop typing litening event 
        socket.on("stopTyping", (userName) => {
            socket.to(ROOM).emit("stopTyping", userName)
        })
    })

})


app.get('/', (req, res) => {
    res.send('Hello World!')
})


server.listen(PORT, () => {
    console.log(`server is running on port:${PORT}`)
})