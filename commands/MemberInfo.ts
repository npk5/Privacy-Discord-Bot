import Discord from "discord.js";

import {Action} from "./Action";
import {Channels} from "../util/Channels";

export class MemberInfo extends Action {
	private readonly member: Discord.GuildMember;

	public constructor(message: Discord.Message) {
		super(message);

		if (!((!this.args.length
			&& (this.member = message.member))
			|| (this.args.length == 1
				&& ((this.member = message.mentions?.members?.first())
					|| (this.member = message.guild.members.cache.get(this.args[0])))))) {
			this.malformed = true;
		}
	}

	public async run(): Promise<void> {
		this.message.channel.send({embed: {
			color: this.member.displayColor,
			author: {icon_url: this.member.user.displayAvatarURL(), name: `${this.member.user.tag}`},
			description: this.member.roles.cache
				.reduce((acc, r, id) => acc.concat(r != this.message.guild.roles.everyone
					? `<@&${id}> `: ""), `<@${this.member.user.id}>\n\n`),
			fields: [
				{name: "**ID**", value: this.member.user.id},
				{name: "**Status**", value: this.member.presence.status},
				{name: "**Custom status**", value: this.member.presence.activities.find(a => a.type == "CUSTOM_STATUS")?.state},
				{name: "**Account created on**", value: this.member.user.createdAt},
				{name: "**Joined server on**", value: this.member.joinedAt},
				{name: "**Channels**", value: Channels.getCategoryByName(this.message.guild, this.member.id)?.children
						?.reduce((acc, ch, id) => acc.concat(`<#${id}> `), "")},
				{name: "\u200B", value: "**Profile picture**"},
			],
			image: {url: this.member.user.displayAvatarURL({size: 4096, dynamic: true})},
			footer: {icon_url: this.message.client.user.displayAvatarURL(), text: "Privacy Discord Bot"},
			timestamp: Date.now(),
		}});
	}
}
