const http = require('http');
const socketio=require('socket.io');
const getOnlineCount = (io, data) => {
    const room = io.sockets.adapter.rooms[data.roomName];
    return room ? room.length : 0;
};  
const listRooms=(socketP)=>{
    const rooms = Object.keys(socketP.rooms);
    console.log(rooms);
}
const server = http.createServer((req,res)=>{
    res.end('hey!');
});

server.listen(3000);

const io=socketio.listen(server);
io.on('connection',(socket)=>{

    socket.on('joinRoom',(data)=>{
        socket.join(data.roomName,()=>{
            listRooms(socket);
           
            io.to(data.roomName).emit('newJoin',{username:data.username,count: getOnlineCount(io,data) });
            socket.emit('log',data);
        });
    });
    socket.on('leaveRoom',(data)=>{
        socket.leave(data.roomName,()=>{
            listRooms(socket);
            
            io.to(data.roomName).emit('leavedRoom',{username:data.username,count: getOnlineCount(io,data) });
            socket.emit('leavedLog',data);
        });
    });
});

