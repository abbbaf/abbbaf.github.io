const deletedStyle = "done";
const cookieId = "myTodo";


function compareArrays(array1, array2) {
    return JSON.stringify(array1) == JSON.stringify(array2)
}


function createNewTaskElement(content="", isChecked = false) {
    const newTaskElement = $($('#taskTemplate')[0].content).clone();
    if (isChecked) {
        newTaskElement.find('.task').addClass(deletedStyle);
        newTaskElement.find('input:checkbox').attr("checked",true);
    }
    const taskContent = newTaskElement.find('.task-content');
    taskContent.html(content);
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



function removeCheckedTasks(container) {
    container.find($('.' + deletedStyle)).remove();
}


function clearAll(container) {
    container.find(":not(template)").remove();
}

function taskStatisChangeHandler(container,e) {
    const $this = $(e)
    const task = $this.closest('.task');
    task.toggleClass(deletedStyle);
    if ($this.is(":checked")) {
        task.detach().appendTo(container);
    }
}



function initTaskContentEvents(container, save) {
    const taskContentEvents = (taskContent) => {
        taskContent.on("keydown",(e) => {
            if (e.key == 'Enter') { 
                e.preventDefault();
                addTask(container, taskContentEvents);
            }
    
            if (e.key == "Backspace" && (e.target.innerHTML == "" ||  e.target.innerHTML == "<br>")) {
                e.preventDefault();
                removeTask($(e.target).parent());
                save();
            }
    
        });

        const oninput = () => {
            taskContent.on('blur',() => {
                save();
                taskContent.off("blur");
                taskContent.on("input",oninput)
            });
            taskContent.off("input");
        }

        taskContent.on("input",oninput);
        
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
            data = JSON.parse(getCookies()[cookieId] || []);
            allSaves.push(data);
        }
        data.forEach((e) => addTask(container, taskContentEvents, e));
    }

    const save = saveFunc(allSaves, saveFormat);

    const undo = (load) => {
        if (allSaves.length <= 1) return;
        clearAll(container);
        allSaves.pop();
        load(allSaves[allSaves.length-1]);
    }

    return { loader, save, undo };
}


function saveFunc(allSaves, saveFormat) {
    const max = 100;
    return (newSave=true) => {
        const data = $.map($('.task'),saveFormat);

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
$(() => {  

    const container = $('.task-container');

    const { loader, save, undo } = initSaveAndLoad(container, task => ({
        content: $(task).find($('.task-content')).html(), 
        isChecked: $(task).find("input:checkbox").is(':checked') 
    }));

    const taskContentEvents = initTaskContentEvents(container, save);
    const load = loader(taskContentEvents);
    load();


    $(".add-task-container").on('click touchstart',() => addTask(container, taskContentEvents));
    $(".remove-tasks-container").on('click touchstart', () => {
        removeCheckedTasks(container);
        save();
    });


    $(".task-container").on('change',"input:checkbox",function() {
        taskStatisChangeHandler(container, this);
        save();
    });


    $('body').on('keydown',(e) => {
        if (e.altKey && e.key == 'n') {
            addTask(container, taskContentEvents);
        } 
        else if (e.ctrlKey && e.key == 'z') {
            undo(load);
            save(false);
        }
    })  
    
    
 
})
