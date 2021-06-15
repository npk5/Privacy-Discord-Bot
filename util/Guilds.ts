import Discord from "discord.js";
import {GuildMembers} from "./GuildMembers"

export class Guilds {

	private constructor() {

	}

	/**
	 * Sets permissions for a server and calls setUpMember() for each regular member.
	 * @param guild the server to process
	 */
	public static setUpGuild(guild: Discord.Guild): void {
		if (!guild) return;

		// Make sure people can't see any channels, thus preventing them from seeing other members
		guild.roles.everyone.setPermissions([]);

		// Only process members that aren't either a bot or an admin
		guild.members.cache
			.filter(m => !(m.user.bot || m.hasPermission("ADMINISTRATOR")))
			.forEach(async member => GuildMembers.setUpGuildMember(member));
	}
}
