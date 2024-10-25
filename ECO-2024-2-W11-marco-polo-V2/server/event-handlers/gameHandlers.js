// gameHandlers.js

const { assignRoles } = require("../utils/helpers")

// Helper function to update scores
const updateScores = (db, playerId, points) => {
  const player = db.players.find(p => p.id === playerId)
  if (player) {
    player.score = (player.score || 0) + points
  }
}
const restartGameHandler = (socket, db, io) => {
  return () => {
    // Reiniciar las puntuaciones de todos los jugadores a 0
    db.players.forEach((player) => {
      player.score = 0;
    });

    // Emitir el evento de reinicio a todos los clientes
    io.emit("restartGame", db.players);
  };
};

const joinGameHandler = (socket, db, io) => {
  return (user) => {
    db.players.push({ id: socket.id, score: 0, ...user })
    console.log(db.players)
    io.emit("userJoined", db) // Broadcasts the message to all connected clients including the sender
  }
}

const startGameHandler = (socket, db, io) => {
  return () => {
    db.players = assignRoles(db.players)

    db.players.forEach((element) => {
      io.to(element.id).emit("startGame", element.role)
    })
  }
}

const notifyMarcoHandler = (socket, db, io) => {
  return () => {
    const rolesToNotify = db.players.filter(
      (user) => user.role === "polo" || user.role === "polo-especial"
    )

    rolesToNotify.forEach((element) => {
      io.to(element.id).emit("notification", {
        message: "Marco!!!",
        userId: socket.id,
      })
    })
  }
}

const notifyPoloHandler = (socket, db, io) => {
  return () => {
    const rolesToNotify = db.players.filter((user) => user.role === "marco")

    rolesToNotify.forEach((element) => {
      io.to(element.id).emit("notification", {
        message: "Polo!!",
        userId: socket.id,
      })
    })
  }
}


const onSelectPoloHandler = (socket, db, io) => {
  return (userID) => {
    const myUser = db.players.find((user) => user.id === socket.id)
    const poloSelected = db.players.find((user) => user.id === userID)

    if (poloSelected.role === "polo-especial") {
      // Update scores
      updateScores(db, myUser.id, 50) // Marco gains 50 points
      updateScores(db, poloSelected.id, -10) // Polo especial loses 10 points

      // Notify all players that the game is over
      db.players.forEach((element) => {
        io.to(element.id).emit("notifyGameOver", {
          message: `El marco ${myUser.nickname} ha ganado, ${poloSelected.nickname} ha sido capturado`,
        })
      })
    } else {
      // Update scores
      updateScores(db, myUser.id, -10) // Marco loses 10 points

      // Notify all players that the game is over
      db.players.forEach((element) => {
        io.to(element.id).emit("notifyGameOver", {
          message: `El marco ${myUser.nickname} ha perdido`,
        })
      })
    }

    // Emit updated scores to all clients
    io.emit("updateScores", db.players)
  }
}

module.exports = {
  joinGameHandler,
  startGameHandler,
  notifyMarcoHandler,
  notifyPoloHandler,
  onSelectPoloHandler,
  restartGameHandler,
}
