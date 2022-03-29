module.exports = {
    name: "ping",
    category: "info",
    description: "Returns latency and API ping",
    run: async (client, message, args) => {
        message.delete();
        const msg = await client.createMessage(message.channel.id, "Pinging...");

        msg.edit(`Pong!\nLatency is ${Math.floor(msg.createdAt - message.createdAt)}ms`);
    }
}