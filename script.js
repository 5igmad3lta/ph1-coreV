document.addEventListener('DOMContentLoaded', () => {
    fetch("http://localhost:3000/exercises")
    .then(response => response.json())
    .then(data => renderDefault(data))
});

function renderDefault(data) {
  const list = document.getElementById('exercise-list');
  list.innerHTML = "";
  data.forEach((exercise) => {
    let item = document.createElement('li');
    item.textContent = exercise.name.toUpperCase();
    item.classList = "item";
    item.id = exercise.id;
    item.addEventListener('click', retrieveExercise)
    list.appendChild(item);
  })
}

function retrieveExercise(e) {
  fetch(`http://localhost:3000/exercises/${e.target.id}`)
  .then(res => res.json())
  .then(data => renderPage(data))
  }

  function renderPage(data) {
  document.getElementById('imgDefault').src = data.image;
  document.querySelector('div.title').textContent = data.name.toUpperCase();
  document.querySelector('div.title').id = data.id;
  document.querySelector('span#sets').textContent = data.sets;
  document.querySelector('span#reps').textContent = data.reps;
  let total = document.querySelector('span#volume')
  let max = document.getElementById('currentMax');
  max.textContent = data.max;
  total.textContent = (data.max * data.sets) * data.reps;
  const instructions = document.getElementById('instructions');
  instructions.innerHTML = "";
  data.instructions.forEach(line => {
    let item = document.createElement('li');
    item.textContent = line;
    instructions.appendChild(item);
  });
  const muscleTargets = document.getElementById('muscle-targets');
  muscleTargets.innerHTML = "";
  if(data.primary) {
    let target = "prim";
    createTag(data.primary, target)
  }
  if(data.secondary) {
    let target = "sec";
    createTag(data.secondary, target)
  }
}

function createTag(data, target) {
  data.forEach(line => {
    let tag = document.createElement('span');
    tag.textContent = line;
    tag.id = target
    document.getElementById('muscle-targets').appendChild(tag);
  })
}