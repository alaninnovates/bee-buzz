import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

interface MemoryMatchBoardItem {
    item: string;
    active: boolean;
    matched: boolean;
}
type MemoryMatchBoard = MemoryMatchBoardItem[][];

type MemoryMatchLevel = 'regular' | 'mega' | 'extreme';

const emojiReplacements = {
    treat: '🍬',
    blueberry: '🫐',
    pineapple: '🍍',
    strawberry: '🍓',
    kiwi: '🥝',
    royalJelly: '🫙',
    brick: '🧱',
    silverEgg: '🥚🩶',
    goldEgg: '🥚⭐',
    diamondEgg: '🥚💎',
};

export class MemoryMatchCache {
    private cache: Map<
        string,
        {
            data: {
                item: string;
                amount: number;
            }[];
            board: MemoryMatchBoard;
            level: MemoryMatchLevel;
        }
    >;

    constructor() {
        this.cache = new Map();
    }

    private generateBoard(
        items: { item: string; amount: number }[],
    ): MemoryMatchBoard {
        // put each of the items in a 2D array twice, dimension 3x4
        const itemList = [...items, ...items].map((i) => i.item);
        // random shuffle
        for (let i = itemList.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [itemList[i], itemList[j]] = [itemList[j], itemList[i]];
        }
        const board: string[][] = [];
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
            item: string;
            amount: number;
        }[],
        level: MemoryMatchLevel,
    ): void {
        const board = this.generateBoard(data);
        this.cache.set(userId, { data, board, level });
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
                                ? emojiReplacements[
                                      item.item as keyof typeof emojiReplacements
                                  ]
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
}
