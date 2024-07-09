const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

let activeUsers = [];

io.on("connection", (socket) => {
  // add new user
  socket.on("new-user-add", (newUserId) => {
    if (activeUsers.length > 0) {
      for (let i = 0; i < activeUsers.length; i++) {
        if (activeUsers[i].userId == newUserId) {
          return;
        }
      }
    }

    activeUsers.push({
      userId: newUserId,
      socketId: socket.id,
    });

    io.emit("get-users", activeUsers);
  });

  

  socket.on("sentmassage", (data) => {
    const user = activeUsers.find((u) => u.userId == data.receiverId);
    if (user) {
      socket.to(user.socketId).emit("receivedm", data);
    }
  });

  socket.on("disconnect", () => {
    activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
    io.emit("get-users", activeUsers);
  });
});

const PORT = 8800;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// // Serve static files (e.g., your React build files)

// // Keep track of connected users
// const connectedUsers = [];

// // Socket.IO logic
// io.on('connection', (socket) => {
//   console.log('User connected:', socket.id);

//   // Handle startCall event
//   socket.on('startCall', (stream) => {
//     // Broadcast the 'yourVideoStream' event to all connected clients
//     io.emit('yourVideoStream', stream);
//   });

//   // Handle acceptCall event
//   socket.on('acceptCall', (stream) => {
//     // Broadcast the 'partnerVideoStream' event to all connected clients
//     io.emit('partnerVideoStream', stream);
//   });

//   // Handle other signaling events as needed

//   // Keep track of connected users
//   connectedUsers.push({ id: socket.id, socket });

//   socket.on('disconnect', () => {
//     console.log('User disconnected:', socket.id);
//     // Remove user from the connectedUsers array on disconnect
//     const index = connectedUsers.findIndex(user => user.id === socket.id);
//     if (index !== -1) {
//       connectedUsers.splice(index, 1);
//     }
//   });
// });

// server.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
