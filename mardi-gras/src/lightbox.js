import initSlider from './base-slider.js';


function setImgOnClick(images, box, startSliderCallback) {

    images.forEach((image,index) => {
        image.onclick = () => {
            box.style.display = 'flex';
            startSliderCallback(index);
        }
    })
}

function setKeyPressListener(box) {
    document.body.onkeypress = (event) => {
        if (box.style.display != 'none') {
            if (event.keyCode == 27) {
                hideBox(box);
            }
        }
    }
}

function hideBox(box) {
    box.style.display = 'none';
}


function startLightbox(box, sliderContainer) {
    const images = document.querySelectorAll('.small-img-gallery>img');
    const $progress = sliderContainer.querySelector('.progress');
    const close = sliderContainer.querySelector('.close');

    function progressCallback(itemIndex, length) {
        $progress.innerHTML = itemIndex + "/" + length
    }

    const startSlider = initSlider(sliderContainer,progressCallback); 

    setImgOnClick(images, box , startSlider)
    setKeyPressListener(box);
    close.onclick = () => hideBox(box);
}

const box = document.querySelector('.box');
const sliderContainer = box.querySelector('.slider-gallery');
box.onclick = (event) => {
    if (event.target == box) hideBox(box);
}

startLightbox(box, sliderContainer)
