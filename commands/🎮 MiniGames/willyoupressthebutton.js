
const { WillYouPressTheButton } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
    name: "willyoupressthebutton",
    category: "🎮 Minijuegos",
    description: "Permite reproducir un Game1",
    aliases: ["willyoupress"],
    type: "buttons",
    usage: "willyoupressthebutton --> Play the Game",
     run: async (client, message, args, cmduser, text, prefix) => {
        let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
        if(!client.settings.get(message.guild.id, "MINIGAMES")){
          return message.reply(new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
          );
        }
        await WillYouPressTheButton({
          message: message,
          embed: {
            title: 'Presionará el botón?',
            description: '```{{statement1}}```\n**but**\n\n```{{statement2}}```',
            color: es.color,
            footer: es.footertext,
            timestamp: true,
          },
          button: { yes: 'Si', no: 'No' },
          thinkMessage: 'Estoy pensando',
          othersMessage: 'Solo <@{{author}}> puede utilizar los botones!',
        });         
    }
  }