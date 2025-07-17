import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { emojiReplacements, Item } from '../data/items';

interface MemoryMatchBoardItem {
    item: Item;
    active: boolean;
    matched: boolean;
}
type MemoryMatchBoard = MemoryMatchBoardItem[][];

type MemoryMatchLevel = 'regular' | 'mega' | 'extreme';

interface MemoryMatchData {
    data: {
        item: Item;
        amount: number;
    }[];
    board: MemoryMatchBoard;
    level: MemoryMatchLevel;
    triesRemaining: number;
}

export class MemoryMatchCache {
    private cache: Map<string, MemoryMatchData>;

    constructor() {
        this.cache = new Map();
    }

    private generateBoard(
        items: { item: Item; amount: number }[],
    ): MemoryMatchBoard {
        // put each of the items in a 2D array twice, dimension 3x4
        const itemList = [...items, ...items].map((i) => i.item);
        // random shuffle
        for (let i = itemList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [itemList[i], itemList[j]] = [itemList[j], itemList[i]];
        }
        const board: Item[][] = [];
        for (let i = 0; i < 3; i++) {
            board.push(itemList.slice(i * 4, i * 4 + 4));
        }
        return board.map((row) =>
            row.map((item) => ({
                item,
                active: false,
                matched: false,
            })),
        );
    }

    public add(
        userId: string,
        data: {
            item: Item;
            amount: number;
        }[],
        level: MemoryMatchLevel,
    ): MemoryMatchData {
        const board = this.generateBoard(data);
        const mmData = { data, board, level, triesRemaining: 5 };
        this.cache.set(userId, mmData);
        return mmData;
    }

    public get(userId: string): MemoryMatchData {
        const entry = this.cache.get(userId);
        if (!entry) {
            throw new Error('No memory match game found for this user.');
        }
        return entry;
    }

    public set(userId: string, data: MemoryMatchData): void {
        this.cache.set(userId, data);
    }

    public remove(userId: string): void {
        this.cache.delete(userId);
    }

    public setBoard(userId: string, board: MemoryMatchBoard): void {
        const entry = this.cache.get(userId);
        if (!entry) {
            throw new Error('No memory match game found for this user.');
        }
        entry.board = board;
    }

    public getBoard(userId: string): MemoryMatchBoard {
        const entry = this.cache.get(userId);
        if (!entry) {
            throw new Error('No memory match game found for this user.');
        }
        return entry.board;
    }

    public getBoardComponents(
        userId: string,
    ): ActionRowBuilder<ButtonBuilder>[] {
        const entry = this.cache.get(userId);
        if (!entry) {
            throw new Error('No memory match game found for this user.');
        }
        const { board } = entry;
        return board.map((row, i) =>
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                row.map((item, j) =>
                    new ButtonBuilder()
                        .setCustomId(`memory-match:${userId}:${i}:${j}`)
                        .setEmoji(
                            item.active || item.matched
                                ? emojiReplacements[item.item as Item]
                                : '❓',
                        )
                        .setStyle(
                            item.active
                                ? ButtonStyle.Primary
                                : item.matched
                                ? ButtonStyle.Success
                                : ButtonStyle.Secondary,
                        )
                        .setDisabled(item.active || item.matched),
                ),
            ),
        );
    }

    public getRecievedItems(userId: string): { item: Item; amount: number }[] {
        const entry = this.cache.get(userId);
        if (!entry) {
            throw new Error('No memory match game found for this user.');
        }
        const receivedItems = [
            ...new Set(
                entry.board.flatMap((row) =>
                    row.filter((cell) => cell.matched).map((cell) => cell.item),
                ),
            ),
        ];
        return entry.data.filter((item) => receivedItems.includes(item.item));
    }
}
