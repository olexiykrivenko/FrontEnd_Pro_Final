    //Rendering HTML page via JS methods

let tasksSection = document.body.querySelector(".tasks");

//new task button
let newTaskButton = document.createElement("button");
newTaskButton.innerText =  "+ NEW TASK";
newTaskButton.classList.add("new_task");
tasksSection.append(newTaskButton);

//right slide panel
let slidePanel = document.createElement("div");
slidePanel.classList.add("dashboard");

    //post new task section
let postNewTask = document.createElement("div");
postNewTask.classList.add("postNewTask");

let postNewTaskHeaderH4 = document.createElement("h4");
postNewTaskHeaderH4.innerText = "NEW TASK";
postNewTask.append(postNewTaskHeaderH4);

let taskTextP = document.createElement("p");
taskTextP.classList.add("task_text");
postNewTask.append(taskTextP);

let createTaskButton = document.createElement("button");
createTaskButton.innerText = "CREATE TASK";
postNewTask.append(createTaskButton);

slidePanel.append(postNewTask);

    //location section
let locationAddress = document.createElement("div");
locationAddress.classList.add("location");

let locationHeaderH4 = document.createElement("h4");
locationHeaderH4.innerText = "LOCATION";
locationAddress.append(locationHeaderH4);

let locationTextP = document.createElement("p");
locationTextP.innerText = "This is the location address";
locationAddress.append(locationTextP);

slidePanel.append(locationAddress);

    //service types section
let serviceType = document.createElement("div");
serviceType.classList.add("service_type");

let serviceTypeHeaderH4 = document.createElement("h4");
serviceTypeHeaderH4.innerText = "SERVICE TYPES";
serviceType.append(serviceTypeHeaderH4);

let serviceTypeBlock = document.createElement("ul");

let servicesList = ["Electrician", "Plumber", "Gardener", "Housekeeper", "Cook"];
for (let i = 0; i < servicesList.length; i++){
    let serviceTypeBlockLi = document.createElement("li");
    let serviceTypeBlockLiSpan = document.createElement("span");
    let serviceTypeBlockLiP = document.createElement("p");
    serviceTypeBlockLiP.innerText = servicesList[i];

    serviceTypeBlockLi.append(serviceTypeBlockLiSpan);
    serviceTypeBlockLi.append(serviceTypeBlockLiP);
    serviceTypeBlock.append(serviceTypeBlockLi);
}

serviceType.append(serviceTypeBlock);
slidePanel.append(serviceType);

    //service type tasks list
let serviceTypeTasks = document.createElement("div");
serviceTypeTasks.classList.add("service_type_tasks");

serviceTypeTasksHeaderH4 = document.createElement("h4");
serviceTypeTasksHeaderH4.innerText = "SERVICE TASKS";
serviceTypeTasks.append(serviceTypeTasksHeaderH4);

let serviceTypeTasksBlock = document.createElement("ul");
serviceTypeTasks.append(serviceTypeTasksBlock);
slidePanel.append(serviceTypeTasks);

    //task free text description
let taskFreeText = document.createElement("div");
taskFreeText.classList.add("task_description");

let taskFreeTextHeaderH4 = document.createElement("h4");
taskFreeTextHeaderH4.innerText = "TASK DESCRIPTION";
taskFreeText.append(taskFreeTextHeaderH4);

let taskDesc = document.createElement("textarea");
taskDesc.setAttribute("cols", "30");
taskDesc.setAttribute("rows", "10");
taskFreeText.append(taskDesc);

slidePanel.append(taskFreeText);
tasksSection.append(slidePanel);


// created tasks list block
let taskBlock = document.createElement("ul");
taskBlock.classList.add("taskBlock");
tasksSection.append(taskBlock);

//edit modal window
let editModalWindow = document.createElement("div");
editModalWindow.classList.add("edit_modal");

let editModalWindowContent = document.createElement("div");
editModalWindowContent.classList.add("edit_modal_content");

let editModalInput = document.createElement("input");
editModalInput.setAttribute("type", "text");
editModalWindowContent.append(editModalInput);

let editModalSaveButton = document.createElement("button");
editModalSaveButton.innerText = "SAVE";
editModalWindowContent.append(editModalSaveButton);

editModalWindow.append(editModalWindowContent);
tasksSection.append(editModalWindow);






    //MVC model for task list web application

class NewTaskView{
    static renderNewTaskText(taskTextData){
        let service = taskTextData.service ? taskTextData.service : '';
        let task = taskTextData.task ? taskTextData.task : '';
        let taskDescr = taskTextData.taskDescr ? taskTextData.taskDescr : '';

        taskTextP.innerHTML = `I need ${service} to ${task}, ${taskDescr}`;
    }
}

