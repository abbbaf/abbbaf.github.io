const deletedStyle = "done";
const cookieId = "myTodo";
const $ = document.querySelector.bind(document);

function compareArrays(array1, array2) {
    return JSON.stringify(array1) == JSON.stringify(array2)
}


function createNewTaskElement(content="", isChecked = false) {
    const newTaskElement = $('#taskTemplate').content.cloneNode(true);
    if (isChecked) {
        newTaskElement.querySelector('.task').classList.add(deletedStyle);
        newTaskElement.querySelector('input[type="checkbox"]').checked = true;
    }
    const taskContent = newTaskElement.querySelector('.task-content');
    taskContent.innerHTML = content;
    return { taskWrapper: newTaskElement, taskContent };
}


function addTask(container, taskContentEvents, data) {
    const { taskWrapper, taskContent } = createNewTaskElement(...Object.values(data || {}));
    container.append(taskWrapper);
    taskContentEvents(taskContent);
    taskContent.focus();
}

function removeTask(task) {
    task.remove();
}


function removeBySelector(container, selector) {
    Array.from(container.querySelectorAll(selector)).forEach(e => e.remove())

}

function removeCheckedTasks(container) {
    removeBySelector(container,"." + deletedStyle);
}


function clearAll(container) {
    removeBySelector(container,":not(template)");
}


function taskStatisChangeHandler(container,checkbox) {
    const task = checkbox.closest('.task');
    task.classList.toggle(deletedStyle);
    if (checkbox.checked) {
        task.remove();
        container.append(task);
    }
}



function initTaskContentEvents(container, save) {
    const taskContentEvents = (taskContent) => {
        taskContent.onkeydown = (e) => {
            if (e.key == 'Enter') { 
                e.preventDefault();
                addTask(container, taskContentEvents);
            }
    
            if (e.key == "Backspace" && (e.target.innerHTML == "" ||  e.target.innerHTML == "<br>")) {
                e.preventDefault();
                removeTask(e.target.closest('.task'));
                save();
            }
    
        };

        const oninput = () => {
            taskContent.onblur = () => {
                save();
                taskContent.onblur = null;
                taskContent.oninput = oninput;
            };
            taskContent.oninput = null;
        }

        taskContent.oninput = oninput;
        
    }   

    return taskContentEvents;
}



function getCookies() {
    return document.cookie.split('; ').reduce((acc,e) => {
        const index = e.indexOf("=");
        acc[e.substr(0,index)] = e.substr(index+1);
        return acc;
    },{})
}


function saveInCookies(data) {
    document.cookie = cookieId + "=" + JSON.stringify(data);
}


function initSaveAndLoad(container, saveFormat) {
    const allSaves = []

    const loader = (taskContentEvents) => (data) => {
        if (!data) {
            data = JSON.parse(getCookies()[cookieId] || "[]");
            allSaves.push(data);
        }
        data.forEach((e) => addTask(container, taskContentEvents, e));
     
    }

    const save = saveFunc(container, allSaves, saveFormat);

    const undo = (load) => {
        if (allSaves.length <= 1) return;
        clearAll(container);
        allSaves.pop();
        load(allSaves[allSaves.length-1]);
    }

    return { loader, save, undo };
}


function saveFunc(container, allSaves, saveFormat) {
    const max = 100;
    return (newSave=true) => {
        const data = Array.from(container.querySelectorAll('.task')).map(saveFormat);

        if (newSave) {
            if (compareArrays(allSaves[allSaves.length-1],data)) return;
            allSaves.push(data);
            if (allSaves.length == max) {
                allSaves.slice(max/2);
            }
        }
        saveInCookies(data);
    }
}


//On load
function main() {  

    const container = $('.task-container');

    const { loader, save, undo } = initSaveAndLoad(container, task => ({
        content: task.querySelector('.task-content').innerHTML,
        isChecked: task.querySelector('input[type="checkbox"').checked
    }));

    const taskContentEvents = initTaskContentEvents(container, save);

    const load = loader(taskContentEvents);
    load();


    const undoEvent = () => {
        undo(load);
        save(false);
    }


    $(".add-task-container").onclick = () => {
        addTask(container, taskContentEvents);
    };
    
    $(".remove-tasks-container").onclick = () => {
        removeCheckedTasks(container);
        save();
    };


    container.onchange = (e) => {
        if (e.target.tagName == "INPUT" && e.target.type == "checkbox")  {
            taskStatisChangeHandler(container, e.target);
            save();
        }
    }
    
    $('.undo').onclick = undoEvent;


    $('body').onkeydown = (e) => {
        if (e.altKey && e.key == 'n') {
            addTask(container, taskContentEvents);
        } 
        else if (e.ctrlKey && e.key == 'z') {
            undoEvent();
        }
    }

}

main();
