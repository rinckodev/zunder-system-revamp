import { GuildSchema } from "#database";
import { Client } from "discord.js";
import { HydratedDocument } from "mongoose";

interface ClientStartOptions {
	whenReady?(client: Client<true>): void;
}

declare module "discord.js" {
	interface Client {
		start(options?: ClientStartOptions): void;
		readonly mainGuildData: HydratedDocument<GuildSchema>
	}
	interface GuildMember {
		isRegistered?: boolean;
		isRolesChecked?: boolean;
	}
}
