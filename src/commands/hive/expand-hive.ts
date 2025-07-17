import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { calculateExpandHiveCost } from '../../lib/constants';
import { Colors, EmbedBuilder } from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'expand-hive',
    description: 'Expand your hive',
})
export class ExpandHiveCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder.setName(this.name).setDescription(this.description),
            {
                idHints: ['1395390403145891943'],
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
        const cost = calculateExpandHiveCost(user.maxHiveSize);
        if (user.honey < cost) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🚫 Not Enough Honey')
                        .setDescription(
                            `You need **${cost}** honey to expand your hive, but you only have **${user.honey}**.`,
                        )
                        .setColor(Colors.Red),
                ],
            });
            return;
        }
        await this.container.database
            .collection('hives')
            .updateOne(
                { userId: interaction.user.id },
                { $inc: { maxHiveSize: 1, honey: -cost } },
            );
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🐝 Hive Expansion Success!')
                    .setDescription(
                        `Your hive has been expanded! You can now have **${
                            user.maxHiveSize + 1
                        }** bees.`,
                    )
                    .addFields([
                        {
                            name: 'New Hive Limit',
                            value: `${user.maxHiveSize + 1} bees`,
                            inline: true,
                        },
                        {
                            name: 'Honey Spent',
                            value: `🍯 ${cost} honey`,
                            inline: true,
                        },
                    ])
                    .setColor(Colors.Gold),
            ],
        });
    }
}
