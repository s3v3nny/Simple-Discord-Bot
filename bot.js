const botconfig = require("./botconfig.json");
const Discord = require("discord.js");

const bot = new Discord.Client({disableEveryone: true});


bot.on("ready", async () => {
	console.log(`${bot.user.username} is online!`)
});

bot.on("message", async message => {
	if(message.author.bot) return;
	if(message.channel.type === "dm") return;

	let prefix = botconfig.prefix;
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0];
	let args = messageArray.slice(1);

	if(cmd === `${prefix}kick`){

		let kickUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
		if(!kickUser) return message.channel.send("Couldn't find this user.");
		let kickReason = args.join(" ").slice(22);
		if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("You don't have permissions to do that.");
		if(kickUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("That user can't be kicked.");

		let kickEmbed = new Discord.RichEmbed()
		.setDescription("Kick Information")
		.setColor("#34eb56")
		.addField("Kicked User", `Username: ${kickUser},\n ID: ${kickUser.id}`)
		.addField("Kicked By", `<@${message.author.id}>`)
		.addField("Kicked In", message.channel)
		.addField("Time", message.createdAt)
		.addField("Reason", kickReason)

		let kickChannel = message.guild.channels.find(`name`, "output")
		if(!kickChannel) return message.channel.send("Couldn't find output channel.");

		message.guild.member(kickUser).kick(kickReason);

		kickChannel.send(kickEmbed);
		return;
	}

	if(cmd === `${prefix}serverinfo`){

	let servericon = message.guild.iconURL;
	let serverembed = new Discord.RichEmbed()
	.setDescription("Server Information")
	.setColor("#eb7134")
	.setThumbnail(servericon)
	.addField("Server Name", message.guild.name)
	.addField("Created At", message.guild.createdAt)
	.addField("Total Members", message.guild.memberCount)
	.addField("You Joined On", message.member.joinedAt)

	return message.channel.send(serverembed);
	}

	if(cmd === `${prefix}botinfo`){

		let boticon = bot.user.displayAvatarURL;
		let botembed = new Discord.RichEmbed()
		.setDescription("Bot Information")
		.setColor("#d142f5")
		.setThumbnail(boticon)
		.addField("Bot Name", bot.user.username)
		.addField("Created On", bot.user.createdAt)

		return message.channel.send(botembed);
	}
});

bot.login(botconfig.token);
