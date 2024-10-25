// results-screen/screen2.js
import { router, socket } from "../routes.js";

export default function renderScreen2() {
  const app = document.getElementById("app");
  
  // Aseguramos que el botón y los elementos necesarios sean generados correctamente
  app.innerHTML = `
        <h1>Pantalla de Ganador</h1>
        <h2 id="winner-message"></h2>
        <ul id="final-score-list"></ul>
        <button id="sort-alphabetically">Ordenar Alfabéticamente</button>
    `;

  const sortButton = document.getElementById("sort-alphabetically");

  // Función para actualizar la lista de jugadores
  const updatePlayerList = (players) => {
    const finalScoreList = document.getElementById("final-score-list");
    finalScoreList.innerHTML = ""; // Limpiar la lista anterior

    // Ordenar jugadores por puntuación de mayor a menor
    players.sort((a, b) => b.score - a.score);
    players.forEach((player, index) => {
      const playerItem = document.createElement("li");
      playerItem.textContent = `${index + 1}. ${player.nickname} (${player.score} pts)`;
      finalScoreList.appendChild(playerItem);
    });
  };

  socket.on("updateScores", (players) => {
    const winnerMessage = document.getElementById("winner-message");

    // Verificar si alguien ha alcanzado 100 puntos
    const winner = players.find((player) => player.score >= 100);
    if (winner) {
      winnerMessage.textContent = `¡Felicidades, ${winner.nickname}! Has ganado el juego.`;

      // Reiniciar la lista y mostrar los jugadores ordenados por puntuación
      updatePlayerList(players);
    }
  });

  // Asegurar que el botón sea visible y funcional
  if (sortButton) {
    sortButton.style.display = "block"; // Hacer visible el botón
    sortButton.addEventListener("click", () => {
      const finalScoreList = document.getElementById("final-score-list");
      const sortedPlayers = Array.from(finalScoreList.children).sort((a, b) =>
        a.textContent.localeCompare(b.textContent)
      );
      finalScoreList.innerHTML = ""; // Limpiar lista actual
      sortedPlayers.forEach((playerItem) => finalScoreList.appendChild(playerItem));
    });
  }
}
