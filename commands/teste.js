const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pizza')
    .setDescription('Pergunta se o usuário gosta de pizza.'),
  async execute(interaction) {
    // Diferir a resposta da interação enquanto processa a coleta de reações
    await interaction.deferReply();

    // Envia a mensagem com a pergunta e obtém a referência para a mensagem em um objeto Message
    const pizzaMessage = await interaction.followUp('Você gosta de pizza?');

    // Adiciona a reação à mensagem
    await pizzaMessage.react('👍');

    // Define o filtro de reação para coletar apenas reações do usuário que disparou o comando
    const filter = (reaction, user) => {
      return ['👍'].includes(reaction.emoji.name) && user.id !== bot.user.id;
    };

    // Cria o coletor de reações com um tempo limite de 15 segundos
    const collector = pizzaMessage.createReactionCollector({
      filter,
      time: 15000,
    });

    // Registra o evento de coleta de reação
    collector.on('collect', (reaction, user) => {
      console.log(`${user.tag} reagiu com ${reaction.emoji.name}`);
    });

    // Registra o evento de finalização da coleta
    collector.on('end', (collected) => {
      console.log(`Foram coletadas ${collected.size} reações`);
      // Enviar a resposta da interação depois que a coleta de reações estiver completa
      interaction.editReply(
        `Foram coletadas ${collected.size} reações de pizza!`,
      );
    });
  },
};
