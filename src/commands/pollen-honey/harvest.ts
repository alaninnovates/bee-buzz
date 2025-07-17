import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import { calculateForage, calculateHoney } from '../../lib/data/forage';
import {
    minutesBetween,
    secondsBetween,
    humanReadableTime,
} from '../../lib/utils/date';
import { ForageDocument, UserDocument } from '../../lib/types';

@ApplyOptions<Command.Options>({
    name: 'harvest',
    description: 'Harvest honey from your hive',
})
export class HarvestCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder.setName(this.name).setDescription(this.description),
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
        const pollen = minutesBetween(forage.startedAt, new Date()) * ppm;
        const honey = calculateHoney(pollen, forage.bees);
        await this.container.database.collection('hives').updateOne(
            { userId: interaction.user.id },
            {
                $inc: {
                    honey,
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
                            secondsBetween(forage.startedAt, new Date()),
                        )} foraging and produced honey. Your hive just produced:`,
                    )
                    .addFields([
                        {
                            name: 'Pollen Used',
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
                    ])
                    .setFooter({
                        text: 'Keep those Worker Bees busy!',
                    })
                    .setColor('#FFD700'),
            ],
        });
    }
}
