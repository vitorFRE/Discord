const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

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
    await interaction.deferReply(); // Deferir a resposta da interação

    const pergunta = interaction.options.getString('pergunta');
    const opcoes = interaction.options.getString('opcoes').split(',');
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

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

    await interaction.editReply({
      content: 'Enquete criada!',
      embeds: [enqueteEmbed],
    }); // Responder a interação com a mensagem final
  },
};
