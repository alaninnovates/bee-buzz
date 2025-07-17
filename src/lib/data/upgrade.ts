import { Item } from './items';

export const upgradeReqirements: {
    [key: string]: Partial<{
        [item in Item | 'honey']: number;
    }>[];
} = {
    fight: [
        // level 1
        {},
        // level 2
        {},
        // level 3
        {},
    ],
    'memory-match': [
        // level 1
        {},
        // level 2
        {
            honey: 400,
            treat: 60,
            blueberry: 30,
            strawberry: 30,
            kiwi: 30,
            pineapple: 30,
            royalJelly: 5,
        },
        // level 3
        {
            honey: 1500,
            treat: 200,
            blueberry: 60,
            strawberry: 60,
            kiwi: 60,
            pineapple: 60,
            royalJelly: 30,
            brick: 10,
        },
    ],
};
