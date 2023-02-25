const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('perfil')
    .setDescription('definir informações do perfil')
    .addStringOption((option) =>
      option
        .setName('cargo')
        .setDescription('Junior,Pleno,Senior')
        .setRequired(true),
    ),
  async execute(interaction) {
    const cargo = interaction.options.getString('cargo');
    await interaction.reply(`${cargo}`);
  },
};
