let unit = 'kg';
let isLbs = false;
document.addEventListener('DOMContentLoaded', () => {
    fetch("http://localhost:3000/exercises")
    .then(response => response.json())
    .then(data => renderDefault(data))
});

function renderDefault(data) {
    // Use this code to grab and change the unit of measurement 
    document.querySelectorAll('input[name="toggle"]').forEach(radio => {
        radio.addEventListener('change', function(e) {
            let unitStatus  = e.target.nextElementSibling.innerText
            toggleUnit(unitStatus)
        })
    });
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
function toggleUnit(unitStatus) {
    let id = document.querySelector('div.title').id
    if(unitStatus === 'kg') {
        unit = 'kg';
        isLbs = false;
    } else {
        unit = 'lb';
        isLbs = true;
    }
    let form = document.querySelector('input#weight');
    form.placeholder = unit;
    if (id !== '') {
        convertUnits(id);
    }
};

function convertUnits(id) {
  fetch(`http://localhost:3000/exercises/${id}`)
  .then(res => res.json())
  .then(data => renderPage(data))
  }

function retrieveExercise(e) {
  fetch(`http://localhost:3000/exercises/${e.target.id}`)
  .then(res => res.json())
  .then(data => renderPage(data))
  }

function renderPage(data) {
  document.getElementById('difference').textContent = "";
  document.getElementById('imgDefault').src = data.image;
  document.querySelector('div.title').textContent = data.name.toUpperCase();
  document.querySelector('div.title').id = data.id;
  document.querySelector('span#sets').textContent = data.sets;
  document.querySelector('span#reps').textContent = data.reps;
  let total = document.querySelector('span#volume');
  let max = document.getElementById('currentMax');
  if (isLbs) {
    max.textContent = Math.round(data.max * 2.205) + " " + unit;
    total.textContent = Math.round((data.max * 2.205) * data.reps) * data.sets + " " + unit;
  } else if (!isLbs) {
    max.textContent = data.max + ' ' + unit;
    total.textContent = (data.max * data.sets) * data.reps + ' ' + unit;
  }
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

// submit handler
document.addEventListener('DOMContentLoaded', () => {
  let form = document.querySelector('form.form-container')
  form.addEventListener('submit', (e) => {
    e.preventDefault()
    console.log(e.target)
    if(document.querySelector('div.title').id === '') {
        alert(`Choose an exercise first!`)
        return;
    } else {
        let weight = parseInt(e.target[0].value);
        let sets = parseInt(e.target[1].value);
        let reps = parseInt(e.target[2].value);
        handleSubmit(weight, sets, reps)
        form.reset()
    }
  })
})

function handleSubmit(weight, sets, reps) {
    if (isNaN(weight) || isNaN(sets)|| isNaN(reps)) {
        alert(`Please enter valid numbers!`)
        return;
    } else {
      weight = checkForConversion(weight);
      let id = document.querySelector('div.title').id;
      fetch(`http://localhost:3000/exercises/${id}`,{
        method: "PATCH",
        headers:{
            "Content-Type": "application/json",
            "Accept": "application/json",
        },
        body: JSON.stringify({
            max: weight,
            sets: sets,
            reps: reps
        })
    })
    .then(res => res.json())
    .then(data => updateLog(data))
  }
}

function updateLog(data) {
    let volume = parseInt(document.querySelector('span#volume').textContent);
    volume = checkForConversion(volume);
    let indicator = document.querySelector('span#difference');
    if(data.max) {
        renderPage(data)
        let difference = parseInt(((data.max * data.reps) * data.sets) - volume);
        console.log(difference)
        if(difference > 0) {
            indicator.textContent = " ▲" + difference + unit;
            indicator.className = "positive"
            console.log(indicator)
            } else if ( difference < 0) {
            indicator.textContent = " ▼" + Math.abs(difference) + unit
            indicator.className = "negative"
            console.log(indicator)
            } else {
            indicator.className = "neutral"
            console.log(indicator)
            }
    }
}

function checkForConversion(number) {
  if (isLbs) {
    return Math.round(number * 0.453);
  } else {
    return number;
  }
}

