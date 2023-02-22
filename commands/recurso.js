const { SlashCommandBuilder, EmbedBuilder, hyperlink } = require('discord.js');
const fetch = require('node-fetch');

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

    const response = await fetch(link);
    const body = await response.text();

    const imageMatch = body.match(
      /<meta.*property="og:image".*content="(.*)".*>/i,
    );
    const image = imageMatch ? imageMatch[1] : '';
    const url = response.url;

    const recursoEmbed = new EmbedBuilder()
      .setColor('#fff')
      .setTitle(`${recurso}`)
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: authorIcon,
      })
      .setThumbnail(`${interaction.guild.iconURL()}`)
      .setDescription(descricao)
      .addFields({ name: 'Descrição', value: descricao })
      .addFields({ name: 'Link', value: hyperlink(url, url) })
      .setFooter({ text: 'Clique no nome do recurso para ir para o site!' })
      .setTimestamp();

    const recursoMessage = await interaction.followUp({
      embeds: [recursoEmbed],
    });
  },
};
