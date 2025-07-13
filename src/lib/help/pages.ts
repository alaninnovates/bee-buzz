import { Colors, EmbedBuilder } from 'discord.js';
import { stripIndents } from 'common-tags';

export const pages = {
    home: new EmbedBuilder()
        .setTitle('Bee Buzz Help')
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
