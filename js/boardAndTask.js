import { notty } from "https://cdn.jsdelivr.net/gh/saarock/notty.js@main/dist/index.js";

// All the global methods
const addBoardButton = document.querySelector(".navs-navbars-nav-navchild-addProject");
const boardInput = document.querySelector(".navs-navbars-nav-navchild-writeProject");
const proejctName = document.querySelector(".project-name");
let boards = document.querySelector(".boards");
const backButton = document.querySelector(".back");


// calling the funtion to load all the boards and tasks
loadBoards();



// back to previous event
backButton.onclick = () => {
    window.location.assign("index.html")
}



// function to add the new board
function addBoard(boardName, projectId) {
    if (isValue(boardName)) {
        return;
    }
    const board = {
        id: null,
        name: boardName,
        tasks: [],
        date: new Date(),
    }
    const projects = JSON.parse(localStorage.getItem("projects"));
    if (projects.length >= 1) {
        const project = projects[Number(projectId)];
        board.id = project.boards.length;
        project.boards.push(board);
        localStorage.setItem("projects", JSON.stringify(projects));
    }
}



// event listener to the addBoard button
addBoardButton.addEventListener('click', () => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    // Extract the project ID
    const projectId = urlParams.get("id");

    addBoard(boardInput.value, projectId);
    loadBoards();

});


// function to check the input value
function isValue(value) {
    if (!value) {
        notty.warning({
            message: "Input required"
        });
        return true;
    } else {
        return false;
    }
}


// function to load all the boards and tasks
function loadBoards() {
    boards.innerHTML = "";
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const projects = JSON.parse(localStorage.getItem("projects"))
    if (projects.length >= 1) {
        // const project = projects[Number(urlParams.get("id"))];
        const project = projects.filter((pr) => pr.id === Number(urlParams.get("id")))[0];
        proejctName.innerHTML = project.name
        if (project.boards.length >= 1) {
        project.boards.reverse().forEach((board, boardIndex) => {
            console.log(board.tasks)
            boards.innerHTML += `
            <div class="board-card">
       <span class="remove-board" id="${boardIndex}" data-board-id="${board.id}"><i class="fa-solid fa-xmark"></i></span>

                <div class="board-header">
                    <span class="board-title">${board.name}</span>
                    <span class="board-date">${new Date(board.date).toLocaleDateString()}</span>
                </div>
                <div class="task-container">
                    <h4>Tasks:</h4>
                    <ul class="task-list">
                        ${board.tasks && board.tasks.length > 0
                    ? board.tasks.map(
                        (task, index) => `
                            <li class="task-item" data-task-id="${index}">
                                <span class="task-name ${task.done ? 'task-done' : ''}">${task.name}</span>
                                <span class="task-date">Created: ${new Date(task.createdDate).toLocaleDateString()}</span>
                                <div class="task-actions">
                                    <button class="task-btn done-btn" data-task-id="${index}" id="${board.id}">Done</button>
                                    <button class="task-btn update-btn" data-task-id="${index}" id="${board.id}">Update</button>
                                    <button class="task-btn delete-btn" data-task-id="${index}" id="${board.id}">Delete</button>
                                </div>
                            </li>`
                    ).join("")
                    : `<li class="task-item no-tasks">No tasks added yet.</li>`
                }
                    </ul>
                </div>
                <div class="add-task">
                    <input 
                        type="text" 
                        class="add-task-input" 
                        placeholder="Enter new task" 
                    />
                    <button class="add-task-btn" id="${board.id}">Add Task</button>
                    
                </div> <div class="options-for-project">
                    <span class="delete-project" >delete<i class="fa-solid fa-trash"></i></span>
                    <span class="update-project">update<i class="fa-solid fa-pen" ></i></span>
                </div

            </div>`;
        });
    } else {
        boards.innerHTML = `
        <h1 class="message-not-board">No boards are found.</h1>
        `
    }

    };





    const addTaskButton = document.querySelectorAll(".add-task-btn");
    const addTaskInput = document.querySelectorAll(".add-task-input");
    const markAsDone = document.querySelectorAll(".done-btn");
    const deleteTaskBtn = document.querySelectorAll(".delete-btn");
    const updateTaskBtn = document.querySelectorAll(".update-btn");
    const removeBoardBtns = document.querySelectorAll(".remove-board");
    const allTheBoards = document.querySelectorAll(".board-card");




    addTaskButton.forEach((button, index) => {
        button.addEventListener("click", () => {
            addTask(Number(urlParams.get("id")), Number(button.id), addTaskInput[index].value);
        });
    });


    markAsDone.forEach((button) => {
        button.addEventListener("click", (event) => {
            const taskId = event.target.dataset.taskId;
            markTaskAsDone(Number(urlParams.get("id")), Number(button.id), Number(taskId));

        });

    });


    deleteTaskBtn.forEach((button) => {
        button.addEventListener("click", (event) => {
            const taskId = event.target.dataset.taskId;
            deleteTask(Number(urlParams.get("id")), Number(button.id), Number(taskId));
        });

    });

    updateTaskBtn.forEach((button) => {
        button.addEventListener("click", (event) => {
            const value = window.prompt();
            const taskId = event.target.dataset.taskId;
            updateTask(Number(urlParams.get("id")), Number(button.id), Number(taskId), value);
        });

    });

    removeBoardBtns.forEach((removeBoardBtn) => {
        removeBoardBtn.addEventListener("click", (event) => {
            const boardIndex =event.target.id;
            const boardId = event.target.dataset.boardId;
            removeBoard(Number(boardId), boardIndex, allTheBoards, Number(urlParams.get("id")));
        })

    })

}




