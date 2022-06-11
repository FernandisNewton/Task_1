//Selectors
const button = document.querySelector(".btn");
const task = document.querySelector(".tasks");
const completed_task = document.querySelector(".completed_tasks");
const form_button = document.querySelector(".form-button");
const card_color = document.querySelector(".card_color");
const date_input = document.querySelector(".date_input");
const tag_input = document.querySelector(".tag_input");
const task_input = document.querySelector(".task_input");
const form_modal = document.querySelector(".form_modal");

const existingTasks = JSON.parse(localStorage.getItem("tasks"));
const existingCompletedTasks = JSON.parse(
  localStorage.getItem("completed_tasks")
);
const taskData = existingTasks || [];

let tasks = [];
let completed_task_data = existingCompletedTasks || [];

function appendToTasks(card) {
  task.appendChild(card);

  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function appendToCompletedTasks(card) {
  completed_task.appendChild(card);
}

taskData.forEach((existingTask) => {
  createCard(
    existingTask.title,
    existingTask.date,
    existingTask.tag,
    existingTask.color,
    appendToTasks
  );
});

completed_task_data.forEach((existingTask) => {
  createCard(
    existingTask.title,
    existingTask.date,
    existingTask.tag,
    existingTask.color,
    appendToCompletedTasks
  );
});

function createCard(contents, dates, tags, color, appendMethod) {
  let id = "id" + new Date().getTime();

  tasks.push({
    id: id,
    title: contents,
    date: dates,
    color: color,
    tag: tags,
  });
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

  card.addEventListener("click", (event) => {
    //On Card click
    completed_task_data.push({
      id: id,
      title: contents,
      date: dates,
      color: color,
      tag: tags,
    });

    card.remove();
    completed_task.appendChild(card);

    localStorage.setItem(
      "completed_tasks",
      JSON.stringify(completed_task_data)
    );
  });

  appendMethod(card);
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
  createCard(
    task_input.value,
    date_input.value,
    [tag_input.value],
    card_color.value,
    appendToTasks
  );
  task_input.value = "";
  date_input.value = "";
  tag_input.value = "";
  card_color.value = "";

  form_modal.style.visibility = "hidden";
});
