import {client} from "../client";

import {GuildConfig} from "../config/GuildConfig";
import {Guilds} from "../util/Guilds";

export async function run(): Promise<void> {
	console.log("Ready");

	client.user.setActivity("you", {
		type: "WATCHING"
	});

	client.guilds.cache.forEach(async guild => {
		if (await GuildConfig.getProperty(guild, "autoSetUpOnJoin"))
			Guilds.setUpGuild(guild);
	});
}