// function to add thte tasks
function addTask(proejctIndex, boardIndex, value) {
    if (isValue(value)) {
        return;
    }
    const task = {
        id: null,
        name: value,
        createdDate: new Date(),
        done: false,
    }

    const projects = JSON.parse(localStorage.getItem("projects"));
    if (projects.length >= 1) {
        const project = projects[proejctIndex];
        console.log(project.boards)
        const boards = project.boards;
        const board = boards[boardIndex];
        console.log(board)
        const id = board.tasks.length;
        task.id = id;
        board.tasks.push(task);
        projects[proejctIndex] = project;
        localStorage.setItem("projects", JSON.stringify(projects));
        loadBoards();
    }
}


// Add task functionality
const addTaskButtons = document.querySelectorAll(".add-task-btn");
addTaskButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const boardIndex = button.id;
        const taskInput = button.previousElementSibling;
        const taskName = taskInput.value.trim();
        if (taskName) {
            const task = {
                name: taskName,
                done: false,
                date: new Date(),
            };
            addTask(Number(urlParams.get("id")), Number(boardIndex), task);
            taskInput.value = ""; // Clear input after adding
        }
    });
});




//  function to markas Done tasks
function markTaskAsDone(projectIndex, boardIndex, taskId) {
    const projects = JSON.parse(localStorage.getItem("projects"));
    if (projects && projects[projectIndex]) {
        const project = projects[projectIndex];
        const board = project.boards[boardIndex];
        const task = board.tasks[taskId];
        task.done = !task.done;
        projects[projectIndex] = project;
        localStorage.setItem("projects", JSON.stringify(projects));
        loadBoards();
    }
}


// function to update the tasks
function updateTask(projectIndex, boardIndex, taskId, newTaskName) {
    const projects = JSON.parse(localStorage.getItem("projects"));
    if (projects && projects[projectIndex]) {
        const project = projects[projectIndex];
        const board = project.boards[boardIndex];
        const task = board.tasks[taskId];
        task.name = newTaskName;
        projects[projectIndex] = project;
        localStorage.setItem("projects", JSON.stringify(projects));
        loadBoards();
    }
}


//  function to delete the tasks
function deleteTask(projectIndex, boardIndex, taskId) {
    const projects = JSON.parse(localStorage.getItem("projects"));
    if (projects && projects[projectIndex]) {
        const project = projects[projectIndex];
        const board = project.boards[boardIndex];
        board.tasks.splice(taskId, 1);
        projects[projectIndex] = project;
        localStorage.setItem("projects", JSON.stringify(projects));
        loadBoards();
    }
}


// function to remove the board;
function removeBoard(boardId, boardIndex, allTheBoards, projectId) {
    if (allTheBoards.length > 0) {
        const projects = JSON.parse(localStorage.getItem("projects"));
        if (projects.length > 0) {
            const project = projects.filter((pr) => pr.id === projectId);
            if (project.length <=0) {
                notty.error({
                    message: "Something wrong pleased refresh and try again."
                })
                return;
            }
            const currentProject = project[0];
            const boards = currentProject.boards;
            if (boards.length >= 1) {
                const newBoards = boards.filter((brd) => brd.id !== boardId);
                currentProject.boards = newBoards;
                const newCurrentProjects = projects.map((project) => {
                    if (project.id === projectId) {
                        project = currentProject;
                    }
                    return project;
                });
                localStorage.setItem("projects", JSON.stringify(projects));
            }
        }
        allTheBoards[boardIndex].style.display = "none";
        
    }
    
}