const { QuickClick } = require('weky')
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);

module.exports = {
    name: "quickclick",
    category: "馃幃 Minijuegos",
    description: "Plays a Game",
    aliases: ["quickclicker"],
    type: "buttons",
    usage: "quickclick --> Juega el juego",
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
        await QuickClick({
          message: message,
          embed: {
            title: 'Quick Click',
            color: es.color,
            footer: es.footertext,
            timestamp: true,
          },
          time: 60000,
          waitMessage: 'Los botones pueden aparecer en cualquier momento!',
          startMessage:
            'La primera persona que pulse el bot贸n correcto ganar谩. Usted tiene **{{time}}**!',
          winMessage: 'GG, <@{{winner}}> puls贸 el bot贸n en **{{time}} segundos**.',
          loseMessage: 'Nadie puls贸 el bot贸n a tiempo. As铆 que, dej茅 el juego!',
          emoji: '馃憜',
          ongoingMessage:
            "Un juego ya est谩 en marcha en <#{{channel}}>. No puedes empezar uno nuevo!",
        });
        
    }
  }