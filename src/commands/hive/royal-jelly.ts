import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationIntegrationType } from 'discord.js';
// import { EmbedBuilder } from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'royal-jelly',
    description: 'Use royal jelly to transform your bees',
})
export class RoyalJellyCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .setIntegrationTypes(
                        ApplicationIntegrationType.GuildInstall,
                    ),
            {
                idHints: ['1395414614149304371'],
            },
        );
    }

    // public override async chatInputRun(
    //     interaction: Command.ChatInputCommandInteraction,
    // ) {}
}
