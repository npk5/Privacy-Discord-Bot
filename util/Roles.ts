import Discord from "discord.js";

export class Roles {

	private constructor() {

	}

	/**
	 * Removes any Role with the given name from the given Guild.
	 * @param guild guild to delete roles from
	 * @param roleName name of roles to delete
	 */
	public static removeRolesByName(guild: Discord.Guild, roleName: string): void {
		guild.roles.cache
			.filter(r => r.name == roleName)
			.forEach(async r => r.delete());
	}
}
