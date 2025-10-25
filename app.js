document.addEventListener('DOMContentLoaded', initializeApp);

const plank = document.getElementById('plank');
const logList = document.getElementById('drop-log'); 
const resetButton = document.getElementById('reset-button');
const leftWeightBox = document.getElementById('left-weight');
const rightWeightBox = document.getElementById('right-weight');
const tiltAngleBox = document.getElementById('tilt-angle');
const nextWeightBox = document.getElementById('next-weight');

let objectsOnSeesaw = [];
let nextWeight = 1;

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

    leftWeightBox.textContent = '0.0 kg';
    rightWeightBox.textContent = '0.0 kg';
    tiltAngleBox.textContent = '0.0°';
}

plank.addEventListener('click', handlePlankClick);
function handlePlankClick(event) {
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
}

function renderScreen() {
    plank.innerHTML = '';
    logList.innerHTML = '';

    let totalLeftTorque = 0;
    let totalRightTorque = 0;

    let totalLeftWeight = 0;
    let totalRightWeight = 0;


    objectsOnSeesaw.forEach(obj => {
        drawBall(obj.distance);
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

function drawBall(distance) {
    const ball = document.createElement('div');
    ball.className = 'weight-object';
    ball.style.left = `calc(50% + ${distance}px)`;
    plank.appendChild(ball);
}
function addLogEntry(distance, weight) {
    const logItem = document.createElement('li');
    const side = distance < 0 ? 'Left' : 'Right';
    const positiveDistance = Math.abs(distance);
    logItem.textContent = `${weight}kg dropped on ${side} side ${positiveDistance.toFixed(0)}px from center`;
    logList.prepend(logItem);
}
