
export default function covertkelvinTpCelsius(tempInKelvin: number) {
    const tempInCelsius = tempInKelvin - 273.15;
    return Math.floor(tempInCelsius);
}

