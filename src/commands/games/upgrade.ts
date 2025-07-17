import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { Colors, EmbedBuilder } from 'discord.js';
import { upgradeReqirements } from '../../lib/data/upgrade';
import { emojiReplacements, Item } from '../../lib/data/items';
import { UserDocument } from '../../lib/types';

const compareRequiredItems = (
    required: { [key: string]: number },
    userItems: { [key: string]: number },
): {
    ok: boolean;
    missing: { [key: string]: number };
} => {
    const missing: { [key: string]: number } = {};
    let ok = true;

    for (const item of Object.keys(required)) {
        if (!userItems[item] || userItems[item] < required[item]) {
            ok = false;
            missing[item] = required[item] - (userItems[item] || 0);
        }
    }

    return { ok, missing };
};

@ApplyOptions<Command.Options>({
    name: 'upgrade',
    description: 'Upgrade your game passes',
})
export class UpgradeCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder
                    .setName(this.name)
                    .setDescription(this.description)
                    .addStringOption((option) =>
                        option
                            .setName('game')
                            .setDescription('The game you want to upgrade')
                            .setRequired(true)
                            .addChoices(
                                { name: 'Memory Match', value: 'memory-match' },
                                { name: 'Fight', value: 'fight' },
                            ),
                    ),
            {
                idHints: ['1395419518293114880'],
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
        const game = interaction.options.getString('game', true);
        if (game === 'fight') {
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setDescription("This isn't supported yet :(")
                        .setColor(Colors.Red),
                ],
            });
        }
        const requiredItems = upgradeReqirements[game][user.memoryMatchLevel];
        const userItems = user.items || {};
        const { ok, missing } = compareRequiredItems(requiredItems, userItems);
        if (ok) {
            const decItems = Object.entries(requiredItems).reduce(
                (acc, [item, amount]) => {
                    acc[item] = (userItems[item as Item] || 0) - amount;
                    return acc;
                },
                {} as { [key: string]: number },
            );
            await this.container.database.collection('hives').updateOne(
                { userId: interaction.user.id },
                {
                    $inc: { memoryMatchLevel: 1 },
                    $set: { items: decItems },
                },
            );
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('✅ Upgrade Successful')
                        .setDescription(
                            'You have successfully upgraded your game pass!',
                        )
                        .setColor(Colors.Green),
                ],
            });
        }
        return interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('❌ Upgrade Failed')
                    .setDescription(
                        'You do not have the required items to upgrade your game pass. You need more of the following items:',
                    )
                    .addFields(
                        Object.entries(missing).map(([item, amount]) => ({
                            name: `${emojiReplacements[item as Item]} ${item}`,
                            value: `${amount} more needed`,
                            inline: true,
                        })),
                    )
                    .setColor(Colors.Red),
            ],
        });
    }
}
