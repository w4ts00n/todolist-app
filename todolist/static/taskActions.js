document.addEventListener("DOMContentLoaded", function () {
  // Function to fetch tasks and groups and populate the lists
  // ...

// Function to fetch tasks and groups and populate the lists
    // ...

// Function to fetch tasks and groups and populate the lists



    function clearElementInnerHTML(element){
        element.innerHTML = ""
        return element
    }

    function createTaskFromData(taskData){
         const taskHtmlElement = document.createElement("li");

         taskHtmlElement.innerHTML = `
         <div>
             <span class="task-title" data-taskid="${taskData.id}">${taskData.title}</span>
             <select class="group-select" data-taskid="${taskData.id}">
                 <option value="" ${taskData.group_id === null ? "selected" : ""}></option>
             </select>
             <button class="small-button edit-button" data-taskid="${taskData.id}">Edit Title</button>
         </div>
         <input type="checkbox" data-taskid="${taskData.id}" name="completed" ${taskData.completed ? "checked" : ""}>
             ${taskData.created_at} <!-- here goes task creation date time !-->
             <button class="small-button delete-task-form" data-taskid="${taskData.id}">Delete</button>
         `;

         return taskHtmlElement
    }

    function createGroupOptionForTaskGroupsDropdown(groupData, taskHtmlElementGroupId){
        const option = document.createElement("option");
        option.value = groupData.id;
        option.text = groupData.name;

        if (groupData.id === taskHtmlElementGroupId)
          option.selected = true; // Set this option as default if it matches the task's groupData

        return option
    }

    function populateTaskHtmlElementGroupsDropdown(taskHtmlElement, groupsDataList){
        const groupSelect = taskHtmlElement.querySelector(".group-select");
        groupsDataList.forEach((groupData) => {
            const option = createGroupOptionForTaskGroupsDropdown(groupData, taskHtmlElement.group_id);
            groupSelect.appendChild(option);
        });
    }

    function fetchTasks(){
        return fetch("/tasks").then((response) => response.json())
    }
    function fetchGroups(){
        return fetch("/groups").then((response) => response.json())
    }

    function refreshTaskList() {
        Promise.all([fetchTasks(), fetchGroups()]).then(([tasks, groups]) => {
            let taskList = document.getElementById("task-list");
            taskList = clearElementInnerHTML(taskList);

            tasks.forEach((task) => {
                const taskHtmlElement = createTaskFromData(task);
                populateTaskHtmlElementGroupsDropdown(taskHtmlElement, groups);
                taskList.appendChild(taskHtmlElement);
          });
        })
        .catch((error) => console.error(error));
    }

    const taskList = document.getElementById("task-list");
    taskList.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete-task-form")) {
          const taskId = e.target.getAttribute("data-taskid");
          deleteTask(taskId);
        }
    });

    taskList.addEventListener("click", function (e) {
      if (e.target.classList.contains("edit-button")) {
        const taskId = e.target.getAttribute("data-taskid");
        const newTitle = prompt("Enter new title:"); // Pop-up do wprowadzenia nowego tytułu
        if (newTitle !== null) {
          editTaskTitle(taskId, newTitle);
        }
      }
    });

    taskList.addEventListener("change", function (e) {
      if (e.target.classList.contains("group-select")) {
        const taskId = e.target.getAttribute("data-taskid");
        const groupId = e.target.value;
        updateTaskGroup(taskId, groupId);
      }
    });

    taskList.addEventListener("change", function (e) {
      if (e.target.type === "checkbox") {
          console.log(e.target.body)
        const taskId = e.target.getAttribute("data-taskid");
        const completed = e.target.checked;
        updateTaskStatus(taskId, completed);
      }
    });

    function editTaskTitle(taskId, newTitle) {
      fetch(`/tasks/${taskId}/title`, {
        method: "POST",
        body: JSON.stringify({ title: newTitle }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((response) => {
          if (response.status === 200) {
            // Tytuł zadania został zaktualizowany pomyślnie, odśwież listę zadań
            refreshTaskList();
          } else {
            // Obsłuż błąd
            console.error("Error editing task title.");
          }
        })
        .catch((error) => console.error(error));
    }

    function updateTaskGroup(taskId, groupId) {
      fetch(`/tasks/${taskId}/group`, {
        method: "POST",
        body: JSON.stringify({ group_id: groupId }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((response) => {
          if (response.status === 200) {
            // Grupa zadania została zaktualizowana pomyślnie, odśwież listę zadań
            refreshTaskList();
          } else {
            // Obsłuż błąd
            console.error("Error updating task group.");
          }
        })
        .catch((error) => console.error(error));
    }

    function updateTaskStatus(taskId, completed) {
      fetch(`/tasks/${taskId}/status`, {
        method: "POST",
        body: JSON.stringify({ completed }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken"),
        },
      })
        .then((response) => {
          if (response.status === 200) {
            // Status zadania został zaktualizowany pomyślnie, odśwież listę zadań
            refreshTaskList();
          } else {
            // Obsłuż błąd
            console.error("Error updating task status.");
          }
        })
        .catch((error) => console.error(error));
    }

    function deleteTask(taskId) {
    fetch(`/tasks`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"),
      },
      body: JSON.stringify({ task_id: taskId }), // Przekazanie identyfikatora zadania w ciele żądania
    })
      .then((response) => {
        if (response.status === 204) {
          // Task deleted successfully, update the task list
          refreshTaskList();
        } else if (response.status === 404) {
          // Task not found, handle error as needed
          console.error("Task not found.");
        } else {
          // Handle other errors
          console.error("Error deleting task.");
        }
      })
      .catch((error) => console.error(error));
  }

// ...
    // ...

  // Call the refreshTaskList function to populate the lists initially
  refreshTaskList();

    // Event listener for adding a task
  const taskForm = document.getElementById("task-form");
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.getElementById("task-title").value;
    fetch("/tasks", {
      method: "POST",
      body: JSON.stringify({ title }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"), // Ensure you have this function to get the CSRF token
      },
    })
      .then(() => {
        // Clear input field and update the task list
        document.getElementById("task-title").value = "";
        refreshTaskList();
      })
      .catch((error) => console.error(error));
  });

  // Event listener for adding a group
  const groupForm = document.getElementById("group-form");
  groupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("group-name").value;
    fetch("/groups", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken"), // Ensure you have this function to get the CSRF token
      },
    })
      .then(() => {
        // Clear input field and update the task list
        document.getElementById("group-name").value = "";
        refreshTaskList();
      })
      .catch((error) => console.error(error));
  });
});

// Function to get the CSRF token from cookies (you may need to adjust this)
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
