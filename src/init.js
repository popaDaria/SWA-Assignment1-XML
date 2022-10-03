import model from './model.js'
import { WeatherMeasurement } from './model.js'
import view from './view.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import {show} from 'js-snackbar';
require('../node_modules/js-snackbar/snackbar.css');

function display(theView, weather = []) {
    const theModel = model(weather)
    theView.update(theModel)
}

async function init() {
    getData('Horsens');
    hideDirection();
    hidePrecipitation();
}

async function getData(url){
    const theView = view(window)
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'http://localhost:8080/data/'+url)
    xhr.onload = () => {
        const body = xhr.responseText
        const weather = JSON.parse(body)
        display(theView, weather)
        theView.displayError('')
    }
    xhr.onerror = () => {
        theView.displayError(xhr.responseText)
    }
    xhr.send()
}

var form = document.getElementById("addWeatherData");
function handleForm(event) { event.preventDefault(); }
form.addEventListener('submit', handleForm);

const formButton = document.getElementById('formButton');
formButton.addEventListener('click', postData)

async function postData() {
    const theView = view(window)
    const type = typeSelect.value;
    const city = document.getElementById('city').value;
    let precipitationType;
    let windDirection;
    let unit;
    if (type === 'precipitation') {
        precipitationType = document.getElementById('precipitation-type').value;
        unit = 'mm'
    }
    if (type === 'wind speed') {
        windDirection = document.getElementById('wind-direction').value;
        unit = 'm/s'
    }
    if (type === 'temperature') {
        unit = 'C'
    }
    if (type === 'cloud coverage') {
        unit = '%'
    }
    const value = document.getElementById('value').value;
    if (value === '')
    {
        show({text: 'Value needs to be entered'});
        return;
    }
    const weather = WeatherMeasurement(type, unit, new Date(), city, value, precipitationType, windDirection)
    let jsonString = '';
    if (windDirection) {
        jsonString = JSON.stringify({ value: weather.getValue(), direction: weather.getDirection(), type: weather.getType(), unit: weather.getUnit(), time: weather.getTime(), place: weather.getPlace() })
    } else if (precipitationType) {
        jsonString = JSON.stringify({ value: weather.getValue(), precipitation_type: weather.getPrecipType(), type: weather.getType(), unit: weather.getUnit(), time: weather.getTime(), place: weather.getPlace() })
    } else {
        jsonString = JSON.stringify({ value: weather.getValue(), type: weather.getType(), unit: weather.getUnit(), time: weather.getTime(), place: weather.getPlace() })
    }

    const xhr = new XMLHttpRequest()
    xhr.open('POST', 'http://localhost:8080/data/')
    xhr.onload = () => {
        show({text: 'Measurement added'});
        getData(radioSelection.value)
    }
    xhr.onerror = () => {
        theView.displayError(xhr.responseText)
    }
    xhr.setRequestHeader("Content-type", "application/json")
    xhr.setRequestHeader("Accept", "application/json")
    xhr.send(jsonString)
}

var radioSelection = document.placeSelection.placeRadio;
for (var i = 0; i < radioSelection.length; i++) {
    radioSelection[i].addEventListener('change', function () {
        getData(this.value)
    });
}

const typeSelect = document.getElementById('type');

typeSelect.addEventListener('change', () => {
    if (typeSelect.value === 'temperature' || typeSelect.value === 'cloud coverage') {
        hidePrecipitation();
        hideDirection();
    } else if (typeSelect.value === 'wind speed') {
        showDirection();
        hidePrecipitation();
    } else {
        showPrecipitation();
        hideDirection();
    }
});

function hidePrecipitation() {
    const prec = document.getElementById('precipitation-type');
    prec.style.display = 'none';
}
function showPrecipitation() {
    const prec = document.getElementById('precipitation-type');
    prec.style.display = 'initial';
}
function hideDirection() {
    const dir = document.getElementById('wind-direction');
    dir.style.display = 'none';
}
function showDirection() {
    const dir = document.getElementById('wind-direction');
    dir.style.display = 'initial';
}

init()
