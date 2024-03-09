declare module NodeJS {
	interface ProcessEnv {
		readonly BOT_TOKEN: string;
		readonly MONGO_URI: string;
		readonly MAIN_GUILD_ID: string;
		readonly WEBHOOK_LOGS_URL: string | undefined;
	}
}