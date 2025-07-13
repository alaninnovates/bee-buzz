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
};
