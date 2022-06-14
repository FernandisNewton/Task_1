/*********** Selectors ***********/

const button = document.querySelector(".btn");
const task = document.querySelector(".tasks");
const completed_task = document.querySelector(".completed_tasks");
const form_button = document.querySelector(".form-button");
const card_color = document.querySelector(".card_color");
const date_input = document.querySelector(".date_input");
const tag_input = document.querySelector(".tag_input");
const task_input = document.querySelector(".task_input");
const form_modal = document.querySelector(".form_modal");
const cardContainer = document.querySelectorAll(".cardContainer");

/*********** Variables ***********/

let draggedCard = null;
let draggedCardInfo = {};

/*********** Fetch existing data ***********/

const existingTasks = JSON.parse(localStorage.getItem("tasks"));

const existingCompletedTasks = JSON.parse(
  localStorage.getItem("completed_tasks")
);

let tasks = existingTasks || [];
let completed_task_data = existingCompletedTasks || [];

/*********** Render existing data ***********/

tasks.forEach((existingTask) => {
  createCard(
    existingTask.title,
    existingTask.date,
    existingTask.tag,
    existingTask.color,
    appendToTasks,
    existingTask.id
  );
});

completed_task_data.forEach((existingTask) => {
  createCard(
    existingTask.title,
    existingTask.date,
    existingTask.tag,
    existingTask.color,
    appendToCompletedTasks,
    existingTask.id
  );
});

/*********** Event listeners ***********/

for (let i = 0; i < cardContainer.length; i++) {
  const container = cardContainer[i];
  container.addEventListener("dragover", function (e) {
    e.preventDefault();
  });

  container.addEventListener("dragenter", function (e) {
    e.preventDefault();
  });

  container.addEventListener("drop", function (e) {
    console.log(this);
    this.appendChild(draggedCard);
    if (container.className === "cardContainer completed_tasks") {
      completed_task_data.push(draggedCardInfo);
      localStorage.setItem(
        "completed_tasks",
        JSON.stringify(completed_task_data)
      );
      deleteFromTask(draggedCardInfo.id);
    } else {
      tasks.push(draggedCardInfo);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      deleteFromCompletedTask(draggedCardInfo.id);
    }
  });
}

button.addEventListener("click", (e) => {
  if (form_modal.style.visibility == "visible") {
    form_modal.style.visibility = "hidden";
  } else {
    form_modal.style.visibility = "visible";
  }
});

form_button.addEventListener("click", (e) => {
  e.preventDefault();
  //Generate unique ID

  let id = "id" + new Date().getTime();

  tasks.push({
    id: id,
    title: task_input.value,
    date: date_input.value,
    color: card_color.value,
    tag: [tag_input.value],
  });
  createCard(
    task_input.value,
    date_input.value,
    [tag_input.value],
    card_color.value,
    appendToTasks,
    id
  );

  task_input.value = "";
  date_input.value = "";
  tag_input.value = "";
  card_color.value = "";

  form_modal.style.visibility = "hidden";
});

/*********** Methods ***********/

function appendToTasks(card) {
  task.appendChild(card);

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function appendToCompletedTasks(card) {
  completed_task.appendChild(card);
}

function deleteFromTask(id) {
  tasks.splice(
    tasks.findIndex(function (i) {
      return i.id === id;
    }),
    1
  );
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function deleteFromCompletedTask(id) {
  completed_task_data.splice(
    completed_task_data.findIndex(function (i) {
      return i.id === id;
    }),
    1
  );
  localStorage.setItem("completed_tasks", JSON.stringify(completed_task_data));
}

function createCard(contents, dates, tags, color, appendMethod, id) {
  const card = document.createElement("div");
  card.classList.add("card");
  const card__color = document.createElement("div");
  card__color.classList.add("card__color");
  card__color.style.backgroundColor = color;
  const card__content = document.createElement("div");
  card__content.classList.add("card__content");
  const content = document.createElement("h2");
  content.innerHTML = contents;
  const date = document.createElement("p");
  date.classList.add("date");
  date.innerHTML = dates;
  card__content.append(content, date);
  card.append(card__color, card__content);
  const tag_div = document.createElement("div");
  tag_div.classList.add("tag_div");

  tags.forEach((tag) => {
    const tag_element = document.createElement("div");
    tag_element.classList.add("tag");
    tag_element.innerHTML = tag;
    tag_div.append(tag_element);
  });
  card.append(tag_div);

  card.setAttribute("draggable", true);

  card.addEventListener("dragstart", function (e) {
    draggedCard = card;
    draggedCardInfo = {
      id: id,
      title: contents,
      date: dates,
      color: color,
      tag: tags,
    };
    setTimeout(function () {
      card.style.display = "none";
    }, 0);
  });

  card.addEventListener("dragend", function () {
    setTimeout(() => {
      draggedCard.style.display = "block";
      draggedCard = null;
      draggedCardInfo = null;
    }, 0);
  });

  appendMethod(card);
}
