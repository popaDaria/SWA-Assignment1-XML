import {getMinTemperature, getMaxTemperature, getTotalPrecipitation, getAverageWindSpeed} from './model.js'

export default window => {
    const document = window.document
    const weather_table_body = document.getElementById('weather_data')
    const functions_table_body = document.getElementById('functions_data')

    const displayError = e => {
        const msg_board = document.getElementById('error_messages')
        msg_board.innerText = e
    }

    const addWeather = p => {
        const tr = weather_table_body.appendChild(document.createElement('tr'))
        tr.insertCell().appendChild(document.createTextNode(p.getType()))
        tr.insertCell().appendChild(document.createTextNode(p.getTime()))
        tr.insertCell().appendChild(document.createTextNode(p.getPlace()))
        tr.insertCell().appendChild(document.createTextNode(p.getValue()))
        tr.insertCell().appendChild(document.createTextNode(p.getUnit()))
        if (p.getPrecipType()) {
            tr.insertCell().appendChild(document.createTextNode(p.getPrecipType()))
        } else {
            tr.insertCell()
        }

        if (p.getDirection()) {
            tr.insertCell().appendChild(document.createTextNode(p.getDirection()))
        } else {
            tr.insertCell()
        }

    }
    const addLastDay = p => {
        const functions_tr = functions_table_body.appendChild(document.createElement('tr'))
        functions_tr.insertCell().appendChild(document.createTextNode(getMinTemperature(p)))
        functions_tr.insertCell().appendChild(document.createTextNode(getMaxTemperature(p)))
        functions_tr.insertCell().appendChild(document.createTextNode(getTotalPrecipitation(p)))
        functions_tr.insertCell().appendChild(document.createTextNode(getAverageWindSpeed(p)))
    }

    const update = model => {
        while (weather_table_body.firstChild) weather_table_body.removeChild(weather_table_body.firstChild)
        while (functions_table_body.firstChild) functions_table_body.removeChild(functions_table_body.firstChild)
        model.latestWeatherData().forEach(addWeather)
        addLastDay(model.weatherData())
    }

    const prompt = window.prompt.bind(window)

    return { displayError, prompt, update }
}
