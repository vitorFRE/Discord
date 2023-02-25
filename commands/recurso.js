const { SlashCommandBuilder, EmbedBuilder, hyperlink } = require('discord.js');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

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

    const linkRegex = /^(http|https):\/\/[^ "]+$/;
    if (!linkRegex.test(link)) {
      const errorMessage = await interaction.followUp({
        content: `${interaction.user}, o link fornecido não é válido. Certifique-se de fornecer um link válido começando com "http://" ou "https://", Dica se você copiar o link diretamente do navegador, ele já deve vir com um desses prefixos.`,
        ephemeral: true,
      });

      setTimeout(() => {
        errorMessage.delete();
      }, 30000);
      return;
    }

    let imgSrc = '';
    try {
      const res = await fetch(link);
      const html = await res.text();
      const $ = cheerio.load(html);
      imgSrc = $('meta[property="og:image"]').attr('content');
    } catch (err) {
      console.error(err);
    }

    const recursoEmbed = new EmbedBuilder()
      .setColor('#fff')
      .setTitle(`${recurso}`)
      .setAuthor({
        name: `${interaction.user.username}`,
        iconURL: authorIcon,
      })
      .addFields({ name: 'Descrição', value: descricao })
      .setURL(link)
      .addFields({ name: 'Link', value: hyperlink(link, link) });

    if (imgSrc) {
      if (
        imgSrc.endsWith('.svg') ||
        (await fetch(imgSrc).then((res) =>
          res.headers.get('content-type').startsWith('image/svg+xml'),
        ))
      ) {
        console.log('Imagem é um SVG, não será definida no embed');
      } else {
        recursoEmbed.setImage(imgSrc);
      }
    }

    recursoEmbed
      .setFooter({ text: 'Clique no nome do recurso para ir para o site!' })
      .setTimestamp();

    const recursoMessage = await interaction.followUp({
      embeds: [recursoEmbed],
    });
  },
};
