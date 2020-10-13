const Right = "slide-right";
const Left = "slide-left";


function getSliderWidth(slider) {
    return slider.clientWidth == document.body.clientWidth ? 
                    innerWidth : slider.clientWidth;
}

function lazyload(items, index) {
    const img = items[index].querySelector('img');
    if (img && !img.src && img.getAttribute('data-src')) img.src = img.getAttribute('data-src');
}


function loadRightNeighbor(items, index) {
    const rightIndex = index+1 < items.length ? index + 1 : 1;
    lazyload(items,rightIndex)
}

function loadLeftNeighbor(items, index) {
    const leftIndex = index-1 >= 0 ? index-1 : items.length - 2;
    lazyload(items,leftIndex);
}

function executeSliderCallback(itemIndex, length, slideCallback) {
    if (!slideCallback) return;
    let index = (itemIndex+1) % (length-1)
    if (!index) index = length-1;
    slideCallback(index, (length-1));
}



function startAnimation(slider, media, direction) {
    slider.classList.add(direction)
    const sliderWidth = getSliderWidth(slider);
    return new Promise(resolve => {
        media.ontransitionend = () => {
            slider.classList.remove(direction);
            const dir = direction == Right ? 1 : -1;
            slider.scrollLeft +=  dir*sliderWidth;
            resolve(false);
        }
    })
}


function getNextItemIndex(slider, direction, itemIndex, itemsLength) {
    if (direction == Right) {
        if (itemIndex == itemsLength-1) {
            slider.scrollLeft = 0;
            itemIndex = 0;
        }
        return  itemIndex+1;
    }
    else  {
        if (direction == Left && !itemIndex) {
            slider.scrollLeft = slider.scrollWidth;
            itemIndex = itemsLength-1;
        }
        return itemIndex-1;
    }

}

function loadNeighnor(items, itemIndex, direction) {
    if (direction == Right) loadRightNeighbor(items, itemIndex);
    else loadLeftNeighbor(items, itemIndex);
}


function onSlideGenerator(slider, media, items, slideCallback, itemIndex, intervals) {
    let blocked = false;
    let intervalID;
    const onSlide = (direction) => {
            return async (event) => {
                if (blocked) return;
                blocked = true;
                if (intervals && event) clearInterval(intervalID);
                itemIndex = getNextItemIndex(slider, direction, itemIndex, items.length);
                loadNeighnor(items,itemIndex,direction);
                executeSliderCallback(itemIndex, items.length, slideCallback);                  
                blocked = await startAnimation(slider, media, direction); 
                if (intervals && event) intervalID = setInterval(onSlide(Right),intervals);
            }
    }
    if (intervals) intervalID = setInterval(onSlide(Right),intervals);
    return onSlide;
}

function getElements(tagNode) {
    const slider = tagNode.querySelector('.slider');
    const media = tagNode.querySelector('.media');
    const next = tagNode.querySelector('.next');
    const prev = tagNode.querySelector('.prev');
    return { slider, media, next, prev }
}


function initSlider(tagNode, slideCallback, intervals=0) {
    const { slider, media, next, prev } = getElements(tagNode);
    media.appendChild(media.firstElementChild.cloneNode(true));
    const items = media.querySelectorAll('.item');
    return (startIndex=0) => {
        const sliderWidth = getSliderWidth(slider);
        slider.scrollLeft = sliderWidth*startIndex;
        lazyload(items, startIndex);
        loadLeftNeighbor(items, startIndex);
        loadRightNeighbor(items, startIndex);
        const onSlide = onSlideGenerator(slider, media, items, slideCallback, startIndex, intervals);
        next.onclick = onSlide(Right);
        prev.onclick = onSlide(Left);

        executeSliderCallback(startIndex, items.length, slideCallback);
    }
}


export default initSlider;







