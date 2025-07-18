import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationIntegrationType, Colors, EmbedBuilder } from 'discord.js';
import { Item } from '../../lib/data/items';
import { UserDocument } from '../../lib/types';

// [min, max]
const potentialItems: {
    [key in 'regular' | 'mega' | 'extreme']: Partial<{
        [item in Item]: [number, number];
    }>;
} = {
    regular: {
        treat: [10, 20],
        blueberry: [2, 3],
        pineapple: [2, 3],
        strawberry: [2, 3],
        kiwi: [2, 3],
        royalJelly: [1, 1],
        brick: [1, 1],
    },
    mega: {
        treat: [40, 80],
        blueberry: [5, 6],
        pineapple: [5, 6],
        strawberry: [5, 6],
        kiwi: [5, 6],
        royalJelly: [2, 2],
        brick: [2, 3],
    },
    extreme: {
        treat: [100, 200],
        blueberry: [10, 12],
        pineapple: [10, 12],
        strawberry: [10, 12],
        kiwi: [10, 12],
        royalJelly: [3, 5],
        brick: [5, 7],
    },
};

const eggPotentials: {
    [key in 'regular' | 'mega' | 'extreme']: {
        silver: number;
        gold: number;
        diamond: number;
    };
} = {
    regular: {
        silver: 0.1,
        gold: 0.05,
        diamond: 0.01,
    },
    mega: {
        silver: 0.2,
        gold: 0.1,
        diamond: 0.05,
    },
    extreme: {
        silver: 0.2,
        gold: 0.15,
        diamond: 0.1,
    },
};

const getItems = (
    level: 'regular' | 'mega' | 'extreme',
): { item: Item; amount: number }[] => {
    const potItems = potentialItems[level];
    const eggPot = eggPotentials[level];
    const amounts = Object.entries(potItems)
        .map(([item, [min, max]]) => ({
            item: item as Item,
            amount: Math.floor(Math.random() * (max - min + 1)) + min,
        }))
        .filter(({ amount }) => amount > 0);
    const items: { item: Item; amount: number }[] = [];
    while (items.length < 6 && amounts.length > 0) {
        const randomIndex = Math.floor(Math.random() * amounts.length);
        const item = amounts.splice(randomIndex, 1)[0];
        items.push(item);
    }

    if (Math.random() < eggPot.silver) {
        items.splice(Math.floor(Math.random() * items.length), 1, {
            item: 'silverEgg',
            amount: 1,
        });
    }
    if (Math.random() < eggPot.gold) {
        items.splice(Math.floor(Math.random() * items.length), 1, {
            item: 'goldEgg',
            amount: 1,
        });
    }
    if (Math.random() < eggPot.diamond) {
        items.splice(Math.floor(Math.random() * items.length), 1, {
            item: 'diamondEgg',
            amount: 1,
        });
    }
    return items;
};

@ApplyOptions<Command.Options>({
    name: 'memory-match',
    description: 'Test your memory',
})
export class MemoryMatchCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .addStringOption((option) =>
                        option
                            .setName('level')
                            .setDescription('The difficulty level of the game')
                            .setRequired(true)
                            .addChoices(
                                { name: 'Regular', value: 'regular' },
                                { name: 'Mega', value: 'mega' },
                                { name: 'Extreme', value: 'extreme' },
                            ),
                    )
                    .setIntegrationTypes(
                        ApplicationIntegrationType.GuildInstall,
                    ),
            {
                idHints: ['1395414702594723983'],
            },
        );
    }

    public override async chatInputRun(
        interaction: Command.ChatInputCommandInteraction,
    ) {
        const user = await this.container.database
            .collection<UserDocument>('hives')
            .findOne({
                userId: interaction.user.id,
            });
        if (!user) {
            await interaction.reply({
                content:
                    "You don't have a hive yet! Use `/start-hive` to create one.",
            });
            return;
        }
        const level = interaction.options.getString('level', true) as
            | 'regular'
            | 'mega'
            | 'extreme';
        const userMemoryMatchLevel = user.memoryMatchLevel || 1;
        if (
            (level === 'mega' && userMemoryMatchLevel < 2) ||
            (level === 'extreme' && userMemoryMatchLevel < 3)
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🚫 Level Locked')
                        .setDescription(
                            `Your memory match pass is not sufficient. To upgrade, use \`/upgrade memory-match\`.`,
                        )
                        .setColor(Colors.Red),
                ],
            });
            return;
        }
        const items = getItems(level);
        const mmData = this.container.caches.memoryMatch.add(
            interaction.user.id,
            items,
            level,
        );
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🧠 Memory Match')
                    .setDescription(`Try to match as many pairs as possible!`)
                    .setColor(Colors.Blue)
                    .setFooter({
                        text: `Tries Remaining: ${mmData.triesRemaining}`,
                    }),
            ],
            components: this.container.caches.memoryMatch.getBoardComponents(
                interaction.user.id,
            ),
        });
    }
}
