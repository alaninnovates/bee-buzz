import { Colors, EmbedBuilder } from 'discord.js';
import { stripIndents } from 'common-tags';

export const pages = {
    home: new EmbedBuilder()
        .setTitle('Beebo Help')
        .setDescription(
            `Visit the documentation below for a list of all commands. Join the support server if you have any more questions.`,
        )
        .setFooter({
            text: 'Made by alaninnovates',
        })
        .setColor(Colors.White),
    'hive-building': new EmbedBuilder()
        .setTitle(':honey_pot: Hive building')
        .setDescription(
            stripIndents`
▸ \`/start-hive\` - Create your first hive  
▸ \`/check-hive\` - View your hive's status  
▸ \`/expand-hive\` - Add more space to your hive  
▸ \`/breed [bee1] [bee2]\` - Combine bees to hatch new ones
▸ \`/evict\` - Remove a bee from your hive
▸ \`/feed [treat-type] <quantity>\` - Feed your bees treats
▸ \`/bee-info [bee name]\` - See details & stats of any bee

[] = Optional | <> = Required
`,
        )
        .setColor(Colors.Yellow),
    'pollen-honey': new EmbedBuilder()
        .setTitle('🌸 Pollen & Honey')
        .setDescription(
            stripIndents`
▸ \`/forage\` - Collect pollen from flowers
▸ \`/harvest\` - Turn pollen into honey jars

[] = Optional | <> = Required
`,
        )
        .setColor(Colors.Orange),
    games: new EmbedBuilder().setTitle('🎮 Games').setDescription(
        stripIndents`
▸ \`/memory-match [difficulty]\` - Play a memory matching game to get prizes!
▸ \`/upgrade\` - Upgrade your game passes

[] = Optional | <> = Required
        `,
    ),
    other: new EmbedBuilder()
        .setTitle(':honeybee: Other Commands')
        .setDescription(
            stripIndents`
▸ \`/leaderboard\` - View the top people for honey
▸ \`/inventory\` - View your items
▸ \`/help\` - View this help menu

[] = Optional | <> = Required
        `,
        )
        .setColor(Colors.Blue),
};

export const menuData = {
    home: {
        emoji: '🏠',
        name: 'Home',
    },
    'hive-building': {
        emoji: '🍯',
        name: 'Hive Building',
    },
    'pollen-honey': {
        emoji: '🌸',
        name: 'Pollen & Honey',
    },
    games: {
        emoji: '🎮',
        name: 'Games',
    },
    other: {
        emoji: '🐝',
        name: 'Other',
    },
} as {
    [K in keyof typeof pages]: {
        emoji: string;
        name: string;
    };
};
