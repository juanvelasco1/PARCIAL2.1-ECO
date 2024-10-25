// results-screen/routes.js
import renderScreen1 from "./screens/screen1.js";
import renderScreen2 from "./screens/screen2.js";
import socket from "./socket.js";

const router = new Router({
  mode: "hash",
  page404: (path) => {
    const app = document.getElementById("app");
    app.innerHTML = `<h1>404 - Not Found</h1><p>The page you are looking for does not exist.</p>`;
  },
});

function clearScripts() {
  document.getElementById("app").innerHTML = "";
}

router.add("/", async () => {
  clearScripts();
  renderScreen1(); // Pantalla de resultados en tiempo real
});

router.add("/screen2", async () => {
  clearScripts();
  renderScreen2(); // Pantalla del ganador
});

router.check().addUriListener();

window.addEventListener("popstate", () => {
  router.check();
});

document.addEventListener("DOMContentLoaded", () => {
  router.check();
});

router.check();

export { router, socket };
