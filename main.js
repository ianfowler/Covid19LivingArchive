import React from 'react';
import ReactDOM from 'react-dom';
import App from '../src/App';

window.renderApp = function() {
    const div = document.createElement('div');
    ReactDOM.render(<App/>, div);
    console.log("Holy cow did it work?")
}
