document.addEventListener('DOMContentLoaded', initializeApp);

const plank = document.getElementById('plank');
const logList = document.getElementById('drop-log'); 
const resetButton = document.getElementById('reset-button');
const leftWeightBox = document.getElementById('left-weight');
const rightWeightBox = document.getElementById('right-weight');
const tiltAngleBox = document.getElementById('tilt-angle');
const nextWeightBox = document.getElementById('next-weight');
const seesawArea = document.getElementById('seesaw-area');
const dropSound = new Audio('sounds/blub.wav');
const ballColors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'cyan', 'brown', 'gray'];

let objectsOnSeesaw = [];
let nextWeight;

function initializeApp() {
    const savedState = localStorage.getItem('seesawState');
    if (savedState) objectsOnSeesaw = JSON.parse(savedState);
    renderScreen();
    generateNewNextWeight();
}

resetButton.addEventListener('click', handleReset);
function handleReset() { 
    objectsOnSeesaw = [];
    localStorage.removeItem('seesawState');
    renderScreen();
    generateNewNextWeight();
}

plank.addEventListener('click', handlePlankClick);
function handlePlankClick(event) {
    if (event.target !== plank) {return;}

    dropSound.currentTime = 0;
    dropSound.play();

    const plankWidth = plank.offsetWidth;
    const plankCenter = plankWidth / 2;
    const clickPosition = event.offsetX;
    const distanceFromCenter = clickPosition - plankCenter;

    const newObject = {
        weight: nextWeight,
        distance: distanceFromCenter
    };

    objectsOnSeesaw.push(newObject);
    localStorage.setItem('seesawState', JSON.stringify(objectsOnSeesaw));
    renderScreen();
    generateNewNextWeight();
}

function renderScreen() {
    plank.innerHTML = '';
    logList.innerHTML = '';

    let totalLeftTorque = 0;
    let totalRightTorque = 0;

    let totalLeftWeight = 0;
    let totalRightWeight = 0;


    objectsOnSeesaw.forEach(obj => {
        drawBall(obj.distance, obj.weight);
        addLogEntry(obj.distance, obj.weight);

        const torque = obj.weight * obj.distance;

        if(obj.distance<0){
            totalLeftTorque  += (torque * -1);
            totalLeftWeight += obj.weight;
        }
        else{
            totalRightTorque += torque;
            totalRightWeight += obj.weight;
        }
    });
    const torqueDifferance = totalRightTorque - totalLeftTorque;

    const angle = Math.max(-30, Math.min(30, torqueDifferance/10));

    plank.style.transform = `rotate(${angle}deg)`;

    leftWeightBox.textContent = `${totalLeftWeight.toFixed(1)} kg`;
    rightWeightBox.textContent = `${totalRightWeight.toFixed(1)} kg`;
    tiltAngleBox.textContent = `${angle.toFixed(1)}°`;

}

function drawBall(distance, weight) {
    const ball = document.createElement('div');
    ball.className = 'weight-object';
    ball.style.left = `calc(50% + ${distance}px)`;

    const baseSize = 25;
    const scaleFactor = 3;
    const diameter = baseSize + ((weight-1) * scaleFactor);

    ball.style.width = `${diameter}px` ;
    ball.style.height = `${diameter}px`;
    ball.textContent = weight;
    ball.style.backgroundColor = ballColors[weight - 1];

    plank.appendChild(ball);
}

function addLogEntry(distance, weight) {
    const logItem = document.createElement('li');
    const side = distance < 0 ? 'Left' : 'Right';
    const positiveDistance = Math.abs(distance);
    logItem.textContent = `${weight}kg dropped on ${side} side ${positiveDistance.toFixed(0)}px from center`;
    logList.prepend(logItem);
}

function generateNewNextWeight(){
    nextWeight = Math.floor(Math.random() * 10) +1;
    nextWeightBox.textContent = `${nextWeight} kg`;
}
