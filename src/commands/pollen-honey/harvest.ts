import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationIntegrationType, EmbedBuilder } from 'discord.js';
import {
    calculateForage,
    calculateHoney,
    calculateMaxForageTime,
    calculateTreatsEarned,
} from '../../lib/data/forage';
import { humanReadableTime, minutesBetween } from '../../lib/utils/date';
import { ForageDocument, UserDocument } from '../../lib/types';
import { emojiReplacements, Item } from '../../lib/data/items';

@ApplyOptions<Command.Options>({
    name: 'harvest',
    description: 'Harvest honey from your hive',
})
export class HarvestCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .setIntegrationTypes(
                        ApplicationIntegrationType.GuildInstall,
                    ),
            {
                idHints: ['1393946833512042600'],
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
        const forage = await this.container.database
            .collection<ForageDocument>('forage')
            .findOne({
                userId: interaction.user.id,
            });
        if (!forage) {
            await interaction.reply({
                content:
                    "You haven't foraged yet! Use `/forage` to collect pollen first.",
            });
            return;
        }
        const ppm = calculateForage(forage.bees);
        const maxForageTime = calculateMaxForageTime(forage.bees) / 60;
        const elapsed = minutesBetween(forage.startedAt, new Date());
        const pollen =
            ppm * (elapsed > maxForageTime ? maxForageTime : elapsed);
        const durationSeconds =
            (elapsed > maxForageTime ? maxForageTime : elapsed) * 60;
        const honey = calculateHoney(pollen, forage.bees);

        const treatsEarned = calculateTreatsEarned(durationSeconds, user.bees);
        let newItems = user.items;
        let addtlFields = [];
        if (Object.keys(treatsEarned).length > 0) {
            for (const [treat, amount] of Object.entries(treatsEarned)) {
                newItems[treat as Item] =
                    (newItems[treat as Item] || 0) + amount;
            }
            addtlFields.push({
                name: 'Treats Earned',
                value: `Your bees found some treats while foraging! You received:\n${Object.entries(
                    treatsEarned,
                )
                    .map(
                        ([treat, amount]) =>
                            `${emojiReplacements[treat as Item]} ${amount}x ${
                                treat.charAt(0).toUpperCase() + treat.slice(1)
                            }`,
                    )
                    .join(' | ')}`,
                inline: false,
            });
        }
        await this.container.database.collection('hives').updateOne(
            { userId: interaction.user.id },
            {
                $inc: {
                    honey,
                },
                $set: {
                    items: newItems,
                },
            },
        );
        await this.container.database.collection('forage').deleteOne({
            userId: interaction.user.id,
        });
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🏆 Honey Harvested!')
                    .setDescription(
                        `Buzz buzz! Your bees spent ${humanReadableTime(
                            durationSeconds,
                        )} foraging and produced honey. Your hive just produced:`,
                    )
                    .addFields([
                        {
                            name: 'Pollen Collected',
                            value: `🌼 ${pollen}`,
                        },
                        {
                            name: 'Honey Gained',
                            value: `🍯 ${honey} jars`,
                        },
                        {
                            name: 'Total Honey',
                            value: `🍯 ${user.honey + honey} jars`,
                        },
                        ...addtlFields,
                    ])
                    .setFooter({
                        text: 'Keep those Worker Bees busy!',
                    })
                    .setColor('#FFD700'),
            ],
        });
    }
}