class TaskListView{
    static renderTasksList(taskList){
        taskBlock.innerHTML = "";
        for(let task of taskList){
            taskBlock.prepend(task);
        }
    }
}

class ServiceTypeTasksView{
    static renderServiceTypeTasks(selectedService){
        switch(selectedService){
            case "Electrician":
                addElectricianServices();
                break;
            case "Plumber":
                addPlumberServices();
                break;
            case "Gardener":
                addGardenerServices();
                break;
            case "Housekeeper":
                addHousekeeperServices();
                break;
            case "Cook":
                addCookServices();
                break;
        }
    }
}


class TaskListModel{

    updateDatabase(taskBlockItem){
        let taskToServer = {
            id: taskBlockItem.getAttribute("uniqid"),
            dateTime: taskBlockItem.querySelector("span").innerText,
            taskText: taskBlockItem.querySelector("p").innerText
        }
        let json = JSON.stringify(taskToServer);

        let postTaskToDBPromise = new Promise(function(resolve, reject){
            let xhttp = new XMLHttpRequest();
            xhttp.open("POST", "http://localhost:4321/tasks", true);
            xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhttp.onload = () => resolve();
            xhttp.onerror = () => reject("Server communication error");
            xhttp.send(json);
        });

        postTaskToDBPromise.then(
            function(){
                getTasksFromDB();
            },
            function(result){
                alert(result);
            }
        )
    }
}


class TaskListController{
    constructor(taskListModel){
        this.taskListModel = taskListModel;
    }

    handler(){
        let taskTextData = {};
        let weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
        let months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        
        //new task button
        newTaskButton.addEventListener("click", function(){
            taskTextP.innerHTML = "";
            serviceTypeTasksBlock.innerHTML = "";
            taskDesc.value = "";
            slidePanel.style.right = "0px";
            for(let service of serviceTypeBlock.children){
                service.querySelector("span").className = "";
            }
            delete taskTextData.service;
            delete taskTextData.task;
            delete taskTextData.taskDescr;
        })

        //service type block
        for(let service of serviceTypeBlock.children){
            service.addEventListener("click", function(event){
                for(let service of serviceTypeBlock.children){
                    service.querySelector("span").className = "";
                }
                event.currentTarget.querySelector("span").classList.add("service_selected");
                taskTextData.service = event.currentTarget.querySelector("p").innerText;
                NewTaskView.renderNewTaskText(taskTextData);
                ServiceTypeTasksView.renderServiceTypeTasks(taskTextData.service);
            });
        }

        //service type tasks block
        serviceTypeTasksBlock.addEventListener("click", function(event){
            for(let child of serviceTypeTasksBlock.children){
                child.className="";
            }
                
            event.target.classList.add("service_type_task_active");
            taskTextData.task = event.target.innerText;
            NewTaskView.renderNewTaskText(taskTextData);
        })

        //service type task free text description
        taskDesc.addEventListener("input", function(event){
            taskTextData.taskDescr = event.currentTarget.value;
            NewTaskView.renderNewTaskText(taskTextData);
        })

        //create task button
        createTaskButton.addEventListener("click", function(){
            if(!taskTextData.service || !taskTextData.task || !taskTextData.taskDescr){
                alert("Some options were not selected\nPlease make sure you selected SERVICE TYPE, SERVICE TASK and added TASK DESCRIPTION");
                return;
            }

            let date = new Date();

            let obj = {
                id: Number(date),
                dateTime: `${weekDays[date.getDay()]}, ${date.getDate()} ${months[date.getMonth() + 1]}, ${date.getHours()}:${date.getMinutes()}`,
                taskText: `I need ${taskTextData.service} to ${taskTextData.task}, ${taskTextData.taskDescr}`
            }

            let taskBlockItem = createTaskListItem(obj);
            slidePanel.style.right = "-350px";
            taskListModel.updateDatabase(taskBlockItem);
        })

        window.addEventListener("load", function(){
            getTasksFromDB();
        })
    }
}

let taskListView = new TaskListView();
let taskListModel = new TaskListModel();
let taskListController = new TaskListController(taskListModel);

taskListController.handler();


