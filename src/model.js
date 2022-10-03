const model = (weather) => {
    const weatherData = () => weather
        .map(w => WeatherMeasurement(w.type, w.unit, w.time, w.place, w.value, w.precipitation_type, w.direction))

    const forecastData = () => weather
        .map(w => ForecastMeasurement(w.type, w.unit, w.time, w.place, w.from, w.to, w.precipitation_types, w.directions))

    const latestWeatherData = () => {
        let measurements = weather.map(w => WeatherMeasurement(w.type, w.unit, w.time, w.place, w.value, w.precipitation_type, w.direction));
        let types = ['temperature', 'precipitation', 'wind speed', 'cloud coverage'];
        let latestMeasurements = [];
        for (let j = 0; j < types.length; j++) {
            for (let i = measurements.length - 1; i >= 0; i--) {
                if (measurements[i].getType() === types[j]) {
                    latestMeasurements.push(measurements[i]);
                    break;
                }
            }
        }
        return latestMeasurements;
    }
    const addWeatherMeasurement = w => model(weather.concat(w))

    return { weatherData, forecastData, latestWeatherData, addWeatherMeasurement }
}

export default model


function SimpleMeasurement(type, unit, time, place) {
    function getTime() { return time }
    function getPlace() { return place }
    function getType() { return type }
    function getUnit() { return unit }

    return { getTime, getPlace, getType, getUnit }
}

export function WeatherMeasurement(type, unit, time, place, value, precipitation_type, direction) {
    let baseMeasurement = SimpleMeasurement(type, unit, time, place)
    function getValue() { return value }
    function getPrecipType() { return precipitation_type }
    function getDirection() { return direction }

    return { ...baseMeasurement, getValue, getPrecipType, getDirection }
}

function ForecastMeasurement(type, unit, time, place, from, to, precipitation_types, directions) {
    let baseMeasurement = SimpleMeasurement(type, unit, time, place)
    function getFromValue() { return from }
    function getToValue() { return to }
    function getPrecipTypes() { return precipitation_types }
    function getDirections() { return directions }

    return { ...baseMeasurement, getFromValue, getToValue, getPrecipTypes, getDirections }
}

export function getMinTemperature(weather) {
    let min = weather[0].getValue();
    for (let i = 0; i < weather.length; i++) {
        const newDate = new Date(weather[i].getTime())

        if (weather[i].getType() === "temperature" && isDateYesterday(newDate.getUTCDate()) && weather[i].getValue() < min) {
            min = weather[i].getValue();
        }
    }
    return min;
}

export function getMaxTemperature(weather) {
    let max = weather[0].getValue();
    for (let i = 0; i < weather.length; i++) {
        const newDate = new Date(weather[i].getTime())
        if (weather[i].getType() === "temperature" && isDateYesterday(newDate.getUTCDate()) && weather[i].getValue() > max) {
            max = weather[i].getValue();
        }
    }
    return max;
}

export function getTotalPrecipitation(weather) {
    let sum = 0;
    for (let i = 0; i < weather.length; i++) {
        const newDate = new Date(weather[i].getTime())
        if (weather[i].getType() === "precipitation" && isDateYesterday(newDate.getUTCDate())) {
            sum += weather[i].getValue();
        }
    }
    return Math.round((sum + Number.EPSILON) * 100) / 100
}

export function getAverageWindSpeed(weather) {
    let sum = 0;
    let count = 0
    for (let i = 0; i < weather.length; i++) {
        const newDate = new Date(weather[i].getTime())

        if (weather[i].getType() === "wind speed" && isDateYesterday(newDate.getUTCDate())) {
            sum += weather[i].getValue();
            count++;
        }
    }
    return Math.round((sum / count + Number.EPSILON) * 100) / 100
}

function isDateYesterday(dateToCheck) {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    return dateToCheck === yesterday.getUTCDate();
}