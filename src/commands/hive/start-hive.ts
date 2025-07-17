import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { Colors, EmbedBuilder } from 'discord.js';
import { beeData } from '../../lib/data/bee';
import { defaultHiveLimit } from '../../lib/constants';

@ApplyOptions<Command.Options>({
    name: 'start-hive',
    description: 'Create your hive',
})
export class StartHiveCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder.setName(this.name).setDescription(this.description),
            {
                idHints: ['1393778577563979788'],
            },
        );
    }

    public override async chatInputRun(
        interaction: Command.ChatInputCommandInteraction,
    ) {
        const existingHive = await this.container.database
            .collection('hives')
            .findOne({
                userId: interaction.user.id,
            });
        if (existingHive) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🚫 Hive Already Exists')
                        .setDescription(
                            'You already have a hive! Forage and get honey with `/forage`.',
                        )
                        .setColor(Colors.Red),
                ],
            });
            return;
        }
        await this.container.database.collection('hives').insertOne({
            userId: interaction.user.id,
            bees: [
                {
                    type: 'queen',
                    level: 1,
                    xp: 0,
                },
                {
                    type: 'worker',
                    level: 1,
                    xp: 0,
                },
                {
                    type: 'worker',
                    level: 1,
                    xp: 0,
                },
                {
                    type: 'worker',
                    level: 1,
                    xp: 0,
                },
            ],
            honey: 0,
            items: {},
            createdAt: new Date(),
            maxHiveSize: defaultHiveLimit,
            memoryMatchLevel: 1,
        });
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🍯 Welcome to Beebo!')
                    .setDescription(
                        "Buzz buzz! You've started your first hive! You've got:",
                    )
                    .setFields([
                        {
                            name: 'Bees',
                            value: `${beeData.queen.emoji} 1 ${beeData.queen.name} | ${beeData.worker.emoji} 3 ${beeData.worker.name}s`,
                            inline: false,
                        },
                        {
                            name: 'Honey Reserves',
                            value: '🍯 0 jars',
                            inline: true,
                        },
                    ])
                    .setFooter({
                        text: 'Tip: Use `/forage` to collect pollen!',
                    })
                    .setColor('#FFD700'),
            ],
        });
    }
}
