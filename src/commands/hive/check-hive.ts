import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import { calculateForage, calculateMaxForageTime } from '../../lib/data/forage';
import { minutesBetween } from '../../lib/utils/date';
import { UserDocument } from '../../lib/types';
import { renderBeeText } from '../../lib/render-hive';

@ApplyOptions<Command.Options>({
    name: 'check-hive',
    description: 'Check your hive status',
})
export class CheckHiveCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder.setName(this.name).setDescription(this.description),
            {
                idHints: ['1393778579132776480'],
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
        let pollen = 0;
        const forage = await this.container.database
            .collection('forage')
            .findOne({
                userId: interaction.user.id,
            });
        if (forage) {
            const ppm = calculateForage(forage.bees);
            const maxForageTime = calculateMaxForageTime(forage.bees) / 60;
            const elapsed = minutesBetween(forage.startedAt, new Date());
            pollen = ppm * (elapsed > maxForageTime ? maxForageTime : elapsed);
        }
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`🏠 ${interaction.user.displayName}'s Hive`)
                    .setDescription("Here's what's buzzing in your hive!")
                    .addFields([
                        {
                            name: 'Bees',
                            value: renderBeeText(user.bees),
                            inline: false,
                        },
                        {
                            name: 'Honey',
                            value: `🍯 ${user.honey || 0} jars`,
                            inline: true,
                        },
                        {
                            name: 'Pollen',
                            value: `🌼 ${pollen} units`,
                            inline: true,
                        },
                        {
                            name: 'Hive Level',
                            value: `🏰 Level ${user.level || 1}`,
                            inline: true,
                        },
                    ])
                    .setFooter({
                        text: 'Tip: Breed bees to grow your swarm!',
                    })
                    .setColor('#FFD700'),
            ],
        });
    }
}
