import { beeData } from './data';

type Bees = {
    [K in keyof typeof beeData]?: number;
};

export const calculateForage = (bees: Bees) => {
    let totalPollenPerMinute = 0;

    Object.entries(bees).forEach(([beeId, quantity]) => {
        let baseRate = 0;
        switch (beeId) {
            case 'worker':
                baseRate = 1;
                break;
            case 'speed':
                baseRate = 1.5;
                break;
            default:
                baseRate = 0;
        }

        let pollenFromThisBee = quantity * baseRate;
        if (beeId === 'speed') {
            pollenFromThisBee *= 1.5;
        }
        if (beeId === 'guard') {
            pollenFromThisBee += quantity * 0.05;
        }

        totalPollenPerMinute += pollenFromThisBee;
    });
    return totalPollenPerMinute;
};

export const calculateHoney = (pollenQuantity: number, bees: Bees) => {
    let baseRate = 10;

    let efficiencyBonus = 0;
    Object.entries(bees).forEach(([beeId, quantity]) => {
        if (beeId === 'queen_bee') {
            efficiencyBonus += 0.2;
        }
        if (beeId === 'rainbow_bee') {
            efficiencyBonus += 0.05 * quantity;
        }
    });

    let rawHoney = pollenQuantity / baseRate;
    let totalHoney = rawHoney * (1 + efficiencyBonus);
    return Math.floor(totalHoney);
};
