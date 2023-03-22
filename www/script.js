let taskList = [];

const loadTasks = async () => {
  response = await fetch("/tasks/get");
  tasks = await response.json();
  taskList = [];
  tasks.forEach((task) => {
    taskList.push(task);
  });
  printTasks(taskList);
};

const printTasks = (taskList) => {
  const list = document.getElementById("tasks-list-container");
  list.innerHTML = "";
  taskList.forEach((element) => {
    const table = document.createElement("table");
    const tr = document.createElement("tr");
    const id = document.createElement("td");
    const name = document.createElement("td");
    const status = document.createElement("td");
    id.innerText = element.id;
    name.innerText = element.title;
    status.innerText = element.done;
    tr.setAttribute("id", element.id);
    tr.appendChild(id);
    tr.appendChild(name);
    tr.appendChild(status);
    table.addEventListener("dragleave", () => {
      remove(element);
    });
    table.addEventListener("touchmove", (e) => {
      const currentPos = e.touches[0].clientX;
      const initalPos = Number(table.getAttribute("pos"));
      const posDiference = initalPos - currentPos;
      if (posDiference < -8) {
        remove(element);
      }
    });
    table.addEventListener("touchstart", (e) => {
      table.setAttribute("start", new Date());
      table.setAttribute("pos", e.touches[0].clientX);
    });
    table.addEventListener("touchend", () => {
      console.log(Date.parse(table.getAttribute("start")) - new Date());
      if (new Date() - Date.parse(table.getAttribute("start")) >= 2000) {
        toggleDone(element);
      }
    });
    table.addEventListener("contextmenu", function (e) {
      e.preventDefault();
    });
    table.appendChild(tr);
    table.setAttribute("draggable", true);
    if (element.done == true) {
      table.style.background = "Green";
    } else {
      table.style.background = "Orange";
    }
    list.appendChild(table);
  });
};

const add = async () => {
  const field = document.querySelector("#task-name");
  if (field.value !== "") {
    taskList.push({ id: taskList.length + 1, title: field.value, done: false });
  }
  const response = await fetch("/tasklist/update", {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskList),
  });
  if (response.status == 200) {
    await loadTasks();
    field.value = "";
  }
  window.navigator.vibrate(100);
};

const remove = async (element) => {
  const start = taskList.indexOf(element);
  if (start !== -1) {
    taskList.splice(start, 1);
    const response = await fetch("/tasklist/update", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskList),
    });
    if (response.status == 200) {
      await loadTasks();
    }

    window.navigator.vibrate(500);
  }
};

const toggleDone = async (element) => {
  const aux = element;
  aux.done = !aux.done;
  const start = taskList.indexOf(element);
  if (start !== -1) {
    taskList.splice(start, 1, aux);
    const response = await fetch("/tasklist/update", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskList),
    });
    if (response.status == 200) {
      await loadTasks();
    }

    window.navigator.vibrate(500);
  }
};

const addButton = document.querySelector("#fab-add");

addButton.addEventListener("touchend", add);

loadTasks();
