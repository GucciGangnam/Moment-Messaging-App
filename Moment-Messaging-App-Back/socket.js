module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('A user connected');

        // Join room
        socket.on('join-room', (roomID) => {
            socket.join(roomID);  // Ensure the socket joins the room
            console.log(`User joined room ${roomID}`);
        });


        // USER UPDATES TO GROUP
        // Join group 
        socket.on('member-added', () => {
            console.log('member-added');
            // Emit 'request-to-update-group-data' to everyone in the room
            io.to([...socket.rooms][1]).emit("member-added");
        });

        // leave group   


        // Listen for 'send-message' event from the client
        socket.on('send-message', (msg, user) => {
            console.log('Received message from client: ', user);
            console.log('Message content: ', msg);
            const roomID = [...socket.rooms][1];  // Get the room ID from the socket's rooms
            // Emit to the specific room
            io.to(roomID).emit('relay-message', { message: msg, user: user });
        });

        socket.on('pin-message', (msg) => {
            console.log('PIN content: ', msg);
            const roomID = [...socket.rooms][1];  // Get the room ID from the socket's rooms
            // Emit to the specific room
            io.to(roomID).emit('relay-pin', { message: msg });

        })

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('User disconnected');
        });

        // Leave room when disconnecting
        socket.on('disconnecting', () => {
            const rooms = Object.keys(socket.rooms);
            rooms.forEach(room => {
                socket.leave(room);
                console.log(`User left room ${room}`);
            });
        });
    });
};
