import config from "../config.json";
import Discord from "discord.js";

import {Action, Command, Executable} from "./Action";
import {Clear} from "./Clear";
import {Config} from "./Config";
import {MemberInfo} from "./MemberInfo";
import {Remove} from "./Remove";
import {Setup} from "./Setup";

export class CommandHandler implements Executable {
	// A GuildMember executing a command must have ALL of the permissions
	private readonly PERMISSIONS: Map<Command, Discord.PermissionResolvable[]> =
		new Map<Command, Discord.PermissionResolvable[]>([
			[Command.clear, ["MANAGE_MESSAGES"]],
			[Command.config, ["ADMINISTRATOR"]],
			[Command.info, []],
			[Command.remove, ["MANAGE_CHANNELS"]],
			[Command.setup, ["ADMINISTRATOR"]]
		]);

	private readonly action: Action;
	private readonly type: Command;
	private readonly executor: Discord.GuildMember;

	public constructor(message: Discord.Message) {
		this.executor = message.member;

		this.type = Command[message.content.slice(config.command_prefix.length).trim().split(/ +/).shift()];

		switch (this.type) {
			case Command.clear:
				this.action = new Clear(message);
				break;
			case Command.config:
				this.action = new Config(message);
				break;
			case Command.info:
				this.action = new MemberInfo(message);
				break;
			case Command.remove:
				this.action = new Remove(message);
				break;
			case Command.setup:
				this.action = new Setup(message);
				break;
		}
	}

	public async execute(): Promise<void> {
		if (this.executor && !this.checkPermissions()) return;

		return this.action.execute();
	}

	private checkPermissions(): boolean {
		if (!(this.type && this.executor)) return false;

		for (let permission of this.PERMISSIONS.get(this.type)) {
			if (!this.executor.hasPermission(permission))
				return false;
		}
		return true;
	}
}
