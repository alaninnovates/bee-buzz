import { ApplyOptions } from '@sapphire/decorators';
import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import {
    ActionRowBuilder,
    EmbedBuilder,
    StringSelectMenuBuilder,
    type StringSelectMenuInteraction,
} from 'discord.js';
import { getCustomIDParts } from '../lib/utils/interaction-utils';
import { beeData } from '../lib/data/bee';
import { UserDocument } from '../lib/types';
import { renderBeeText } from '../lib/render-hive';

export const getEvictResponse = (user: UserDocument) => {
    return {
        embeds: [
            new EmbedBuilder()
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
                .setColor('#FFD700'),
        ],
        components: [
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId(`evict-select:${user.userId}`)
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
    };
};

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
        const newUser = (await this.container.database
            .collection<UserDocument>('hives')
            .findOneAndUpdate(
                { userId: interaction.user.id },
                { $set: { bees: newBees } },
                {
                    returnDocument: 'after',
                },
            )) as UserDocument;
        await interaction.update(getEvictResponse(newUser));
        await interaction.followUp({
            content: `You evicted a ${beeData[removed.type].name} (Level: ${
                removed.level
            }, XP: ${removed.xp}) from your hive!`,
        });
    }
}
