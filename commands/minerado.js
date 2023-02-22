const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('minerado')
    .setDescription('Responde com quem foi minerado')
    .addUserOption((option) =>
      option
        .setName('usuário')
        .setDescription('Usuário que foi minerado')
        .setRequired(true),
    ),
  async execute(interaction) {
    const user = interaction.options.getUser('usuário');
    await interaction.reply(`O usuário ${user} foi minerado!`);
  },
};
