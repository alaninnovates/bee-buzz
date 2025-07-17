import { Bee, rarityCost, beeData, breedData } from './data';

export const breedBees = (bee1: Bee, bee2: Bee): Bee | null => {
    const pairKey = [bee1, bee2].sort().join('+');
    const outcomes = breedData[pairKey as keyof typeof breedData];
    if (!outcomes) {
        return null;
    }
    const roll = Math.random();
    let cumulativeChance = 0;

    for (const outcome of outcomes) {
        cumulativeChance += outcome.chance;
        if (roll <= cumulativeChance) {
            return outcome.result;
        }
    }
    return outcomes[outcomes.length - 1].result;
};

export const calculateBreedCost = (bee1: Bee, bee2: Bee): number => {
    const rarity1 = beeData[bee1].rarity;
    const rarity2 = beeData[bee2].rarity;
    const cost1 = rarityCost[rarity1];
    const cost2 = rarityCost[rarity2];
    return Math.max(cost1, cost2) * 2;
};
