import { createClient } from "#base";
import { initCanvas } from "./tools/canvas.js";

const client = createClient();
client.start();

initCanvas();