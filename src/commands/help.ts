import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    StringSelectMenuBuilder,
} from 'discord.js';
import { menuData, pages } from '../lib/help/pages';

@ApplyOptions<Command.Options>({
    name: 'help',
    description: 'Get help with the bot',
})
export class HelpCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder.setName(this.name).setDescription(this.description),
            {
                idHints: ['1393749717485355051'],
            },
        );
    }

    public override async chatInputRun(
        interaction: Command.ChatInputCommandInteraction,
    ) {
        await interaction.reply({
            embeds: [pages.home],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Documentation')
                        .setURL('https://alaninnovates.com'),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Link)
                        .setLabel('Support Server')
                        .setURL('https://alaninnovates.com'),
                ),
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('help-select')
                        .setPlaceholder('Select a category')
                        .addOptions(
                            ...Object.entries(menuData).map(([id, value]) => ({
                                label: value.name,
                                value: id,
                                emoji: value.emoji,
                            })),
                        ),
                ),
            ],
        });
    }
}
