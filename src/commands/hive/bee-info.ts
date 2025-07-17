import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { beeData } from '../../lib/data/bee';
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import { getBeeDataEmbed } from '../../interaction-handlers/bee-info';

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
                            .setRequired(false)
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
        const bee = interaction.options.getString('bee', false);
        if (!bee) {
            await interaction.reply({
                embeds: [getBeeDataEmbed(Object.keys(beeData)[0])],
                components: [
                    new ActionRowBuilder<ButtonBuilder>().addComponents(
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('⬅️')
                            .setCustomId('bee-info:0')
                            .setDisabled(true),
                        new ButtonBuilder()
                            .setStyle(ButtonStyle.Primary)
                            .setEmoji('➡️')
                            .setCustomId(`bee-info:1`),
                    ),
                ],
            });
            return;
        }

        await interaction.reply({
            embeds: [getBeeDataEmbed(bee as keyof typeof beeData)],
        });
    }
}
