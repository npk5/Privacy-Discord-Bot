import config from "../config.json";

import Discord from "discord.js";

/**
 * Configuration for Discord servers. Completely non-reliant on external databases.
 * Configuration is stored in a dedicated channel.
 */
export class GuildConfig {
	public static readonly checkMark: string = "✅";
	public static readonly cross: string = "❌";

	public static readonly properties: Map<Property, string> = new Map<Property, string>([
		["autoSetUpOnJoin", "Automatically set up role and channels when member joins"],
		["autoRemoveOnLeave", "Automatically remove role and channels when member leaves"]
	]);

	private static readonly cache: Map<Discord.Guild, GuildConfig> = new Map<Discord.Guild, GuildConfig>();

	private readonly guild: Discord.Guild;
	private configChannel: Discord.TextChannel;
	// Gets updated automatically
	private readonly messages: Discord.Collection<string, Discord.Message>;

	private constructor(guild: Discord.Guild, configChannel: Discord.TextChannel,
						messages: Discord.Collection<string, Discord.Message>) {
		this.guild = guild;
		this.configChannel = configChannel;
		this.messages = messages;
	}

	private static async of(guild: Discord.Guild): Promise<GuildConfig> {
		let configChannel: Discord.TextChannel = guild.channels.cache
			.filter(ch => ch instanceof Discord.TextChannel)
			.find(ch => ch.name == config.channel_prefix + "config") as Discord.TextChannel;

		let guildConfig: GuildConfig = new GuildConfig(guild, configChannel, await configChannel?.messages?.fetch());
		// Cache server config
		GuildConfig.cache.set(guild, guildConfig);
		return guildConfig;
	}

	private static async setUpConfigChannel(configChannel: Discord.TextChannel): Promise<void> {
		await configChannel.send(
			`This is the config channel. React to each message to save your preferences.\n`
			+ `Use command ${config.command_prefix} config to see an overview of your current settings.`
		);

		this.properties.forEach(async (description, property) => {
			await configChannel.send(property, {embed: {fields: [{
				name: description,
				value: "Check to enable."
			}]}}).then(async m => m.react(GuildConfig.checkMark));
		})
	}

	public static async getConfigChannel(guild: Discord.Guild): Promise<Discord.TextChannel> {
		return GuildConfig.cache.get(guild)?.configChannel;
	}

	public static async initialize(guild: Discord.Guild): Promise<void> {
		if (!GuildConfig.cache.has(guild))
			await GuildConfig.of(guild);

		let guildConfig: GuildConfig = GuildConfig.cache.get(guild);
		// If config channel doesn't exist, create one
		if (!guildConfig.configChannel)
			await GuildConfig.setUpConfigChannel(guildConfig.configChannel =
				await guild.channels.create(config.channel_prefix + "config", {
					permissionOverwrites: [{
						id: guild.roles.everyone,
						deny: ["VIEW_CHANNEL"]
					}]}));
	}

	public static async getProperty(guild: Discord.Guild, property: Property): Promise<boolean> {
		if (!GuildConfig.cache.has(guild))
			GuildConfig.cache.set(guild, await GuildConfig.of(guild));

		return GuildConfig.cache.get(guild).getProperty(property);
	}

	private async getProperty(property: Property): Promise<boolean> {
		let value: boolean = false;

		if (this.messages
			.find(m => m.author.bot && m.content == property)?.reactions?.cache
			?.find(r => r.emoji.name == GuildConfig.checkMark)?.count > 1)
			value = true;

		return value;
	}
}

type Property = "autoSetUpOnJoin" | "autoRemoveOnLeave";
