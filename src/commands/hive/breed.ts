import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationIntegrationType, EmbedBuilder } from 'discord.js';
import { beeData } from '../../lib/data/bee';
import { breedBees, calculateBreedCost } from '../../lib/data/breed';
import { UserDocument } from '../../lib/types';

@ApplyOptions<Command.Options>({
    name: 'breed',
    description: 'Breed bees in your hive',
})
export class BreedCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .addStringOption((option) =>
                        option
                            .setName('bee-1')
                            .setDescription('First bee to breed')
                            .setRequired(true)
                            .setChoices(
                                Object.entries(beeData).map(([key, value]) => ({
                                    name: value.name,
                                    value: key,
                                })),
                            ),
                    )
                    .addStringOption((option) =>
                        option
                            .setName('bee-2')
                            .setDescription('Second bee to breed')
                            .setRequired(true)
                            .setChoices(
                                Object.entries(beeData).map(([key, value]) => ({
                                    name: value.name,
                                    value: key,
                                })),
                            ),
                    )
                    .setIntegrationTypes(
                        ApplicationIntegrationType.GuildInstall,
                    ),
            {
                idHints: ['1394134984692076615'],
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
        if (Object.keys(user.bees).length >= user.maxHiveSize) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🚫 Hive Limit Reached')
                        .setDescription(
                            `You can only have up to ${user.maxHiveSize} bees in your hive. Please either remove some with \`/evict\` or expand your hive with \`/expand-hive\`.`,
                        )
                        .setColor('#FF0000'),
                ],
            });
            return;
        }
        const bee1 = interaction.options.getString('bee-1', true);
        const bee2 = interaction.options.getString('bee-2', true);

        const qtyBee1 = user.bees.reduce(
            (acc, bee) => acc + (bee.type === bee1 ? 1 : 0),
            0,
        );
        const qtyBee2 = user.bees.reduce(
            (acc, bee) => acc + (bee.type === bee2 ? 1 : 0),
            0,
        );
        if (
            (bee1 === bee2 && qtyBee1 < 2) ||
            (bee1 !== bee2 && (qtyBee1 < 1 || qtyBee2 < 1))
        ) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🚫 Not Enough Bees')
                        .setDescription(
                            `You need at least 1 ${beeData[bee1].name} and 1 ${beeData[bee2].name} to breed!`,
                        )
                        .setColor('#FF0000'),
                ],
            });
            return;
        }

        const cost = calculateBreedCost(bee1, bee2);
        if ((user.honey || 0) < cost) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🚫 Not Enough Honey')
                        .setDescription(
                            `Breeding these bees costs 🍯 ${cost} honey, but you only have 🍯 ${user.honey}.`,
                        )
                        .setColor('#FF0000'),
                ],
            });
            return;
        }

        const newBee = breedBees(bee1, bee2);

        if (!newBee) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🚫 Breeding Failed')
                        .setDescription(
                            'Your bees did not produce a new bee. Try different combinations!',
                        )
                        .setColor('#FF0000'),
                ],
            });
            return;
        }

        await this.container.database
            .collection<UserDocument>('hives')
            .updateOne(
                { userId: interaction.user.id },
                {
                    $inc: {
                        honey: -cost,
                    },
                    $push: {
                        bees: {
                            type: newBee,
                            level: 1,
                            xp: 0,
                        } as any,
                    },
                },
            );

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🐣 New Bee Hatched!')
                    .setDescription(
                        `🎉 Congratulations! You bred a new ${beeData[newBee].emoji} ${newBee}!`,
                    )
                    .addFields([
                        {
                            name: `Ability - ${beeData[newBee].ability.name}`,
                            value: beeData[newBee].ability.effect,
                        },
                        {
                            name: 'Rarity',
                            value: beeData[newBee].rarity,
                        },
                    ])
                    .setFooter({
                        text: 'Keep experimenting for legendary bees!',
                    })
                    .setColor('#FFD700'),
            ],
        });
    }
}
