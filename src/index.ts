// add styles
import './style.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import init from './init';
import app from './app';

const { translation } = init();

app(translation);
