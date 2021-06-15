import Discord from "discord.js";

import {Action} from "./Action";
import {Channels} from "../util/Channels"

export class Remove extends Action {
	private readonly category: Discord.CategoryChannel;

	public constructor(message: Discord.Message) {
		super(message);

		let categoryName: string;
		if (this.message.channel instanceof Discord.DMChannel
			|| !((!this.args.length
					&& (this.category = this.message.channel.parent))
				|| (this.args.length == 1
					&& ((categoryName = message.mentions.members?.first()?.id)
						|| (categoryName = this.args[0])))
				&& (this.category = Channels.getCategoryByName(message.guild, categoryName))))
			this.malformed = true;
	}

	public async run(): Promise<void> {
		Channels.removeCategory(this.category);
	}
}
