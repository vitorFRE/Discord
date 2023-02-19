const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('vote')
    .setDescription('Criar uma enquete')
    .addStringOption((option) =>
      option
        .setName('pergunta')
        .setDescription('Sobre o que é a enquete?')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('opcoes')
        .setDescription('As opções da enquete, separadas por vírgula')
        .setRequired(true),
    ),
  async execute(interaction) {
    await interaction.deferReply();

    const pergunta = interaction.options.getString('pergunta');
    const opcoes = interaction.options.getString('opcoes').split(',');
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    let votos = Array(opcoes.length).fill(0);
    let votosUsuario = {};

    const enqueteEmbed = new EmbedBuilder()
      .setColor('#E59906')
      .setTitle(pergunta)
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: `${interaction.user.avatarURL()}`,
      })
      .setThumbnail(`${interaction.guild.iconURL()}`)
      .setDescription(
        opcoes.map((opcao, index) => `${emojis[index]} - ${opcao}`).join('\n'),
      );

    const enqueteMessage = await interaction.channel.send({
      embeds: [enqueteEmbed],
    });

    for (let i = 0; i < opcoes.length; i++) {
      await enqueteMessage.react(emojis[i]);
    }

    const filter = (reaction, user) => {
      return (
        emojis.includes(reaction.emoji.name) &&
        !user.bot &&
        reaction.message.id === enqueteMessage.id
      );
    };

    const collector = enqueteMessage.createReactionCollector({
      filter,
      time: 15000,
    });

    collector.on('collect', (reaction, user) => {
      if (votosUsuario[user.id]) {
        interaction.channel.send('Você já votou nessa enquete!');
        return;
      }

      const emojiIndex = emojis.indexOf(reaction.emoji.name);
      if (emojiIndex !== -1) {
        votos[emojiIndex]++;
        votosUsuario[user.id] = true; // Marcar o usuário como tendo votado
      }
    });

    collector.on('end', async (collected) => {
      // Ao finalizar a coleta de votos, construir a mensagem de resultado
      const totalVotos = votos.reduce((total, voto) => total + voto, 0);

      const resultadoEmbed = new EmbedBuilder()
        .setColor('#E59906')
        .setTitle(`Resultado da enquete: ${pergunta}`)
        .setAuthor({
          name: `${interaction.user.username}`,
          iconURL: `${interaction.user.avatarURL()}`,
        })
        .setThumbnail(`${interaction.guild.iconURL()}`);

      if (totalVotos === 0) {
        // Se nenhum voto for recebido, exibir mensagem de erro
        resultadoEmbed.setDescription('Nenhum voto foi registrado na enquete.');
      } else {
        // Caso contrário, exibir contagem de votos por opção
        resultadoEmbed.setDescription(
          opcoes
            .map(
              (opcao, index) =>
                `${emojis[index]} - ${opcao}: ${votos[index]} votos (${(
                  (votos[index] / totalVotos) *
                  100
                ).toFixed(2)}%)`,
            )
            .join('\n'),
        );
        resultadoEmbed.setFooter({
          text: `Total de votos: ${totalVotos}`,
        });
      }
      await enqueteMessage.delete();

      /* await interaction.editReply({ embeds: [resultadoEmbed] }); */
      await interaction.followUp({ embeds: [resultadoEmbed] });
    });
  },
};
