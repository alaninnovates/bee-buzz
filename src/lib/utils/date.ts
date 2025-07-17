export const minutesBetween = (date1: Date, date2: Date): number => {
    const diff = Math.abs(date2.getTime() - date1.getTime());
    return diff / 60000;
};

export const secondsBetween = (date1: Date, date2: Date): number => {
    const diff = Math.abs(date2.getTime() - date1.getTime());
    return diff / 1000;
};

export const humanReadableTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const parts = [];
    if (hours > 0) parts.push(`${hours}h`);
    if (minutes > 0) parts.push(`${minutes}m`);
    if (secs > 0 || parts.length === 0) parts.push(`${Math.floor(secs)}s`);
    return parts.join(' ');
};
