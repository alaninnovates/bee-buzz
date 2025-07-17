import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import { UserDocument } from '../lib/types';
import { emojiReplacements } from '../lib/data/items';
import { toTitleCase } from '@sapphire/utilities';

@ApplyOptions<Command.Options>({
    name: 'inventory',
    description: 'View your inventory',
})
export class InventoryCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder.setName(this.name).setDescription(this.description),
            {
                idHints: ['1395490255951499466'],
            },
        );
    }

    public override async chatInputRun(
        interaction: Command.ChatInputCommandInteraction,
    ) {
        const user = await this.container.database
            .collection<UserDocument>('hives')
            .findOne({
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
                    .setTitle(`${interaction.user.displayName}'s Inventory`)
                    .setDescription(`You have 🍯 **${user.honey}** honey.`)
                    .addFields(
                        ...Object.entries(user.items).map(
                            ([item, quantity]) => ({
                                name: `${
                                    emojiReplacements[
                                        item as keyof typeof emojiReplacements
                                    ]
                                } ${toTitleCase(item)}`,
                                value: `Quantity: ${quantity}`,
                                inline: true,
                            }),
                        ),
                    )
                    .setColor('#FFD700'),
            ],
        });
    }
}
