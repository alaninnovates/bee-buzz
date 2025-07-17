import { ApplyOptions } from '@sapphire/decorators';
import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import type { StringSelectMenuInteraction } from 'discord.js';
import { getCustomIDParts } from '../lib/utils/interaction-utils';
import { beeData } from '../lib/data/data';
import { UserDocument } from '../lib/types';

@ApplyOptions<InteractionHandler.Options>({
    name: 'evict-select',
    interactionHandlerType: InteractionHandlerTypes.SelectMenu,
})
export class HelpSelectHandler extends InteractionHandler {
    public override parse(interaction: StringSelectMenuInteraction) {
        const idParts = getCustomIDParts(interaction.customId);
        if (idParts.name !== 'evict-select') {
            return this.none();
        }
        if (idParts.rest[0] !== interaction.user.id) {
            interaction.reply({
                content: "You can't evict bees from someone else's hive!",
                ephemeral: true,
            });
            return this.none();
        }
        return this.some();
    }

    public async run(interaction: StringSelectMenuInteraction) {
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
        const beeIndex = parseInt(interaction.values[0], 10);
        if (isNaN(beeIndex) || beeIndex < 0 || beeIndex >= user.bees.length) {
            await interaction.reply({
                content: "You don't have that bee in your hive!",
            });
            return;
        }
        const newBees = [...user.bees];
        const removed = newBees.splice(beeIndex, 1)[0];
        await this.container.database
            .collection('hives')
            .updateOne(
                { userId: interaction.user.id },
                { $set: { bees: newBees } },
            );
        await interaction.reply({
            content: `You evicted a ${beeData[removed.type].name} (Level: ${
                removed.level
            }, XP: ${removed.xp}) from your hive!`,
        });
    }
}
