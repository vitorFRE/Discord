const { ActionRowBuilder, ButtonBuilder } = require('discord.js');

async function createConfirmationMessage(interaction) {
  let answered = false;
  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('sim').setLabel('Sim').setStyle('3'),
    new ButtonBuilder().setCustomId('nao').setLabel('Não').setStyle('4'),
  );

  const message = await interaction.reply({
    content: 'Você tem certeza ?',
    components: [row],
    fetchReply: true,
  });

  console.log(`Mensagem enviada com sucesso: ${message.url}`);

  const filter = (i) =>
    i.customId === 'sim' ||
    i.customId === 'nao' ||
    (i.componentType === 'BUTTON' && i.user.id === message.author.id);
  const collector = message.createMessageComponentCollector({
    filter,
    time: 15000,
  });

  collector.on('collect', async (i) => {
    console.log(`Resposta do usuário detectada: ${i.customId}`);
    if (i.customId === 'sim') {
      answered = true;
      await i.update({
        content: 'Ação confirmada!',
        components: [],
      });
    } else {
      answered = true;
      await i.update({
        content: 'Ação cancelada!',
        components: [],
      });
    }
  });

  collector.on('end', async (collected, reason) => {
    console.log(`Coletor encerrado por ${reason}`);
    if (reason === 'time' && !answered) {
      await message.edit({
        content: 'Tempo limite excedido!',
        components: [],
      });
    }
  });
}

module.exports = {
  createConfirmationMessage,
};
