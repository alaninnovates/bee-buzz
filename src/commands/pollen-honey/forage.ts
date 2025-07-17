import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import { calculateForage, calculateMaxForageTime } from '../../lib/data/forage';
import { ForageDocument, UserDocument } from '../../lib/types';
import { renderBeeText } from '../../lib/render-hive';
import { humanReadableTime } from '../../lib/utils/date';

@ApplyOptions<Command.Options>({
    name: 'forage',
    description: 'Collect pollen',
})
export class ForageCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder.setName(this.name).setDescription(this.description),
            {
                idHints: ['1393946832018870364'],
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
        if (forage) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🚫 Foraging Already In Progress')
                        .setDescription(
                            'Your bees are already out foraging! Harvest pollen with `/harvest` before starting a new forage.',
                        )
                        .setColor('#FF0000'),
                ],
            });
            return;
        }
        await this.container.database.collection('forage').insertOne({
            userId: interaction.user.id,
            channelId: interaction.channelId,
            notified: false,
            bees: user.bees,
            startedAt: new Date(),
        });
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🍃 Foraging Started!')
                    .setDescription(
                        `Your bees were sent to the wildflower fields. To finish foraging, use the \`/harvest\` command.`,
                    )
                    .addFields([
                        {
                            name: 'Bees Foraging',
                            value: renderBeeText(user.bees),
                        },
                        {
                            name: 'Est Pollen Per Minute',
                            value: calculateForage(user.bees).toString(),
                            inline: true,
                        },
                        {
                            name: 'Max Forage Time',
                            value: humanReadableTime(
                                calculateMaxForageTime(user.bees),
                            ),
                            inline: true,
                        },
                    ])
                    .setFooter({
                        text: 'Tip: Level up and breed your bees to forage faster!',
                    })
                    .setColor('#FFD700'),
            ],
        });
    }
}
