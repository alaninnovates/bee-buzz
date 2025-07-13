export const minutesBetween = (date1: Date, date2: Date): number => {
    const diff = Math.abs(date2.getTime() - date1.getTime());
    return diff / 60000;
};
