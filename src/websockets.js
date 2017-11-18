const websockets = (io, redis) => (socket) => {
  // Client connection
  socket.on('joinApp', (userId) => {
    redis.set(userId, socket.id)
    socket.emit('appJoined')
  })
  socket.on('leaveApp', (userId) => {
    redis.del(userId)
    socket.emit('appLeft')
  })
  // Handle socket disconnected event as an app leaving
  socket.on('disconnect', (userId) => {
    redis.del(userId)
    socket.emit('appLeft')
  })

  // Board connection
  socket.on('joinBoard', boardId => socket.join(boardId))
  socket.on('leaveBoard', boardId => socket.leave(boardId))

  // List management
  socket.on('addList', wrapper => socket.to(wrapper.boardId).emit('addList', wrapper))
  socket.on('renameList', wrapper => socket.to(wrapper.boardId).emit('renameList', wrapper))
  socket.on('moveList', wrapper => socket.to(wrapper.boardId).emit('moveList', wrapper))
  socket.on('deleteList', wrapper => socket.to(wrapper.boardId).emit('deleteList', wrapper))

  // Card management
  socket.on('addCard', wrapper => socket.to(wrapper.boardId).emit('addCard', wrapper))
  socket.on('renameCard', wrapper => socket.to(wrapper.boardId).emit('renameCard', wrapper))
  socket.on('moveCard', wrapper => socket.to(wrapper.boardId).emit('moveCard', wrapper))
  socket.on('deleteCard', wrapper => socket.to(wrapper.boardId).emit('deleteCard', wrapper))
  socket.on('refreshCard', wrapper => socket.to(wrapper.boardId).emit('refreshCard', wrapper))

  // Notifications
  socket.on('notify', (wrapper) => {
    redis.get(wrapper.userId, (err, socketId) => {
      if (socketId) {
        io.to(socketId).emit('notify', wrapper)
      }
    })
  })
}

export default websockets
