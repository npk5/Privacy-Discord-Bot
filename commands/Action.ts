import config from "../config.json";
import Discord from "discord.js";

export abstract class Action implements Executable {
	protected readonly args: string[];
	protected readonly message: Discord.Message;

	protected malformed: boolean;

	protected constructor(message: Discord.Message) {
		this.message = message;

		this.args = message.content.slice(config.command_prefix.length).trim().split(/ +/);
		this.args.shift();
	}

	public async execute(): Promise<void> {
		if (!this.malformed)
			this.run();
	}

	abstract run(): Promise<void>;
}

/**
 * Allows Actions to be executed either directly or through the CommandHandler.
 */
export interface Executable {
	execute(): Promise<void>;
}

export enum Command {
	clear = "clear",
	config = "config",
	info = "info",
	remove = "remove",
	setup = "setup"
}
