import Discord from "discord.js";

import {GuildConfig} from "../config/GuildConfig";
import {Roles} from "../util/Roles";
import {Channels} from "../util/Channels";

export async function run(guildMember: Discord.GuildMember | Discord.PartialGuildMember): Promise<void> {
	if (guildMember.partial)
		guildMember = await guildMember.fetch();
	guildMember = guildMember as Discord.GuildMember;

	if (await GuildConfig.getProperty(guildMember.guild, "autoRemoveOnLeave")) {
		Roles.removeRolesByName(guildMember.guild, guildMember.id);
		Channels.removeCategory(Channels.getCategoryByName(guildMember.guild, guildMember.id));
	}
}
