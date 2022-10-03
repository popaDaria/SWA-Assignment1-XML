import model from '../model.js'
import view from './view.js'
import 'bootstrap/dist/css/bootstrap.min.css';

function display(theView, forecast = []) {
    const theModel = model(forecast)
    theView.update(theModel)
}

async function init() {
    getData('');
}

async function getData(url){
    const theView = view(window)
    const xhr = new XMLHttpRequest()
    xhr.open('GET', 'http://localhost:8080/forecast/'+url)
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

var radioSelection = document.placeSelection.placeRadio;
var prev = null;
for (var i = 0; i < radioSelection.length; i++) {
    radioSelection[i].addEventListener('change', function () {
        if (this !== prev) {
            prev = this;
        }
        getData(this.value)
    });
}

init()
