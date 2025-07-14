export type Rarity =
    | 'Unique'
    | 'Common'
    | 'Uncommon'
    | 'Rare'
    | 'Epic'
    | 'Legendary';

export const beeData = {
    queen: {
        name: 'Queen Bee',
        emoji: '👑',
        rarity: 'Unique',
        description: 'The leader of the hive. Increases breeding speed.',
        ability: {
            name: 'Royal Presence',
            effect: '+20% breeding rate',
        },
    },
    worker: {
        name: 'Worker Bee',
        emoji: '🐝',
        rarity: 'Common',
        description: 'Basic collector bee. Gathers pollen steadily.',
        ability: {
            name: 'Steady Forager',
            effect: '+1 pollen per minute',
        },
    },
    guard: {
        name: 'Guard Bee',
        emoji: '🦸‍♂️',
        rarity: 'Uncommon',
        description: 'Protects your hive from raids and boosts forager speed.',
        ability: {
            name: 'Hive Defender',
            effect: 'Repels attacks, +5% worker bee efficiency',
        },
    },
    rainbow: {
        name: 'Rainbow Bee',
        emoji: '🌈',
        rarity: 'Rare',
        description: 'A magical bee that gathers rare flowers.',
        ability: {
            name: 'Lucky Forager',
            effect: '+10% chance to find special nectar',
        },
    },
    speed: {
        name: 'Speed Bee',
        emoji: '⚡️',
        rarity: 'Rare',
        description: 'Fast scout bee that doubles pollen collection speed.',
        ability: {
            name: 'Quick Buzz',
            effect: '+50% pollen gathering speed',
        },
    },
    chill: {
        name: 'Chill Bee',
        emoji: '❄️',
        rarity: 'Epic',
        description: 'Keeps things cool — slows down rival raids.',
        ability: {
            name: 'Frost Aura',
            effect: '-15% damage from raids',
        },
    },
    fire: {
        name: 'Fire Bee',
        emoji: '🔥',
        rarity: 'Legendary',
        description: 'Aggressive bee that can raid other hives.',
        ability: {
            name: 'Scorched Earth',
            effect: '+30% success on raids',
        },
    },
} as {
    [key: string]: {
        name: string;
        emoji: string;
        rarity: Rarity;
        description: string;
        ability: {
            name: string;
            effect: string;
        };
    };
};

export const breedData = {
    'worker+worker': [{ result: 'worker', chance: 1.0 }],
    'guard+guard': [{ result: 'guard', chance: 1.0 }],
    'speed+speed': [
        { result: 'speed', chance: 0.95 },
        { result: 'rainbow', chance: 0.05 },
    ],
    'rainbow+rainbow': [
        { result: 'rainbow', chance: 0.9 },
        { result: 'chill', chance: 0.1 },
    ],
    'worker+guard': [
        { result: 'worker', chance: 0.8 },
        { result: 'guard', chance: 0.2 },
    ],
    'worker+speed': [
        { result: 'worker', chance: 0.7 },
        { result: 'speed', chance: 0.3 },
    ],
    'worker+rainbow': [
        { result: 'worker', chance: 0.6 },
        { result: 'rainbow', chance: 0.35 },
        { result: 'speed', chance: 0.05 },
    ],
    'speed+rainbow': [
        { result: 'speed', chance: 0.5 },
        { result: 'rainbow', chance: 0.4 },
        { result: 'chill', chance: 0.1 },
    ],
    'rainbow+chill': [
        { result: 'chill', chance: 0.6 },
        { result: 'rainbow', chance: 0.4 },
    ],
    'speed+chill': [
        { result: 'chill', chance: 0.7 },
        { result: 'speed', chance: 0.3 },
    ],
    'chill+chill': [
        { result: 'chill', chance: 0.95 },
        { result: 'fire', chance: 0.05 },
    ],
    'rainbow+fire': [
        { result: 'fire', chance: 0.5 },
        { result: 'rainbow', chance: 0.5 },
    ],
    'chill+fire': [
        { result: 'fire', chance: 0.7 },
        { result: 'chill', chance: 0.3 },
    ],
    'guard+queen': [
        { result: 'guard', chance: 0.8 },
        { result: 'queen', chance: 0.2 },
    ],
    'worker+queen': [
        { result: 'worker', chance: 0.9 },
        { result: 'queen', chance: 0.1 },
    ],
    'queen+speed': [{ result: 'speed', chance: 1.0 }],
    'queen+fire': [{ result: 'fire', chance: 1.0 }],
    'queen+queen': [{ result: 'queen', chance: 1.0 }],
    'fire+fire': [{ result: 'fire', chance: 1.0 }],
} as {
    [key: string]: { result: Bee; chance: number }[];
};

export type Bee = keyof typeof beeData;

export const rarityCost = {
    Unique: 550,
    Common: 5,
    Uncommon: 15,
    Rare: 40,
    Epic: 120,
    Legendary: 200,
} as {
    [key in Rarity]: number;
};
