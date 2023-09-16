
function updateTaskStatus(checkbox, taskId) {
    const formData = new FormData();
    formData.append("completed", checkbox.checked);

    fetch(`tasks/${taskId}/status`, {
      method: "POST",
      body: formData,
      headers: {
        "X-CSRFToken": getCookie("csrftoken"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Jeśli jesteś zainteresowany odpowiedzią z serwera,
        // możesz wykonać odpowiednie działania tutaj.
      });
}

document.addEventListener("DOMContentLoaded", function () {
    const editButtons = document.querySelectorAll(".edit-button");
    const taskTitles = document.querySelectorAll(".task-title");
    const groupSelects = document.querySelectorAll(".group-select");
    const deleteTaskForms = document.querySelectorAll(".delete-task-form");


    deleteTaskForms.forEach((deleteForm) => {
        deleteForm.addEventListener("click", (event) => {
            const taskId = deleteForm.getAttribute("data-taskid");
            deleteTask(taskId);
            setTimeout(() => {
                location.reload();
            }, 100);
        });
    });

    groupSelects.forEach((select) => {
        select.addEventListener("change", (event) => {
            const taskId = select.getAttribute("data-taskid");
            const groupId = select.value;
            updateTaskGroup(groupId, taskId);
        });
    });

    editButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const taskId = button.getAttribute("data-taskid");
            const taskTitleSpan = document.querySelector(`[data-taskid="${taskId}"]`);
            const newTitle = prompt("Enter the new title:");

            if (newTitle !== null) {
                taskTitleSpan.textContent = newTitle;
                updateTaskTitle(newTitle, taskId);
            }
        });
    });
});

function updateTaskTitle(newTitle, taskId) {
    const formData = new FormData();
    formData.append("title", newTitle);

    fetch(`/tasks/${taskId}/title`, {
        method: "POST",
        body: formData,
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
        },
    })
}

function updateTaskGroup(groupId, taskId) {
    const formData = new FormData();
    formData.append("group_id", groupId);

    fetch(`/tasks/${taskId}/group`, {
        method: "POST",
        body: formData,
        headers: {
            "X-CSRFToken": getCookie("csrftoken"),
        },
    })
    .then((response) => response.json())
    .then((data) => {
    });
}


function deleteTask(taskId) {
    fetch(`/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        }
    })
}


function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === name + "=") {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
