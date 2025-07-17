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
▸ \`/expand-hive\` - Upgrade your hive chambers  
▸ \`/breed [bee1] [bee2]\` - Combine bees to hatch new ones  
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
    other: new EmbedBuilder()
        .setTitle(':honeybee: Other Commands')
        .setDescription(
            stripIndents`
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
