import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import { beeData } from '../../lib/data';

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
        const user = await this.container.database.collection('hives').findOne({
            userId: interaction.user.id,
        });
        if (!user) {
            await interaction.reply({
                content:
                    "You don't have a hive yet! Use `/start-hive` to create one.",
            });
            return;
        }
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`🏠 ${interaction.user.displayName}'s Hive`)
                    .setDescription("Here's what's buzzing in your hive!")
                    .addFields([
                        {
                            name: 'Bees',
                            value: Object.keys(user.bees)
                                .map((bee) => {
                                    const data =
                                        beeData[bee as keyof typeof beeData];
                                    return `${data.emoji} ${user.bees[bee]} ${
                                        data.name
                                    }${user.bees[bee] > 1 ? 's' : ''}`;
                                })
                                .join(' | '),
                            inline: true,
                        },
                        {
                            name: 'Honey',
                            value: `🍯 ${user.honey || 0} jars`,
                            inline: true,
                        },
                        {
                            name: 'Pollen',
                            value: `🌼 ${user.pollen || 0} units`,
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
