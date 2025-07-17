import { BeeInfo } from '../types';
import { beeData, rarityTreatData } from './bee';
import { Item } from './items';

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

export const calculateMaxForageTime = (bees: BeeInfo[]) => {
    const pollenPerMinute = calculateForage(bees);
    const maxForageTime = Math.floor((60 * 60) / pollenPerMinute);
    return Math.max(maxForageTime, 60);
};

const treats: Item[] = [
    'treat',
    'blueberry',
    'pineapple',
    'strawberry',
    'kiwi',
];

export const calculateTreatsEarned = (
    elapsedTimeSeconds: number,
    bees: BeeInfo[],
) => {
    const treatsEarned: Partial<{
        [key in Item]: number;
    }> = {};
    for (const bee of bees) {
        const rand = Math.random();
        const data = rarityTreatData[beeData[bee.type].rarity];
        if (rand < data.chance) {
            const treatIndex = Math.floor(Math.random() * treats.length);
            const treat = treats[treatIndex];
            treatsEarned[treat] =
                (treatsEarned[treat] || 0) +
                Math.ceil(elapsedTimeSeconds / (60 * 5)) * data.multiplier;
        }
    }
    return treatsEarned;
};
