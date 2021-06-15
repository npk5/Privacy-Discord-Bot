import Discord from "discord.js";

import {Action} from "./Action";
import {GuildConfig} from "../config/GuildConfig";
import {Guilds} from "../util/Guilds"

export class Setup extends Action {
	public constructor(message: Discord.Message) {
		super(message);
	}

	public async run(): Promise<void> {
		await GuildConfig.initialize(this.message.guild);
		return Guilds.setUpGuild(this.message.guild);
	}
}
