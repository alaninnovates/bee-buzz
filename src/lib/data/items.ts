export const emojiReplacements = {
    honey: '🍯',
    treat: '🍬',
    blueberry: '🫐',
    pineapple: '🍍',
    strawberry: '🍓',
    kiwi: '🥝',
    royalJelly: '🫙',
    brick: '🧱',
    silverEgg: '🩶',
    goldEgg: '⭐',
    diamondEgg: '💎',
};

export type Item = Exclude<keyof typeof emojiReplacements, 'honey'>;

export const xpPerFruit = {
    treat: 2,
    blueberry: 5,
    pineapple: 10,
    strawberry: 15,
    kiwi: 20,
} as {
    [key in Item]: number;
};
