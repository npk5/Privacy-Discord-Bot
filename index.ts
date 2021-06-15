import config from "./config.json";
import {client} from "./client";

import Discord from "discord.js";

// For auto-completion and type safety
const onceEvents: Set<keyof Discord.ClientEvents> = new Set<keyof Discord.ClientEvents>([
	"ready"
]);

const onEvents: Set<keyof Discord.ClientEvents> = new Set<keyof Discord.ClientEvents>([
	"guildCreate",
	"guildMemberAdd",
	"guildMemberRemove",
	"message",
]);

onceEvents.forEach(async event => import("./events/" + event)
	.then(r => client.once(event, r.run)));

onEvents.forEach(async event => import("./events/" + event)
	.then(r => client.on(event, r.run)));

client.login(config.token).catch(e => console.log(e));
