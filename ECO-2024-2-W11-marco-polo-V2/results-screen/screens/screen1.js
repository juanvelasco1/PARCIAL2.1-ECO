// results-screen/screen1.js
import { router, socket } from "../routes.js";

export default function renderScreen1() {
  const app = document.getElementById("app");

  // Generar el contenido de la pantalla, incluyendo el botón de ordenar alfabéticamente
  app.innerHTML = `
        <h1>Resultados en Tiempo Real</h1>
        <ul id="score-list"></ul>
        <button id="sort-alphabetically" style="margin-top: 1rem;">Ordenar Alfabéticamente</button>
    `;

  let currentPlayers = [];

  const updatePlayerList = (players) => {
    const scoreList = document.getElementById("score-list");
    scoreList.innerHTML = "";

    players.forEach((player, index) => {
      const playerItem = document.createElement("li");
      playerItem.textContent = `${index + 1}. ${player.nickname} (${player.score} pts)`;
      scoreList.appendChild(playerItem);
    });
  };

  socket.on("updateScores", (players) => {
    currentPlayers = players; // Actualizar la lista actual de jugadores
    updatePlayerList(players); // Actualizar la lista en la pantalla
  });

  // Escuchar el evento 'restartGame' para reiniciar las puntuaciones
  socket.on("restartGame", (players) => {
    currentPlayers = players;
    updatePlayerList(players); // Reiniciar la lista con puntuaciones en 0
  });

  const sortButton = document.getElementById("sort-alphabetically");
  if (sortButton) {
    sortButton.addEventListener("click", () => {
      const sortedPlayers = [...currentPlayers].sort((a, b) =>
        a.nickname.localeCompare(b.nickname)
      );
      updatePlayerList(sortedPlayers);
    });
  }
}
