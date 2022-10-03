export default window => {
    const document = window.document
    const table_body = document.getElementById('forecast_data')
    const listeners = []

    const listen = l => listeners.push(l)

    const displayError = e => {
        const msg_board = document.getElementById('error_messages')
        msg_board.innerText = e
    }

    const addWeather = p => {
        const tr = table_body.appendChild(document.createElement('tr'))
        tr.insertCell().appendChild(document.createTextNode(p.getType()))
        tr.insertCell().appendChild(document.createTextNode(p.getTime()))
        tr.insertCell().appendChild(document.createTextNode(p.getPlace()))
        tr.insertCell().appendChild(document.createTextNode(p.getFromValue()))
        tr.insertCell().appendChild(document.createTextNode(p.getToValue()))
        tr.insertCell().appendChild(document.createTextNode(p.getUnit()))


        if (p.getPrecipTypes()) {
            tr.insertCell().appendChild(document.createTextNode(p.getPrecipTypes()))
        } else {
            tr.insertCell()
        }

        if (p.getDirections()) {
            tr.insertCell().appendChild(document.createTextNode(p.getDirections()))
        } else {
            tr.insertCell()
        }
    }

    const update = model => {
        while (table_body.firstChild)
            table_body.removeChild(table_body.firstChild)
        model.forecastData().forEach(addWeather)
    }

    const prompt = window.prompt.bind(window)

    return { listen, displayError, prompt, update }
}
