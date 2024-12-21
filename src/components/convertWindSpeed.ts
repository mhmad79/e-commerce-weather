export function converWindSpeed(spedInMetersPerSecond: number): string {
    const speedInKilometersPerHour = spedInMetersPerSecond *3.6;
    return `${speedInKilometersPerHour.toFixed(0)}kh/h`
}