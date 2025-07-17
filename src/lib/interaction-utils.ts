export const getCustomIDParts = (
    customId: string,
): {
    name: string;
    rest: string[];
} => {
    const split = customId.split(':');
    return {
        name: split[0],
        rest: split.slice(1),
    };
};
