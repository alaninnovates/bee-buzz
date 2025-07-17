import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { UserDocument } from '../../lib/types';
import { getEvictResponse } from '../../interaction-handlers/evict-select';

@ApplyOptions<Command.Options>({
    name: 'evict',
    description: 'Remove a bee from your hive',
})
export class EvictCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder.setName(this.name).setDescription(this.description),
            {
                idHints: ['1395390401883410585'],
            },
        );
    }

    public override async chatInputRun(
        interaction: Command.ChatInputCommandInteraction,
    ) {
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
        await interaction.reply(getEvictResponse(user));
    }
}
