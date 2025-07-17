import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import {
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
} from 'discord.js';
import { UserDocument } from '../../lib/types';
import { beeData } from '../../lib/data/bee';
import { renderBeeText } from '../../lib/render-hive';
import { emojiReplacements, xpPerFruit } from '../../lib/data/items';

@ApplyOptions<Command.Options>({
    name: 'feed',
    description: 'Feed your bees some treats',
})
export class FeedCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .addStringOption((option) =>
                        option
                            .setName('treat-type')
                            .setDescription('Type of treat to feed your bees')
                            .setRequired(true)
                            .addChoices(
                                ...Object.entries(xpPerFruit).map(
                                    ([fruit, _]) => ({
                                        name: fruit,
                                        value: fruit,
                                    }),
                                ),
                            ),
                    )
                    .addIntegerOption((option) =>
                        option
                            .setName('quantity')
                            .setDescription('Number of treats to feed')
                            .setRequired(false)
                            .setMinValue(1),
                    ),
            {
                idHints: ['1395414612689682633'],
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
        const treatType = interaction.options.getString(
            'treat-type',
            true,
        ) as keyof typeof xpPerFruit;
        const quantity = interaction.options.getInteger('quantity') || 1;

        if ((user.items[treatType] || 0) < quantity) {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('❌ Not Enough Treats')
                        .setDescription(
                            `You don't have enough ${emojiReplacements[treatType]} ${treatType} treats!`,
                        )
                        .addFields([
                            {
                                name: 'Available',
                                value: `You have ${
                                    user.items[treatType] || 0
                                } ${treatType} treats.`,
                                inline: true,
                            },
                        ])
                        .setColor('#FF0000'),
                ],
            });
        }

        const xpBoost = xpPerFruit[treatType] * quantity;

        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🐝 Feed A Bee')
                    .setDescription('Select a bee to feed and boost their xp!')
                    .addFields([
                        {
                            name: 'Bees',
                            value: renderBeeText(user.bees),
                        },
                        {
                            name: 'Treat Type',
                            value: `${emojiReplacements[treatType]} ${treatType} (Boost: ${xpBoost} XP)`,
                            inline: true,
                        },
                        {
                            name: 'Quantity',
                            value: `📦 ${quantity}`,
                            inline: true,
                        },
                    ])
                    .setColor('#FFD700'),
            ],
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`feed-select:${user.userId}`)
                        .setPlaceholder('Select a bee to feed')
                        .setOptions(
                            user.bees.map((bee, index) => ({
                                label: beeData[bee.type].name,
                                value: index.toString(),
                                description: `Feed ${
                                    beeData[bee.type].name
                                } (Level: ${bee.level}, XP: ${bee.xp})`,
                            })),
                        ),
                ),
            ],
        });
    }
}
