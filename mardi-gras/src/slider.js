import slideFunction from './base-slider.js';

const script = document.querySelector('script#sliderScript');

let intervals;
if (script) {
    intervals = script.getAttribute('data-intervals');
}
const sliderContainer = document.querySelector('.slider-container');
const startSlider = slideFunction(sliderContainer,null,intervals);
startSlider();

