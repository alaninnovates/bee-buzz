import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Colors,
    EmbedBuilder,
    StringSelectMenuBuilder,
} from 'discord.js';

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
            embeds: [
                new EmbedBuilder()
                    .setTitle('Bee Buzz Help')
                    .setDescription(
                        `Visit the documentation below for a list of all commands. Join the support server if you have any more questions.`,
                    )
                    .setFooter({
                        text: 'Made by alaninnovates',
                    })
                    .setColor(Colors.Yellow),
            ],
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
                        .addOptions([
                            {
                                label: 'Home',
                                value: 'home',
                                emoji: '🏠',
                            },
                            {
                                label: 'Hive Building',
                                value: 'hive-building',
                                emoji: '🍯',
                            },
                            {
                                label: 'Other',
                                value: 'other',
                                emoji: '🐝',
                            },
                        ]),
                ),
            ],
        });
    }
}
