import Discord from "discord.js";

import {GuildConfig} from "../config/GuildConfig";
import {GuildMembers} from "../util/GuildMembers";

export async function run(guildMember: Discord.GuildMember): Promise<void> {
	if (await GuildConfig.getProperty(guildMember.guild, "autoSetUpOnJoin"))
		GuildMembers.setUpGuildMember(guildMember);
}
