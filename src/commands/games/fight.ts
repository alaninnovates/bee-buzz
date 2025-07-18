import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { ApplicationIntegrationType } from 'discord.js';
// import { EmbedBuilder } from 'discord.js';

@ApplyOptions<Command.Options>({
    name: 'fight',
    description: 'Fight bosses to earn rewards',
})
export class FightCommand extends Command {
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
                idHints: ['1395414699704582244'],
            },
        );
    }

    // public override async chatInputRun(
    //     interaction: Command.ChatInputCommandInteraction,
    // ) {}
}
