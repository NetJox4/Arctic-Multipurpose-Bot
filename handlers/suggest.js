const { Client, Collection, MessageEmbed, MessageAttachment } = require(`discord.js`);const {
  MessageButton,
  MessageActionRow
} = require('discord.js');
const ee = require(`${process.cwd()}/botconfig/embed.json`);
module.exports = (client) => {

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    //////////////////////////////////////////
    //////////////////////////////////////////
    /////////////FEEDBACK SYSTEM//////////////
    //////////////////////////////////////////
    //////////////////////////////////////////
    client.settings.ensure(message.guild.id, {
        suggest: {
          channel: "",
          approvemsg: `​✔️ Idea aceptada! Espere esto pronto.`,
          denymsg: `❌​ Gracias por los comentarios, pero no estamos interesados en esta idea en este momento.`,
          maybemsg: `💡 Estamos pensando en esta idea!`,
          duplicatemsg: `💢 Esta es una Sugerencia duplicada`,
          soonmsg: `👌 Espere esta función pronto!`,
          statustext: `🔋 A la espera de los comentarios de la comunidad, por favor vote!`,
          footertext: `Quieres sugerir / comentar algo? Simplemente escriba en este canal!`,
          approveemoji: `833101995723194437`,
          denyemoji: `833101993668771842`,
        }
    });
    let settings = client.settings.get(message.guild.id, "suggest");
    var approveemoji = settings.approveemoji;
    var denyemoji = settings.denyemoji;
    var footertext = settings.footertext;
    var statustext = settings.statustext
    var feedbackchannel = settings.channel;
    let whobutton = new MessageButton().setStyle("PRIMARY").setEmoji("❓").setCustomId("Suggest_who").setLabel("Quién ha votado?")
    let upvotebutton = new MessageButton().setStyle('SECONDARY') .setEmoji(approveemoji) .setCustomId("Suggest_upvote").setLabel("0")
    let downvotebutton = new MessageButton().setStyle('SECONDARY') .setEmoji(denyemoji) .setCustomId("Suggest_downvote").setLabel("0")
    let allbuttons = [new MessageActionRow().addComponents([upvotebutton, downvotebutton, whobutton])];
    let supvotebutton = new MessageButton().setStyle('SECONDARY') .setEmoji("✅") .setCustomId("Suggest_upvote").setLabel("0")
    let sdownvotebutton = new MessageButton().setStyle('SECONDARY') .setEmoji("❌") .setCustomId("Suggest_downvote").setLabel("0")
    let allbuttonsSave = [new MessageActionRow().addComponents([supvotebutton, sdownvotebutton, whobutton])];
    if(!feedbackchannel) return;
    if (message.channel.id === feedbackchannel) {
      
      try{
        message.delete({ timeout: 500 }).catch(e=>{console.log(String(e).grey)});
      }catch(e){
        console.log(String(e).grey)
      }
      client.settings.ensure(message.guild.id, {
        embed: {
          color: ee.color
        }
      });
      var es = client.settings.get(message.guild.id, `embed`)
      var url = ``;
      var imagename = `Unknown`;
      var embed = new MessageEmbed()
        .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
        .addField(`:thumbsup: **__Votos Positivos__**`, `**\`\`\`0 Votes\`\`\`**`, true)
        .addField(`:thumbsdown: **__Votos Negativos__**`, `**\`\`\`0 Votes\`\`\`**`, true)
        .setColor(es.color)
        .setAuthor(client.getAuthor(message.author.tag + " Hizo una sugerencia", message.member.user.displayAvatarURL({ dynamic: true }), `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot`))
        .setDescription("\n" + message.content + "\n")
        .setFooter(client.getFooter(footertext, message.guild.iconURL({dynamic: true})))
        //.addField(`Status`, `REASON`)
        if (message.content) {
            embed.setDescription(">>> " + message.content);
        }
        //add images if added (no videos possible)
        if (message.attachments.size > 0){
            if (message.attachments.every(attachIsImage)) {
              embed.setImage(message.attachments.first().attachment)
            }
        }
        //if no content and no image, return and dont continue
        if (!message.content && message.attachments.size <= 0) return;

        function attachIsImage(msgAttach) {
            url = msgAttach.url;
            imagename = msgAttach.name || `Unknown`;
            return url.indexOf(`png`, url.length - 3 ) !== -1 ||
                url.indexOf(`jpeg`, url.length - 4 ) !== -1 ||
                url.indexOf(`gif`, url.length - 3) !== -1 ||
                url.indexOf(`jpg`, url.length - 3) !== -1;
        }
        message.channel.send({
            embeds: [embed],
            components: allbuttons,
        }).then(msg => {
            //ste suggestions Data
            client.settings.set(msg.id, {
                upvotes: 0,
                downvotes: 0,
                user: message.author.id,
                voted_ppl: [],
                downvoted_ppl: [],
            })
        }).catch((e)=>{
          console.log(String(e).grey)
            message.channel.send({
              embeds: [embed],
              components: allbuttonsSave
          }).then(msg => {
              //ste suggestions Data
              client.settings.set(msg.id, {
                  upvotes: 0,
                  downvotes: 0,
                  user: message.author.id,
                  voted_ppl: [],
                  downvoted_ppl: [],
              })
          }).catch((e)=>{
            console.log(String(e).grey)
          })
        })
    }

    function attachIsImage(msgAttach) {
      url = msgAttach.url;
      imagename = msgAttach.name || `Unknown`;
      return url.indexOf(`png`, url.length - `png`.length /*or 3*/ ) !== -1 ||
        url.indexOf(`jpeg`, url.length - `jpeg`.length /*or 3*/ ) !== -1 ||
        url.indexOf(`gif`, url.length - `gif`.length /*or 3*/ ) !== -1 ||
        url.indexOf(`jpg`, url.length - `jpg`.length /*or 3*/ ) !== -1;
    }
  })
  //Event for the Mod Log & Suggestions System
  client.on("interactionCreate", async (button) => {
      if(!button?.inGuild() || !button?.isButton()) return
      if(!button?.message.guild || !button?.message.guild.available || !button?.message.channel) return;
      if (button?.message.author.id != client.user.id) return;
      let guild = button?.message.guild;
      let channel = button?.message.channel;
      if (button?.customId.startsWith("Suggest_")) {
          if(client.settings.get(guild.id, "suggest.channel") !== channel.id) return;
          let SuggestionsData = client.settings.get(button?.message.id)
          if(!SuggestionsData.downvoted_ppl) {
            client.settings.set(button?.message.id, [], "downvoted_ppl")
            SuggestionsData = client.settings.get(button?.message.id)
          }
          if(button?.customId == "Suggest_upvote") {
              if(SuggestionsData.voted_ppl.includes(button?.user.id)){
                  return button?.reply({content: `No se puede votar positivo en la Sugerencia de <@${SuggestionsData.user}> twice!`, ephemeral: true})
              }
              //remove the downvote
              if(SuggestionsData.downvoted_ppl.includes(button?.user.id)){
                client.settings.math(button?.message.id, "-", 1, "downvotes")
                client.settings.remove(button?.message.id, button?.user.id, "downvoted_ppl")
              }
              client.settings.math(button?.message.id, "+", 1, "upvotes")
              client.settings.push(button?.message.id, button?.user.id, "voted_ppl")
          }
          if(button?.customId == "Suggest_downvote") {
              if(SuggestionsData.downvoted_ppl.includes(button?.user.id)){
                return button?.reply({content: `No se puede votar negativo en la Sugerencia de <@${SuggestionsData.user}> twice!`, ephemeral: true})
              }
              //remove the upvote
              if(SuggestionsData.voted_ppl.includes(button?.user.id)){
                client.settings.math(button?.message.id, "-", 1, "upvotes")
                client.settings.remove(button?.message.id, button?.user.id, "voted_ppl")
              }
              client.settings.math(button?.message.id, "+", 1, "downvotes")
              client.settings.push(button?.message.id, button?.user.id, "downvoted_ppl")
          }
          if(button?.customId == "Suggest_who"){
            return button?.reply({
              ephemeral: true,
              embeds: [
                new MessageEmbed()
                .setColor(button?.message.embeds[0].color)
                .setTitle(`❓ **Quién reaccionó con qué?** ❓`)
                .addField(`${SuggestionsData.upvotes} Votos Positivos`,`${SuggestionsData.voted_ppl && SuggestionsData.voted_ppl.length > 0 ? SuggestionsData.voted_ppl.length < 20 ? SuggestionsData.voted_ppl.map(r => `<@${r}>`).join("\n") : [...SuggestionsData.voted_ppl.slice(0, 20).map(r => `<@${r}>`), `${SuggestionsData.voted_ppl.length - 20} more...`].join("\n") : "Nadie"}`.substring(0, 1024), true)
                .addField(`${SuggestionsData.downvotes} Votos Negativos`,`${SuggestionsData.downvoted_ppl && SuggestionsData.downvoted_ppl.length > 0 ? SuggestionsData.downvoted_ppl.length < 20 ? SuggestionsData.downvoted_ppl.map(r => `<@${r}>`).join("\n") : [...SuggestionsData.downvoted_ppl.slice(0, 20).map(r => `<@${r}>`), `${SuggestionsData.downvoted_ppl.length - 20} más...`].join("\n") : "Nadie"}`.substring(0, 1024), true)
              ]
            });
          }
          SuggestionsData = client.settings.get(button?.message.id);
          let embed = button?.message.embeds[0];
          embed.fields[0].key = `:thumbsup: **__Votos a Positivos**`;
          embed.fields[0].value = `**\`\`\`${SuggestionsData.upvotes} Votos\`\`\`**`;
          embed.fields[1].key = `:thumbsdown: **__Votos negativos__**`;
          embed.fields[1].value = `**\`\`\`${SuggestionsData.downvotes} Votos\`\`\`**`;
          let settings = client.settings.get(button?.message.guild.id, "suggest");
          var approveemoji = settings.approveemoji;
          var denyemoji = settings.denyemoji;
          if (button.message.attachments.size > 0){
              if (button.message.attachments.every(attachIsImage)) {
                embed.setImage(button.message.attachments.first().attachment)
              }
          }
          let whobutton = new MessageButton().setStyle("PRIMARY").setEmoji("❓").setCustomId("Suggest_who").setLabel("Quién ha votado?")
          let upvotebutton = new MessageButton().setStyle("SECONDARY").setEmoji(approveemoji).setCustomId("Suggest_upvote").setLabel(String(SuggestionsData.upvotes))
          let downvotebutton = new MessageButton().setStyle("SECONDARY").setEmoji(denyemoji).setCustomId("Suggest_downvote").setLabel(String(SuggestionsData.downvotes))
          let supvotebutton = new MessageButton().setStyle("SECONDARY").setEmoji("✅").setCustomId("Suggest_upvote").setLabel(String(SuggestionsData.upvotes))
          let sdownvotebutton = new MessageButton().setStyle("SECONDARY").setEmoji("❌") .setCustomId("Suggest_downvote").setLabel(String(SuggestionsData.downvotes))
            button?.message.edit({embeds: [embed], components: [new MessageActionRow().addComponents([upvotebutton, downvotebutton, whobutton])]}).catch((e)=>{
              button?.message.edit({embeds: [embed], components: [new MessageActionRow().addComponents([supvotebutton, sdownvotebutton, whobutton])]}) .catch((e)=>{
                console.log(e.stack ? String(e.stack).grey : String(e).grey)
              })
            })
          button?.deferUpdate();
          function attachIsImage(msgAttach) {
            var url = msgAttach.url;
            return url.indexOf(`png`, url.length - `png`.length /*or 3*/ ) !== -1 ||
              url.indexOf(`jpeg`, url.length - `jpeg`.length /*or 3*/ ) !== -1 ||
              url.indexOf(`gif`, url.length - `gif`.length /*or 3*/ ) !== -1 ||
              url.indexOf(`jpg`, url.length - `jpg`.length /*or 3*/ ) !== -1;
          }
      }
  });
}
