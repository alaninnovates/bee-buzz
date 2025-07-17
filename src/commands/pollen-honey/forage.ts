import { ApplyOptions } from '@sapphire/decorators';
import { Command } from '@sapphire/framework';
import { EmbedBuilder } from 'discord.js';
import { calculateForage } from '../../lib/data/forage';
import { beeData } from '../../lib/data/data';

@ApplyOptions<Command.Options>({
    name: 'forage',
    description: 'Collect pollen',
})
export class ForageCommand extends Command {
    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand(
            (builder) =>
                builder.setName(this.name).setDescription(this.description),
            {
                idHints: ['1393946832018870364'],
            },
        );
    }

    public override async chatInputRun(
        interaction: Command.ChatInputCommandInteraction,
    ) {
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
        const forage = await this.container.database
            .collection('forage')
            .findOne({
                userId: interaction.user.id,
            });
        if (forage) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('🚫 Foraging Already In Progress')
                        .setDescription(
                            'Your bees are already out foraging! Harvest pollen with `/harvest` before starting a new forage.',
                        )
                        .setColor('#FF0000'),
                ],
            });
            return;
        }
        await this.container.database.collection('forage').insertOne({
            userId: interaction.user.id,
            bees: user.bees,
            startedAt: new Date(),
        });
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('🍃 Foraging Started!')
                    .setDescription(
                        `${user.bees.worker} Worker Bees sent to the wildflower fields. To finish foraging, use the \`/harvest\` command.`,
                    )
                    .addFields([
                        {
                            name: 'Bees Foraging',
                            value: Object.keys(user.bees)
                                .map((bee) => {
                                    const data =
                                        beeData[bee as keyof typeof beeData];
                                    return `${data.emoji} ${user.bees[bee]} ${
                                        data.name
                                    }${user.bees[bee] > 1 ? 's' : ''}`;
                                })
                                .join(' | '),
                        },
                        {
                            name: 'Est Pollen Per Minute',
                            value: calculateForage(user.bees).toString(),
                        },
                    ])
                    .setFooter({
                        text: 'Tip: Upgrade your bees to forage faster!',
                    })
                    .setColor('#FFD700'),
            ],
        });
    }
}
