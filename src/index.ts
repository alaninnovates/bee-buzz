import { config } from 'dotenv';
import { Client } from './client';

config();

const client = new Client();

client.login(process.env.DISCORD_TOKEN);
