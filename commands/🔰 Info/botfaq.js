const Discord = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const { duration, handlemsg } = require(`${process.cwd()}/handlers/functions`)
const { MessageActionRow, MessageSelectMenu } = require("discord.js")
module.exports = {
    name: "botfaq",
    aliases: ["faq"],
    category: "🔰 Info",
    description: "Envía las opciones de FAQ para el BOT",
    usage: "botfaq",
    type: "bot",
    run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    
		try{
      let arcticdc = client.guilds.cache.get("422166931823394817")
      let arcticmembers = await arcticdc.members.fetch().catch(() => {});
      let partnercount = arcticmembers.filter(m => m.roles.cache.has("536999145026748424"))
      partnercount = partnercount.map(m=>m.id).length
      
      let menuoptions = [
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[0].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[0].description,
          replymsg: client.la[ls].cmds.info.botfaq.menuoptions[0].replymsg,
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[1].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[1].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[1].replymsg, {
            commandcount: client.commands.map(a=>a).length,
            guildcount: client.guilds.cache.size,
            uptime: duration(client.uptime).map(i=> `\`${i}\``).join(", "),
            ping: Math.floor(client.ws.ping)
          }),
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[2].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[2].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[2].replymsg, {
            prefix: prefix,
            commandcount: client.commands.map(a=>a).length,
          }),
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[3].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[3].description,
          replymsg: client.la[ls].cmds.info.botfaq.menuoptions[3].replymsg,
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[4].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[4].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[4].replymsg, {
            partnercount: partnercount
          }),
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[5].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[5].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[5].replymsg, {
            prefix: prefix
          }),
        },
        {
          value: client.la[ls].cmds.info.botfaq.menuoptions[6].value,
          description: client.la[ls].cmds.info.botfaq.menuoptions[6].description,
          replymsg: handlemsg(client.la[ls].cmds.info.botfaq.menuoptions[6].replymsg, {
            prefix: prefix,
            clientusertag: client.user.tag
          }),
        },
      ]
      //define the selection
      let Selection = new MessageActionRow()
        .addComponents(
          new MessageSelectMenu()
          .setCustomId("MenuSelection")
          .setPlaceholder(client.la[ls].cmds.info.botfaq.placeholder)
          .addOptions(menuoptions.map(o => {
            let Obj = {}; 
            Obj.value = o.value.substring(0, 25);
            Obj.label = o.value.substring(0, 25);
            Obj.description = o.description.substring(0, 50);
            return Obj;
          }))
        );
      //define the embed
      let MenuEmbed = new Discord.MessageEmbed()
      .setColor(es.color)
      .setAuthor(client.la[ls].cmds.info.botfaq.menuembed.title, client.user.displayAvatarURL(), "https://arcticbot.xyz/discord")
      .setDescription(client.la[ls].cmds.info.botfaq.menuembed.description)
      //send the menu msg
      let menumsg = await message.reply({embeds: [MenuEmbed], components: [Selection]})
      //function to handle the menuselection
      function menuselection(interaction) {
        let menuoptiondata = menuoptions.find(v=>v.value.substring(0, 25) == interaction?.values[0])
        interaction?.reply({embeds: [new Discord.MessageEmbed()
        .setColor(es.color)
        .setAuthor(client.la[ls].cmds.info.botfaq.menuembed.title, client.user.displayAvatarURL(), "https://arcticbot.xyz/discord")
        .setDescription(menuoptiondata.replymsg)], ephemeral: true});
      }
      //Event
      client.on('interactionCreate', (interaction) => {
        if (!interaction?.isSelectMenu()) return;
        if (interaction?.message.id === menumsg.id && interaction?.applicationId == client.user.id) {
          if (interaction?.user.id === cmduser.id) menuselection(interaction);
          else interaction?.reply({content: handlemsg(client.la[ls].cmds.info.botfaq.notallowed, {cmduserid: cmduser.id}), ephemeral:true});
        }
      });
    } catch (e) {
        console.log(String(e.stack).grey.bgRed)
        return message.reply({embeds: [new Discord.MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(eval(client.la[ls]["cmds"]["info"]["botfaq"]["variable1"]))
        ]}).catch(()=>{});
    }
  },
};
