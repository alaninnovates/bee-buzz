import { beeData } from './data';

export const calculateForage = (bees: {
    [K in keyof typeof beeData]?: number;
}) => {
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
