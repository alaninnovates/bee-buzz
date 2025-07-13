import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import { beeData } from '../../lib/data';

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
        await this.container.database.collection('hives').insertOne({
            userId: interaction.user.id,
            bees: {
                queen: 1,
                worker: 3,
            },
            honey: 0,
            createdAt: new Date(),
        });
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🍯 Welcome to Bee Buzz!')
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
