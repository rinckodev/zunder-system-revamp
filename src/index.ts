import { createClient } from "#base";
import { initDiscordEvents } from "@magicyan/discord-events";
import { initCanvas } from "#tools";

const client = createClient(); initDiscordEvents(client);
client.start(); initCanvas();
