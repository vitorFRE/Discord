const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('minerado')
    .setDescription('responda com foi minerado'),
  async execute(interaction) {
    await interaction.reply(`Você foi Minerado ${interaction.user.username}`);
  },
};
