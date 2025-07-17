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
