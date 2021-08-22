const Discord = require("discord.js");
const client = new Discord.Client();
const ez = require("./ez.json");

client.on("message", async (message) => {
  //help command
  if(message.content.startsWith('!help')) {
    var helpembed = new Discord.MessageEmbed()
    .setDescription('This bot will replace any messages that include `ez` with random phrases from Hypixel.')
    .setColor('GREEN')
    .setFooter('By Rubi#3719');
    message.channel.send(helpembed)
  }
  
  if (message.content.toLowerCase().match(/\b(ez)\b/g)) {
    try {
      const webhooks = await message.channel.fetchWebhooks();
      const webhook = webhooks.find((w) => w.name === "ezBot");

      let txt = ez[Math.floor(Math.random() * ez.length)];

      //create webhook if not exists
      if (!webhook) {
        await message.channel
          .createWebhook("ezBot", {
            avatar: client.user.displayAvatarURL(),
          })
          .then(async () => {
            console.log(`Created a webhook in; ${message.channel.name}`);
            message.channel.send(
              "*It seems that the webhook is missing on this channel, so I've added one!*"
            );

            message
              .delete()
              .catch((err) => console.log(`Error on deletion: ${err}`));
          });
      } else {
        //send ez message with fake user

        webhook.send(txt, {
          username: message.member.displayName,
          avatarURL: message.author.displayAvatarURL(),
        });

        message
          .delete()
          .catch((err) => console.log(`Error on deletion: ${err}`));
      }
    } catch (err) {
      console.log(`Webhook error: ${err}`);
    }
  }
});

//when bot joins
client.on("guildCreate", (guild) => {
  console.log(`Joined server: ${guild.name}`);
  //send welcome message to a random channel

  var hello_embed = new Discord.MessageEmbed()
    .setTitle("\\❤️ Thanks for inviting me!")
    .addField(
      "This bot will replace any messages that include `ez` with random phrases from Hypixel.\nEnjoy!",
      "\u200b"
    )
    .setFooter("By Rubi#3719")
    .setColor("GREEN");

  const first_channel = guild.channels.cache
    .filter((c) => {
      return c.manageable && c.type === "text";
    })
    .first();

  if (first_channel) first_channel.send(hello_embed);

  //add webhooks in all channels
  var i = 0;
  guild.channels.cache.forEach((channel) => {
    if (channel.type !== "text") return;

    channel.createWebhook("ezBot", {
      avatar: client.user.displayAvatarURL(),
    });
    i++;
    if (i == guild.channels.cache.filter((c) => c.type == "text").size)
      return console.log("Successfully added webhooks to all text channels.");
  });
});

//when channel created
client.on("channelCreate", (channel) => {
  channel.createWebhook("ezBot", {
    avatar: client.user.displayAvatarURL(),
  });

  console.log(`Added webhook to the channel; ${channel.name}`);
});

//login
client.login(process.env.token).then(() => console.log("Logged in."));
