import { ApplyOptions } from '@sapphire/decorators';
import {
    InteractionHandler,
    InteractionHandlerTypes,
} from '@sapphire/framework';
import type { StringSelectMenuInteraction } from 'discord.js';
import { pages } from '../lib/help/pages';

@ApplyOptions<InteractionHandler.Options>({
    name: 'help-select',
    interactionHandlerType: InteractionHandlerTypes.SelectMenu,
})
export class HelpSelectHandler extends InteractionHandler {
    public override parse(interaction: StringSelectMenuInteraction) {
        if (interaction.customId !== 'help-select') return this.none();
        return this.some();
    }

    public async run(interaction: StringSelectMenuInteraction) {
        await interaction.update({
            embeds: [
                pages[interaction.values[0] as keyof typeof pages] ||
                    pages.home,
            ],
        });
    }
}
