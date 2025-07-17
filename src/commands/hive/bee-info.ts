import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { beeData } from '../../lib/data/data';
import { Colors, EmbedBuilder } from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'bee-info',
    description: 'Get information about a bee',
})
export class BeeInfoCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .addStringOption((option) =>
                        option
                            .setName('bee')
                            .setDescription('The bee to get information about')
                            .setRequired(true)
                            .setChoices(
                                ...Object.entries(beeData).map(
                                    ([key, value]) => ({
                                        name: value.name,
                                        value: key,
                                    }),
                                ),
                            ),
                    ),
            {
                idHints: ['1395390400306614383'],
            },
        );
    }

    public override async chatInputRun(
        interaction: Command.ChatInputCommandInteraction,
    ) {
        const bee = interaction.options.getString('bee', true);
        const data = beeData[bee as keyof typeof beeData];

        if (!data) {
            await interaction.reply({
                content: "This bee doesn't exist!",
                ephemeral: true,
            });
            return;
        }

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`${data.emoji} ${data.name}`)
                    .setDescription(data.description)
                    .addFields([
                        {
                            name: 'Rarity',
                            value: data.rarity,
                            inline: true,
                        },
                        {
                            name: `Ability - ${data.ability.name}`,
                            value: data.ability.effect,
                        },
                    ])
                    .setColor(Colors.Yellow),
            ],
        });
    }
}
