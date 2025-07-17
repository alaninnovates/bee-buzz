export const defaultHiveLimit = 10;
export const maxHiveLimit = 50;

export const calculateExpandHiveCost = (currentSize: number): number => {
    return Math.floor(
        30 * Math.pow(1.044, currentSize - defaultHiveLimit) ** 1.8,
    );
};
