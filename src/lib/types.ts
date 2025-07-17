import { Document } from 'mongodb';
import { beeData } from './data/bee';
import { Item } from './data/items';

export interface BeeInfo {
    type: keyof typeof beeData;
    level: number;
    xp: number;
}

export interface UserDocument extends Document {
    userId: string;
    bees: BeeInfo[];
    honey: number;
    items: {
        [key in Item]: number;
    };
    createdAt: Date;
    maxHiveSize: number;
    memoryMatchLevel: number;
}

export interface ForageDocument extends Document {
    userId: string;
    channelId: string;
    notified: boolean;
    bees: BeeInfo[];
    startedAt: Date;
}
