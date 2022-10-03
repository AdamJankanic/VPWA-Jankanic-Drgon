import { createApp } from "vue";
import App from "./App.vue";
import ButtonCounter from "./components/ButtonCounter.vue";

import "./assets/main.css";

// createApp(App).mount("#app");

const app = createApp(App);
app.component("ButtonCounter", ButtonCounter);
app.mount("#app");
