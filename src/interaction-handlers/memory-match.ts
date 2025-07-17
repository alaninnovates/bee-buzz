import { ApplyOptions } from '@sapphire/decorators';
import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import { ButtonStyle, type StringSelectMenuInteraction } from 'discord.js';
import { getCustomIDParts } from '../lib/interaction-utils';
import { emojiReplacements } from '../lib/caches/memory-match';

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

        const mmData = this.container.caches.memoryMatch.get(
            interaction.user.id,
        );

        const quantityActive = board
            .flat()
            .filter((cell) => cell.active && !cell.matched).length;
        if (quantityActive === 2) {
            mmData.triesRemaining--;
            this.container.caches.memoryMatch.set(interaction.user.id, mmData);
            const newEmbed = interaction.message.embeds[0].toJSON();
            newEmbed.footer!.text = `Tries Remaining: ${mmData.triesRemaining}`;

            const activeCells = board
                .flat()
                .filter((cell) => cell.active && !cell.matched);
            await interaction.update({
                embeds: [newEmbed],
                components: this.container.caches.memoryMatch
                    .getBoardComponents(interaction.user.id)
                    .map((row, i) =>
                        row.setComponents(
                            row.components.map((component, j) => {
                                component.setDisabled(true);
                                if (
                                    !board[i][j].matched &&
                                    board[i][j].active &&
                                    activeCells[0].item !== activeCells[1].item
                                ) {
                                    component.setStyle(ButtonStyle.Danger);
                                }
                                return component;
                            }),
                        ),
                    ),
            });
            if (activeCells[0].item === activeCells[1].item) {
                activeCells.forEach((cell) => {
                    cell.matched = true;
                    cell.active = false;
                });
            } else {
                activeCells.forEach((cell) => (cell.active = false));
            }
            this.container.caches.memoryMatch.setBoard(
                interaction.user.id,
                board,
            );

            if (mmData.triesRemaining <= 0) {
                await interaction.editReply({
                    embeds: [newEmbed],
                    components: this.container.caches.memoryMatch
                        .getBoardComponents(interaction.user.id)
                        .map((row, i) =>
                            row.setComponents(
                                row.components.map((component, j) => {
                                    component.setEmoji(
                                        emojiReplacements[board[i][j].item],
                                    );
                                    component.setDisabled(true);
                                    return component;
                                }),
                            ),
                        ),
                });
                this.container.caches.memoryMatch.remove(interaction.user.id);
            } else {
                setTimeout(() => {
                    interaction.editReply({
                        embeds: [newEmbed],
                        components:
                            this.container.caches.memoryMatch.getBoardComponents(
                                interaction.user.id,
                            ),
                    });
                }, 1000);
            }
            return;
        }
        await interaction.update({
            components: this.container.caches.memoryMatch.getBoardComponents(
                interaction.user.id,
            ),
        });
    }
}
