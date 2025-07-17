import { BeeInfo } from '../types';
import { beeData } from './bee';

const basePollenPerMinute = 3;

export const calculateForage = (bees: BeeInfo[]) => {
    const pollenPerMinuteByType: {
        [type: keyof typeof beeData]: number;
    } = {};

    for (const { type, level } of bees) {
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
        const levelMultiplier = 1 + level * 0.05;
        pollenPerMinuteByType[type] =
            (pollenPerMinuteByType[type] || 0) + baseRate * levelMultiplier;
    }
    for (const { type } of bees) {
        switch (type) {
            case 'guard':
                pollenPerMinuteByType['worker'] =
                    (pollenPerMinuteByType['worker'] || 0) * 1.05;
                break;
            case 'speed':
                for (const t of Object.keys(pollenPerMinuteByType)) {
                    pollenPerMinuteByType[t as keyof typeof beeData] =
                        (pollenPerMinuteByType[t as keyof typeof beeData] ||
                            0) * 1.3;
                }
                break;
        }
    }

    return (
        Object.values(pollenPerMinuteByType).reduce((total, rate) => {
            return total + (rate || 0);
        }, 0) + basePollenPerMinute
    );
};

export const calculateHoney = (pollenQuantity: number, bees: BeeInfo[]) => {
    const baseHoney = Math.floor(pollenQuantity / 10);
    let honey = baseHoney;
    let specialNectarChance = 0;
    for (const bee of bees) {
        if (bee.type === 'rainbow') {
            specialNectarChance += 0.1;
        }
        if (bee.type === 'queen') {
            honey *= 1.1;
        }
    }
    specialNectarChance = Math.min(specialNectarChance, 0.5);
    const specialNectar = Math.random() < specialNectarChance;
    return specialNectar ? honey * specialNectarChance * 2 : honey;
};
