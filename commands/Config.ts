import Discord from "discord.js";

import {Action} from "./Action";
import {GuildConfig} from "../config/GuildConfig";

export class Config extends Action {

	public constructor(message: Discord.Message) {
		super(message);
	}

	public async run(): Promise<void> {
		this.message.channel.send({embed: {fields: await Promise.all(Array.from(GuildConfig.properties,
					async ([property, description]) =>
						({name: description, value: Config.boolToEmoji(
							await GuildConfig.getProperty(this.message.guild, property)), inline: true})))
		}});
	}

	private static boolToEmoji(boolean: boolean): string {
		return boolean ? GuildConfig.checkMark : GuildConfig.cross;
	}
}
