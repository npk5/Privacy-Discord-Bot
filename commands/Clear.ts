import Discord from "discord.js";

import {Action} from "./Action";

export class Clear extends Action {
	private readonly amount: number;
	private readonly channel: Discord.TextChannel | Discord.NewsChannel;

	public constructor(message: Discord.Message) {
		super(message);

		if (this.args.length == 1)
			this.amount = parseInt(this.args[0]) + 1;

		if (isNaN(this.amount) || this.args.length > 1
			|| message.channel instanceof Discord.DMChannel) {
			this.malformed = true;
		} else {
			this.channel = message.channel;
		}
	}

	public async run(): Promise<void> {
		let amount: number = this.amount;
		let toRemove: number;
		do {
			toRemove = this.amount == undefined ? 100 : Math.min(this.amount, 100);
			amount -= toRemove;
		} while (toRemove <= 0 || !await this.channel.bulkDelete(toRemove).then(r => r.size));
	}
}