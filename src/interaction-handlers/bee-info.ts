import { ApplyOptions } from '@sapphire/decorators';
import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Colors,
    EmbedBuilder,
    type StringSelectMenuInteraction,
} from 'discord.js';
import { getCustomIDParts } from '../lib/utils/interaction-utils';
import { beeData } from '../lib/data/data';

export const getBeeDataEmbed = (bee: keyof typeof beeData) => {
    const data = beeData[bee];

    return new EmbedBuilder()
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
        .setColor(Colors.Yellow);
};

@ApplyOptions<InteractionHandler.Options>({
    name: 'bee-info',
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class HelpSelectHandler extends InteractionHandler {
    public override parse(interaction: StringSelectMenuInteraction) {
        const idParts = getCustomIDParts(interaction.customId);
        if (idParts.name !== 'bee-info') {
            return this.none();
        }
        return this.some();
    }

    public async run(interaction: StringSelectMenuInteraction) {
        const idParts = getCustomIDParts(interaction.customId);
        const index = parseInt(idParts.rest[0], 10);
        await interaction.update({
            embeds: [getBeeDataEmbed(Object.keys(beeData)[index])],
            components: [
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('⬅️')
                        .setCustomId(`bee-info:${index - 1}`)
                        .setDisabled(index === 0),
                    new ButtonBuilder()
                        .setStyle(ButtonStyle.Primary)
                        .setEmoji('➡️')
                        .setCustomId(`bee-info:${index + 1}`)
                        .setDisabled(index === Object.keys(beeData).length - 1),
                ),
            ],
        });
    }
}
