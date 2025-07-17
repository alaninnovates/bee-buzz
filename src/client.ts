import { container, SapphireClient } from '@sapphire/framework';
import { GatewayIntentBits } from 'discord.js';
import { createClient } from './lib/db';
import { Db, MongoClient } from 'mongodb';
import { MemoryMatchCache } from './lib/caches/memory-match';

export class Client extends SapphireClient {
    public constructor() {
        super({
            intents: [GatewayIntentBits.Guilds],
        });
    }

    public override async login(token?: string) {
        container.databaseClient = createClient();
        await container.databaseClient.connect();
        container.database = container.databaseClient.db('beeBuzz');
        container.caches = {
            memoryMatch: new MemoryMatchCache(),
        };
        return super.login(token);
    }

    public override async destroy() {
        await container.databaseClient.close();
        return super.destroy();
    }
}

declare module '@sapphire/pieces' {
    interface Container {
        databaseClient: MongoClient;
        database: Db;
        caches: {
            memoryMatch: MemoryMatchCache;
        };
    }
}
