document.addEventListener('DOMContentLoaded', initializeApp);

const plank = document.getElementById('plank');
const logList = document.getElementById('drop-log'); 
const resetButton = document.getElementById('reset-button');

let objectsOnSeesaw = [];
const CONSTANT_BALL_WEIGHT = 1; 

function initializeApp() {
    const savedState = localStorage.getItem('seesawState');
    if (savedState) objectsOnSeesaw = JSON.parse(savedState);
    renderScreen();
}

resetButton.addEventListener('click', handleReset);
function handleReset() {
    objectsOnSeesaw = [];
    localStorage.removeItem('seesawState');
    renderScreen();
}

plank.addEventListener('click', handlePlankClick);
function handlePlankClick(event) {
    const plankWidth = plank.offsetWidth;
    const plankCenter = plankWidth / 2;
    const clickPosition = event.offsetX;
    const distanceFromCenter = clickPosition - plankCenter;

    const newObject = {
        weight: CONSTANT_BALL_WEIGHT,
        distance: distanceFromCenter
    };

    objectsOnSeesaw.push(newObject);
    localStorage.setItem('seesawState', JSON.stringify(objectsOnSeesaw));
    renderScreen();
}

function renderScreen() {
    plank.innerHTML = '';
    logList.innerHTML = '';

    objectsOnSeesaw.forEach(obj => {
        drawBall(obj.distance);
        addLogEntry(obj.distance);
    });
}

function drawBall(distance) {
    const ball = document.createElement('div');
    ball.className = 'weight-object';
    ball.style.left = `calc(50% + ${distance}px)`;
    plank.appendChild(ball);
}
function addLogEntry(distance) {
    const logItem = document.createElement('li');
    const side = distance < 0 ? 'Left' : 'Right';
    const positiveDistance = Math.abs(distance);
    logItem.textContent = `The ball fell ${side} px from the center, to do ${positiveDistance.toFixed(0)}side.`;
    logList.prepend(logItem);
}
