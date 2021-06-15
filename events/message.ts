import config from "../config.json";

import Discord from "discord.js";

import {CommandHandler} from "../commands/CommandHandler";

export async function run(message: Discord.Message): Promise<void> {
	if (message.content.startsWith(config.command_prefix))
		return new CommandHandler(message).execute();
}
