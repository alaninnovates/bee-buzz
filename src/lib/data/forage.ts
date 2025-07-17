import { BeeInfo } from '../types';

export const calculateForage = (bees: BeeInfo[]) => {
    let totalPollenPerMinute = 0;

    bees.forEach((bee) => {
        const { type, level } = bee;
        let baseRate = 0;

        switch (type) {
            case 'worker':
                baseRate = 1;
                break;
            case 'speed':
                baseRate = 1.5;
                break;
            default:
                baseRate = 0;
        }

        const levelMultiplier = 1 + level * 0.1;
        let pollenFromThisBee = baseRate * levelMultiplier;

        if (type === 'speed') {
            pollenFromThisBee *= 1.5;
        }
        if (type === 'guard') {
            pollenFromThisBee += 0.05;
        }

        totalPollenPerMinute += pollenFromThisBee;
    });

    return totalPollenPerMinute;
};

export const calculateHoney = (pollenQuantity: number, bees: BeeInfo[]) => {
    let baseRate = 10;

    let efficiencyBonus = 0;
    bees.forEach((bee) => {
        const { type } = bee;
        if (type === 'queen') {
            efficiencyBonus += 0.2;
        }
        if (type === 'rainbow') {
            efficiencyBonus += 0.05;
        }
    });

    let rawHoney = pollenQuantity / baseRate;
    let totalHoney = rawHoney * (1 + efficiencyBonus);
    return Math.floor(totalHoney);
};
