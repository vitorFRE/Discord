const { SlashCommandBuilder, EmbedBuilder, hyperlink } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('recurso')
    .setDescription('Sugestões de coisas uteis')
    .addStringOption((option) =>
      option
        .setName('nome')
        .setDescription('Nome do recurso, ex: Unsplash')
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('descricao')
        .setDescription(
          'Descrição sobre o recurso, ex: Banco de imagens gratuitas',
        )
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName('link')
        .setDescription('Link do recurso sugerido, link valido com http')
        .setRequired(true),
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const recurso = interaction.options.getString('nome');
    const descricao = interaction.options.getString('descricao');

    const link = interaction.options.getString('link');

    const authorIcon = interaction.user.avatarURL()
      ? interaction.user.avatarURL()
      : interaction.guild.iconURL();

    const recursoEmbed = new EmbedBuilder()
      .setColor('#fff')
      .setTitle(`${recurso}`)
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: authorIcon,
      })
      .setThumbnail(`${interaction.guild.iconURL()}`)
      .setDescription(descricao)
      .setImage(link)
      .setURL(link)
      .setTimestamp();

    const recursoMessage = await interaction.followUp({
      embeds: [recursoEmbed],
    });
  },
};
