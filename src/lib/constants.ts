export const defaultHiveLimit = 9;
export const maxHiveLimit = 25;

export const calculateExpandHiveCost = (currentSize: number): number => {
    return Math.floor(
        30 * Math.pow(1.044, currentSize - defaultHiveLimit) ** 1.8,
    );
};
