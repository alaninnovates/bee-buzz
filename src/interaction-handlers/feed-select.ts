import { ApplyOptions } from '@sapphire/decorators';
import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import { type StringSelectMenuInteraction } from 'discord.js';
import { getCustomIDParts } from '../lib/utils/interaction-utils';
import { UserDocument } from '../lib/types';
import { emojiReplacements, xpPerFruit } from '../lib/data/items';
import { beeData, xpPerLevel } from '../lib/data/bee';

@ApplyOptions<InteractionHandler.Options>({
    name: 'feed-select',
    interactionHandlerType: InteractionHandlerTypes.SelectMenu,
})
export class FeedHandler extends InteractionHandler {
    public override parse(interaction: StringSelectMenuInteraction) {
        const idParts = getCustomIDParts(interaction.customId);
        if (idParts.name !== 'feed-select') {
            return this.none();
        }
        if (idParts.rest[0] !== interaction.user.id) {
            interaction.reply({
                content: "You can't feed bees from someone else's hive!",
                ephemeral: true,
            });
            return this.none();
        }
        return this.some();
    }

    public async run(interaction: StringSelectMenuInteraction) {
        const idParts = getCustomIDParts(interaction.customId);
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
        const bee = user.bees[beeIndex];
        const treatType = idParts.rest[1] as keyof typeof xpPerFruit;
        const quantity = parseInt(idParts.rest[2], 10) || 1;

        const xpGained = xpPerFruit[treatType] * quantity;
        bee.xp += xpGained;
        const levelUp = bee.xp >= xpPerLevel[bee.level];
        if (levelUp) {
            bee.xp = 0;
            bee.level += 1;
        }
        const newBees = [...user.bees];
        newBees[beeIndex] = bee;
        await this.container.database
            .collection<UserDocument>('hives')
            .updateOne(
                { userId: interaction.user.id },
                { $set: { bees: newBees } },
            );
        await interaction.reply({
            embeds: [
                {
                    title: `🐝 Fed ${beeData[bee.type].name}`,
                    description: `You fed your ${beeData[bee.type].name} ${
                        emojiReplacements[treatType]
                    } ${quantity} ${treatType} treats!`,
                    fields: [
                        {
                            name: 'XP Gained',
                            value: `${xpGained} XP`,
                            inline: true,
                        },
                        levelUp
                            ? {
                                  name: 'Level Up!',
                                  value: `Your ${
                                      beeData[bee.type].name
                                  } leveled up to Level ${bee.level}!`,
                                  inline: true,
                              }
                            : {
                                  name: 'Current Level',
                                  value: `Level ${bee.level}`,
                                  inline: true,
                              },
                    ],
                    color: levelUp ? 0x00ff00 : 0xffff00,
                },
            ],
        });
    }
}
