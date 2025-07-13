import { SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';

config();

const client = new SapphireClient({
    intents: [GatewayIntentBits.Guilds],
});

client.login(process.env.DISCORD_TOKEN);
