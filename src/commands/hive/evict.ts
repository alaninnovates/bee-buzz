import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import {
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
} from 'discord.js';
import { beeData } from '../../lib/data/data';
import { UserDocument } from '../../lib/types';
import { renderBeeText } from '../../lib/render-hive';

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
        const embed = new EmbedBuilder()
            .setTitle('🚫 Evict a Bee')
            .setDescription('Select what bee to evict.')
            .addFields([
                {
                    name: 'Bees',
                    value: renderBeeText(user.bees),
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
                            user.bees.map((bee, index) => ({
                                label: beeData[bee.type].name,
                                value: index.toString(),
                                description: `Evict ${
                                    beeData[bee.type].name
                                } (Level: ${bee.level}, XP: ${bee.xp})`,
                            })),
                        ),
                ),
            ],
        });
    }
}
