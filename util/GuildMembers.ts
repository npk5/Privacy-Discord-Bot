import Discord from "discord.js";
import config from "../config.json";
import {Channels} from "./Channels";

export class GuildMembers {

	private constructor() {
		
	}

	/**
	 * Gives member a custom role and creates channels for them that only they can see.
	 * @param guildMember member to create role and channels for
	 */
	public static async setUpGuildMember(guildMember: Discord.GuildMember): Promise<void> {
		if (!guildMember) return;

		const guild: Discord.Guild = guildMember.guild;

		// ROLE
		let roleName: string = config.role_prefix + guildMember.id;
		let role: Discord.Role = guild.roles.cache.find(r => r.name == roleName);
		if (!role) // Wait for the role to be created before adding
			role = await guild.roles.create({data: {name: roleName}});
		// Check if member already has given role
		if (!guildMember.roles.cache.has(role.id))
			guildMember.roles.add(role);

		// CHANNELS
		let category: Discord.CategoryChannel = Channels.getCategoryByName(guild, guildMember.id);
		if (!category)
			category = await guild.channels.create(guildMember.id, {type: "category"});

		// Always set category permissions for role
		await category.overwritePermissions([{
			id: guild.roles.cache.find(r => r.name == roleName),
			allow: ["VIEW_CHANNEL", "READ_MESSAGE_HISTORY",
				"SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES",
				"EMBED_LINKS", "USE_EXTERNAL_EMOJIS",
				"CONNECT", "SPEAK", "USE_VAD", "STREAM"]
		}]);

		// If category doesn't have any children, add two default channels
		if (!category.children.filter(ch => ch instanceof Discord.TextChannel).size) {
			await guild.channels.create(guildMember.displayName, {type: "text", parent: category});
			await guild.channels.create(guildMember.displayName, {type: "voice", parent: category});
		}

		// Always sync channel permissions with category
		category.children.forEach(async ch => ch.overwritePermissions(category.permissionOverwrites));
	}
}

