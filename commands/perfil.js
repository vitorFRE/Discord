const { SlashCommandBuilder } = require('discord.js');
const { createConfirmationMessage } = require('../utils/confirmation');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('teste')
    .setDescription('testando o confirm'),
  async execute(interaction) {
    await createConfirmationMessage(interaction);
  },
};
