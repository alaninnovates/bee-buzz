import { Command } from '@sapphire/framework';
import { ApplyOptions } from '@sapphire/decorators';
import { ApplicationIntegrationType, EmbedBuilder } from 'discord.js';

const topEmojis = ['🥇', '🥈', '🥉'];

@ApplyOptions<Command.Options>({
    name: 'leaderboard',
    description: 'View top players',
})
export class LeaderboardCommand extends Command {
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
                idHints: ['1395401934503940098'],
            },
        );
    }

    public override async chatInputRun(
        interaction: Command.ChatInputCommandInteraction,
    ) {
        const hives = await this.container.database
            .collection('hives')
            .find({})
            .sort({ honey: -1 })
            .limit(10)
            .toArray();

        if (hives.length === 0) {
            await interaction.reply({
                content: 'No players found in the leaderboard.',
                ephemeral: true,
            });
            return;
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🏆 Top Players - Honey')
                    .setColor('#FFD700')
                    .setDescription(
                        (
                            await Promise.all(
                                hives
                                    .slice(0, 10)
                                    .map(
                                        async (hive, index) =>
                                            `${
                                                index < 3
                                                    ? topEmojis[index]
                                                    : `${index + 1}. `
                                            } ${
                                                (
                                                    await this.container.client.users.fetch(
                                                        hives[0].userId,
                                                    )
                                                ).displayName
                                            } - 🍯 ${hive.honey} jars`,
                                    ),
                            )
                        ).join('\n'),
                    ),
            ],
        });
    }
}
