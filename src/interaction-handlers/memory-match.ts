import { ApplyOptions } from '@sapphire/decorators';
import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import type { StringSelectMenuInteraction } from 'discord.js';
import { getCustomIDParts } from '../lib/interaction-utils';

@ApplyOptions<InteractionHandler.Options>({
    name: 'memory-match',
    interactionHandlerType: InteractionHandlerTypes.Button,
})
export class HelpSelectHandler extends InteractionHandler {
    public override parse(interaction: StringSelectMenuInteraction) {
        const idParts = getCustomIDParts(interaction.customId);
        if (idParts.name !== this.name) {
            return this.none();
        }
        if (idParts.rest[0] !== interaction.user.id) {
            interaction.reply({
                content: "This isn't your memory match!",
                ephemeral: true,
            });
            return this.none();
        }
        return this.some();
    }

    public async run(interaction: StringSelectMenuInteraction) {
        const idParts = getCustomIDParts(interaction.customId);
        const xCoord = parseInt(idParts.rest[1], 10);
        const yCoord = parseInt(idParts.rest[2], 10);
        const board = this.container.caches.memoryMatch.getBoard(
            interaction.user.id,
        );
        board[xCoord][yCoord].active = true;
        this.container.caches.memoryMatch.setBoard(interaction.user.id, board);
        await interaction.update({
            components: this.container.caches.memoryMatch.getBoardComponents(
                interaction.user.id,
            ),
        });
    }
}
