import Discord from "discord.js";

export class Channels {

	private constructor() {

	}

	/**
	 * Gets category with a given name.
	 * @param guild server to get category from
	 * @param categoryName name of the category
	 * @return category if it exists
	 */
	public static getCategoryByName(guild: Discord.Guild, categoryName: string): Discord.CategoryChannel {
		if (!(guild && categoryName)) return undefined;

		return guild.channels.cache
			.filter(ch => ch instanceof Discord.CategoryChannel)
			.find(ch => ch.name == categoryName) as Discord.CategoryChannel;
	}

	/**
	 * Removes a given category and any associated roles from the given server.
	 * @param category category to remove
	 */
	public static removeCategory(category: Discord.CategoryChannel): void {
		if (!category) return;

		category.children.forEach(async ch => ch.delete());
		category.delete();
	}
}
