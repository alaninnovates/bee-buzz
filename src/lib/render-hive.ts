import { beeData } from './data/bee';
import { BeeInfo } from './types';

export const renderBeeText = (bees: BeeInfo[]) => {
    const rows: string[] = [];
    let currentRow = '';
    bees.forEach((bee, index) => {
        const beeDataEntry = beeData[bee.type];
        if (!beeDataEntry) return;

        const beeText = `${beeDataEntry.emoji} ${beeDataEntry.name} (Lvl ${bee.level})`;
        currentRow += beeText;

        if ((index + 1) % 3 === 0 || index === bees.length - 1) {
            rows.push(currentRow);
            currentRow = '';
        } else {
            currentRow += ' | ';
        }
    });
    return rows.join('\n');
};
