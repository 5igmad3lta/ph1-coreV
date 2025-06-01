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
    list.appendChild(item);
  })
}