function createTaskListItem(obj){
    
    let taskBlockItem = document.createElement("li");
    taskBlockItem.classList.add("taskBlockItem");
    taskBlockItem.setAttribute("uniqId",obj.id);

    let taskBlockItemDate = document.createElement("span");
    taskBlockItemDate.innerText = obj.dateTime;
    taskBlockItem.append(taskBlockItemDate);       
    
    let taskBlockItemText = document.createElement("p");
    taskBlockItemText.innerText = obj.taskText;
    taskBlockItem.append(taskBlockItemText);

    let editButton = document.createElement("button");
    editButton.classList.add("edit");
    editButton.innerText = "EDIT";
    taskBlockItem.append(editButton);

    let deleteButton = document.createElement("button");
    deleteButton.classList.add("delete");
    deleteButton.innerText = "DELETE";
    taskBlockItem.append(deleteButton);

    return taskBlockItem;
}

function deleteTaskFromDB(id){
    let xhttp = new XMLHttpRequest();
    let host = "http://localhost:4321/tasks/" + id;
    xhttp.open("DELETE", host, true);
    xhttp.onerror = () => alert(`Server connectivity error!\nStatus: ${xhttp.status}, State: ${xhttp.readyState}`);
    xhttp.send();
}

function updateTaskInDB(json){
    let xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "http://localhost:4321/tasks/update", true);
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.onerror = () => alert(`Server connectivity error!\nStatus: ${xhttp.status}, State: ${xhttp.readyState}`);
    xhttp.send(json);
}

function getTasksFromDB(){
    let xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://localhost:4321/tasks", true);
    xhttp.onerror = () => alert(`Server connectivity error!\nStatus: ${xhttp.status}, State: ${xhttp.readyState}`);
    xhttp.send();

    xhttp.addEventListener("load", function(){
        if(xhttp.status === 200 && xhttp.readyState === 4){
            let tasksList = JSON.parse(xhttp.responseText);
            let taskListItems = [];

            for(let task of tasksList){
                taskListItems.push(createTaskListItem(task));
            }

            for (let item of taskListItems){
                item.querySelector(".delete").addEventListener("click", function(){
                    let id = item.getAttribute("uniqid");
                    deleteTaskFromDB(id);
        
                    taskListItems.forEach((task, index) => {
                        if(item === task){
                            taskListItems.splice(index, 1);
                            task.remove();
                        }
                    })
                    TaskListView.renderTasksList(taskListItems);
                })

                item.querySelector(".edit").addEventListener("click", function(){
                    editModalWindow.classList.add("show_edit_modal");
                    editModalInput.value = item.querySelector("p").innerText;
                    editModalSaveButton.addEventListener("click", editDB);
        
                    function editDB(){
                        taskListItems.forEach((task) => {
                            if(item === task){
                                task.querySelector("p").innerText = editModalInput.value;
                            }
                        })
                        editModalWindow.classList.remove("show_edit_modal");
                        this.removeEventListener("click", editDB);
        
                        let taskObj = {
                            id: item.getAttribute("uniqid"),
                            taskText: item.querySelector("p").innerText
                        }
        
                        let json = JSON.stringify(taskObj);
                        updateTaskInDB(json);
                        TaskListView.renderTasksList(taskListItems);
                    }
                })
            }

            TaskListView.renderTasksList(taskListItems);
        } else {
            console.log(`Something wrong! Status: ${xhttp.status}, State: ${xhttp.readyState}`);
        }
    })
}


function addPlumberServices(){
    let serviceTasks = ["Unblock a toilet",
                        "Unblock a sink", 
                        "Fix a water link",
                        "Install a sink",
                        "Install a shower",
                        "Install a toilet"];

    addServicesTypes(serviceTasks);
}




function addElectricianServices(){
    let serviceTasks = ["Change wires",
                        "Insert light-bulb", 
                        "Fix Television device",
                        "Install ceiling lamp",
                        "Make wires around the apartment"];
                        
    addServicesTypes(serviceTasks);
}


function addGardenerServices(){
    let serviceTasks = ["Cut trees",
                        "Make Grass", 
                        "Work with trees",
                        "Clean the ourdoor in autumn",
                        "Keep gardener house clean"];

    addServicesTypes(serviceTasks);
}


function addHousekeeperServices(){
    let serviceTasks = ["Clean apartment",
                        "Wash dishes", 
                        "Wash clothes",
                        "Make dinner",
                        "Clean the outdoor"];

    addServicesTypes(serviceTasks);
}


function addCookServices(){
    let serviceTasks = ["Deliver food",
                        "Prepare food", 
                        "Teach how to cook",
                        "Make birthday cake",
                        "Prepare grill"];

    addServicesTypes(serviceTasks);
}

function addServicesTypes(serviceTasks){
    serviceTypeTasksBlock.innerHTML = "";
    serviceTasks.forEach(service => {
        let li = document.createElement("li");
        li.innerText = service;
        serviceTypeTasksBlock.append(li);
    })
}