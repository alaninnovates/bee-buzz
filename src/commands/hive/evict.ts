import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import {
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
} from 'discord.js';
import { beeData } from '../../lib/data';

@ApplyOptions<Command.Options>({
    name: 'evict',
    description: 'Remove a bee from your hive',
})
export class EvictCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder.setName(this.name).setDescription(this.description),
            {
                idHints: ['1395390401883410585'],
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
        const embed = new EmbedBuilder()
            .setTitle('🚫 Evict a Bee')
            .setDescription('Select what bee to evict.')
            .addFields([
                {
                    name: 'Bees',
                    value:
                        Object.keys(user.bees)
                            .map((bee) => {
                                const data =
                                    beeData[bee as keyof typeof beeData];
                                return `${data.emoji} ${user.bees[bee]} ${
                                    data.name
                                }${user.bees[bee] > 1 ? 's' : ''}`;
                            })
                            .join('\n') || 'No bees yet!',
                },
                {
                    name: 'Hive Limit',
                    value: `${Object.keys(user.bees).length}/${
                        user.maxHiveSize
                    } bees`,
                },
            ])
            .setColor('#FFD700');

        await interaction.reply({
            embeds: [embed],
            components: [
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId(`evict-select:${interaction.user.id}`)
                        .setPlaceholder('Select a bee to evict')
                        .setOptions(
                            Object.keys(user.bees).map((bee) => {
                                const data =
                                    beeData[bee as keyof typeof beeData];
                                return {
                                    label: `${data.emoji} ${data.name} (${user.bees[bee]})`,
                                    value: bee,
                                    description: `Evict ${data.name}`,
                                };
                            }),
                        ),
                ),
            ],
        });
    }
}
