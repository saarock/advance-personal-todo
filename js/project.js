import { notty } from "https://cdn.jsdelivr.net/gh/saarock/notty.js@main/dist/index.js";


const projectInput = document.querySelector(".project-input");
const createProjectButton = document.querySelector(".project-btn");
let projectDiv = document.querySelector(".show-project");
const projectList = document.getElementById("projectList");

let optionOpen = false;

// can save here index of the project options that are opened by user 
const optionsIndexSaverMemory = [];


loadProjects();



// Checking that user has written the input or not.
function isThereInputTextOrNot(message) {
    if (!message) {
        notty.warning({
            message: "Pleased fill the input",
        });
        return false;
    }
    return true;
};



function showSuccessMessage() {
    notty.success({
        message: "Created SuccessFully",
        position: 'left',
        comeFrom: "TOP"
    })
}



// create the project after clicking the createProjectButton

function createProject(projectTitle) {
    const project = {
        id: null,
        name: projectTitle,
        boards: [],
        createdDate: new Date(),
    }

    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    project.id = projects.length;
    projects.push(project);
    localStorage.setItem("projects", JSON.stringify(projects));
};



function loadProjects() {
    projectDiv.innerHTML = ""
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    if (projects.length >= 1) {
        projects.reverse().forEach((project, projectIndex) => {
            projectDiv.innerHTML += `
       <div class="project-card">
       <span class="three-dot"><i class="fa-solid fa-ellipsis-vertical"></i></span>
  <h1 class="project-title">Project Name: ${project.name}</h1>
  <p class="project-id" id="${project.id}">ID: ${project.id}</p>
  <p class="project-date">Created Date: ${new Date(project.createdDate).toDateString()}</p>
  <a href="./project-details.html" class="link"></a>
                  <div class="options-for-project">
                    <span class="delete-project" id="${projectIndex}" data-project-id="${project.id}">delete<i class="fa-solid fa-trash"></i></span>
                    <span class="update-project" data-project-id="${project.id}">update<i class="fa-solid fa-pen" ></i></span>
                </div>
</div>

            `
        });
    } else {
        projectDiv.innerHTML = 
        `
         <div class="project-card">No Projects Found </div>
        `
    }




    const Allprojects = document.querySelectorAll(".project-card");
    const threeDot = document.querySelectorAll(".three-dot");
    const options = document.querySelectorAll(".options-for-project");
    const deleteProjectBtns = document.querySelectorAll(".delete-project");
    const updateProjectBtns = document.querySelectorAll(".update-project")




    Allprojects.forEach((project) => {
        project.addEventListener("click", () => {
            const link = document.createElement("a");
            link.href = `project-details.html?id=${project.children[2].id}`; // Pass the ID as a parameter
            // project.children[project.children.length - 1].click();
            link.click()
        });
    });


    threeDot.forEach((dot, threeDotElementIndex) => {
        dot.addEventListener("click", (e) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            if (!optionOpen) {
            options[threeDotElementIndex].style.visibility ="visible";
            optionOpen = true;
            optionsIndexSaverMemory.push(threeDotElementIndex);
            } else {
                options[optionsIndexSaverMemory.pop()].style.visibility = "hidden";
                optionOpen = false;
            }
        });
    });

    window.document.addEventListener("click", (e) => {
        e.stopPropagation()
        if (optionsIndexSaverMemory.length >= 1) {
        options[optionsIndexSaverMemory.pop()].style.visibility = "hidden";
        }
        optionOpen = false;

    });


    deleteProjectBtns.forEach((deleteProjectBtn) => {
        deleteProjectBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            Allprojects[e.currentTarget.id].style.display= "none";
            deleteProject(Number(e.currentTarget.dataset.projectId));
        });
    });

    updateProjectBtns.forEach((updateProjectBtn) => {
        updateProjectBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const newProjectName = window.prompt("Enter new Project Name.");
        if (!isThereInputTextOrNot(newProjectName)) {
            return;
        }
            updateProject(Number(e.currentTarget.dataset.projectId), newProjectName);
        });
    });
}



function deleteProject(projectId) {
    const allTheProjects = JSON.parse(localStorage.getItem("projects"));
    if (allTheProjects.length > 0) {
        const newProjects = allTheProjects.filter((project) => project.id !== projectId);
        localStorage.setItem("projects", JSON.stringify(newProjects));
        resetOptinsSetting();
    }
}

function updateProject(projectId, newProjectName) {
    const allTheProjects = JSON.parse(localStorage.getItem("projects"));
    if (allTheProjects.length > 0) {
        const newProjects = allTheProjects.map((project) => {
            if (project.id === projectId) {
                project.name = newProjectName;
                project.createdDate = new Date();
            }
            return project;
        });

        localStorage.setItem("projects", JSON.stringify(newProjects));
        resetOptinsSetting();
        loadProjects();
    }
}

function resetOptinsSetting() {
    optionOpen = false;
    optionsIndexSaverMemory.splice(0, optionsIndexSaverMemory.length);
}


createProjectButton.addEventListener("click", () => {
    if (!isThereInputTextOrNot(projectInput.value)) {
        return;
    }
    createProject(projectInput.value);
    showSuccessMessage();
    loadProjects();
    
});



// Search functionality

// Function to render projects
function renderProjects(projectsToRender) {
    const projectList = document.getElementById("projectList");
    projectList.innerHTML = ""; // Clear existing content
    projectList.style.visibility = "visible"

    if (projectsToRender.length === 0) {
        projectList.innerHTML = "<p class='message-not-found'>No projects found</p>";
        return;
    }

    projectsToRender.forEach((project) => {
        const projectDiv = document.createElement("div");
        projectDiv.className = "project-item";
        projectDiv.textContent = project.name;

        // Make each project clickable
        projectDiv.addEventListener("click", () => {
            const link = document.createElement("a");
            link.href = `project-details.html?id=${project.id}`; // Pass the project ID as a query parameter
            link.click();
        });

        projectList.appendChild(projectDiv);
    });
}

// Function to filter projects
function filterProjects(query) {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    const filteredProjects = projects.filter((project) =>
        project.name.toLowerCase().includes(query.toLowerCase())
    );
    renderProjects(filteredProjects);
}

// Add event listener for search functionality
document.querySelector(".search-button").addEventListener("click", () => {
    const query = document.getElementById("searchProject").value;
    filterProjects(query);
});



projectList.addEventListener("click", (event) => {
    event.currentTarget.style.visibility = "hidden"
})