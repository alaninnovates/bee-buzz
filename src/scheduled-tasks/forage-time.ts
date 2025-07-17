import { ScheduledTask } from '@sapphire/plugin-scheduled-tasks';
import { ForageDocument } from '../lib/types';
import { humanReadableTime, secondsBetween } from '../lib/utils/date';
import { calculateMaxForageTime } from '../lib/data/forage';
import { EmbedBuilder, TextChannel } from 'discord.js';

export class ForageTimeTask extends ScheduledTask {
    public constructor(
        context: ScheduledTask.LoaderContext,
        options: ScheduledTask.Options,
    ) {
        super(context, {
            ...options,
            interval: 20_000,
        });
    }

    public async run() {
        const allForages = await this.container.database
            .collection<ForageDocument>('forage')
            .find({ notified: false })
            .toArray();
        const now = new Date();
        for (const forage of allForages) {
            const elapsedSeconds = secondsBetween(forage.startedAt, now);
            const maxForageTime = calculateMaxForageTime(forage.bees);
            if (elapsedSeconds >= maxForageTime) {
                const channel = (await this.container.client.channels.fetch(
                    forage.channelId,
                )) as TextChannel | null;
                if (!channel) {
                    continue;
                }
                try {
                    await channel.send({
                        content: `<@${forage.userId}>`,
                        embeds: [
                            new EmbedBuilder()
                                .setTitle('🕒 Foraging Complete')
                                .setDescription(
                                    `Your bees have finished foraging! Use \`/harvest\` to collect the pollen.`,
                                )
                                .setFooter({
                                    text: `Forage completed in ${humanReadableTime(
                                        elapsedSeconds,
                                    )}.`,
                                })
                                .setColor('#FFD700'),
                        ],
                    });
                    await this.container.database
                        .collection('forage')
                        .updateOne(
                            { userId: forage.userId },
                            { $set: { notified: true } },
                        );
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
}

declare module '@sapphire/plugin-scheduled-tasks' {
    interface ScheduledTasks {
        interval: never;
    }
}
