import { ApplyOptions } from '@sapphire/decorators';
import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import type { StringSelectMenuInteraction } from 'discord.js';
import { getCustomIDParts } from '../lib/utils/interaction-utils';
import { beeData } from '../lib/data/data';

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
        const user = await this.container.database.collection('hives').findOne({
            userId: interaction.user.id,
        });
        if (!user) {
            await interaction.reply({
                content:
                    "You don't have a hive yet! Use `/start-hive` to create one.",
            });
            return;
        }
        const bee = interaction.values[0];
        if (!user.bees[bee]) {
            await interaction.reply({
                content: "You don't have that bee in your hive!",
            });
            return;
        }
        user.bees[bee]--;
        if (user.bees[bee] <= 0) {
            delete user.bees[bee];
        }
        await this.container.database
            .collection('hives')
            .updateOne(
                { userId: interaction.user.id },
                { $set: { bees: user.bees } },
            );
        await interaction.reply({
            content: `You evicted a ${beeData[bee].name} from your hive!`,
        });
    }
}
