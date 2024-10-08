const express = require("express")
const http = require("http")
const app  = express();
const server = http.createServer(app);
import { Server } from 'socket.io';

const io = new Server(server, {
    cors:{
        origin: "*"
    }
})


type Point = {x:number, y:number}

type DrawLine = {
    prevPoint: Point | null,
    currentPoint: Point,
    color: string,
    strokeWidth: number
}

io.on("connection", (socket:any)=>{

    // getting the state
    socket.on("canvas-state", (state)=>{
        socket.broadcast.emit("canvas-state-from-server", state)
    })
    socket.on("draw-line", ({prevPoint, currentPoint, strokeWidth, color}:DrawLine)=>{
        socket.broadcast.emit("draw-line", {prevPoint, currentPoint, strokeWidth, color})
    })
    socket.on("client-ready", ()=>{
        socket.broadcast.emit("get-canvas-state")
    })
    socket.on("clear", ()=>io.emit('clear'))
})




server.listen(4000, ()=>{
    console.log("server is started on port 4000")
})