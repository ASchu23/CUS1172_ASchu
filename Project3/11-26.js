
const API_URL = "https://my-json-server.typicode.com/ASchu23/Project3"; 


let state = {
    userName: "",
    burgerBase: null,
    currentStepIndex: 0,
    stepIds: [],
    selections: [],
    isComplete: false
};

function resetState() {
    state = {
        userName: "",
        burgerBase: null,
        currentStepIndex: 0,
        stepIds: [],
        selections: [],
        isComplete: false
    };
}

function setUserName(name) {
    state.userName = name;
}

async function getBurgers() {
    const response = await fetch(`${API_URL}/burgers`);
    return await response.json();
}

async function getStepById(stepId) {
    const response = await fetch(`${API_URL}/steps/${stepId}`);
    return await response.json();
}

function addSelection(value) {
    state.selections.push(value);
}

function setBurgerBase(burgerObj) {
    state.burgerBase = burgerObj.title;
    state.stepIds = burgerObj.stepIds;
}

function hasNextStep() {
    return state.currentStepIndex < state.stepIds.length;
}

function getCurrentStepId() {
    return state.stepIds[state.currentStepIndex];
}

function advanceStep() {
    state.currentStepIndex++;
}

// View variables
let appContainer = document.getElementById('app-container');
let summaryContainer = document.getElementById('summary-content');

function renderStart() {
    appContainer.innerHTML = `
        <div class="text-center mt-5">
            <h1 class="display-4">Welcome to BurgerBuilder</h1>
            <p class="lead">Please enter your name to get started.</p>
            <div class="input-group mb-3 w-50 mx-auto">
                <input type="text" id="username-input" class="form-control" placeholder="Your Name">
                <button class="btn btn-primary" onclick="startOrder()">Start Ordering</button>
            </div>
        </div>`;
}

function renderMenu(burgers) {
    const cardsHtml = burgers.map(burger => `
        <div class="col-md-6">
            <div class="card mb-4 shadow-sm" style="cursor: pointer;" onclick="selectBurger('${burger.id}')">
                <img src="${burger.image}" class="card-img-top" alt="${burger.title}">
                <div class="card-body text-center">
                    <h5 class="card-title">${burger.title}</h5>
                    <p class="card-text">${burger.description}</p>
                    <button class="btn btn-outline-primary">Select</button>
                </div>
            </div>
        </div>
    `).join('');

    appContainer.innerHTML = `
        <h2 class="text-center mb-4">Choose Your Base</h2>
        <div class="row">
            ${cardsHtml}
        </div>`;
}

function renderStep(stepData, stepNumber) {
    let inputHtml = '';

    if (stepData.type === 'multiple-choice') {
        inputHtml = `<div class="d-grid gap-2 col-6 mx-auto">`;
        stepData.options.forEach(opt => {
            inputHtml += `<button class="btn btn-lg btn-outline-dark mb-2" onclick="handleInput('${opt}')">${opt}</button>`;
        });
        inputHtml += `</div>`;
    } 
    else if (stepData.type === 'text') {
        inputHtml = `
            <div class="w-50 mx-auto">
                <input type="number" id="step-input-text" class="form-control mb-3" placeholder="Enter amount...">
                <button class="btn btn-success" onclick="handleTextInput()">Next</button>
            </div>`;
    } 
    else if (stepData.type === 'image-selection') {
        inputHtml = `<div class="row justify-content-center">`;
        stepData.options.forEach(opt => {
            inputHtml += `
                <div class="col-4">
                    <div class="card h-100 option-card" onclick="handleInput('${opt.label}')">
                        <img src="${opt.img}" class="card-img-top p-2" alt="${opt.label}">
                        <div class="card-body">
                            <p class="card-text fw-bold">${opt.label}</p>
                        </div>
                    </div>
                </div>`;
        });
        inputHtml += `</div>`;
    }

    appContainer.innerHTML = `
        <div class="step-container text-center fade-in">
            <h3>Step ${stepNumber}: ${stepData.instruction}</h3>
            <div class="mt-4">
                ${inputHtml}
            </div>
        </div>`;
}

function renderFeedback(message, isError) {
    const alertType = isError ? "warning" : "success";
    const title = isError ? "Wait a second..." : "Success!";
    const btnHtml = isError ? `<button class="btn btn-dark mt-3" onclick="resolveFeedback()">Got it</button>` : '';

    appContainer.innerHTML = `
        <div class="alert alert-${alertType} text-center mt-5" role="alert">
            <h4 class="alert-heading">${title}</h4>
            <p>${message}</p>
            ${btnHtml}
        </div>`;
}

function renderEnd(name, isComplete) {
    let contentHtml = '';
    if (isComplete) {
        contentHtml = `
            <h1 class="text-success">Thank you, ${name}!</h1>
            <p class="lead">Your burger is on the grill!</p>`;
    } else {
        contentHtml = `
            <h1 class="text-warning">${name}...</h1>
            <p class="lead">You skipped a few steps. Retry?</p>`;
    }

    appContainer.innerHTML = `
        <div class="text-center mt-5">
            ${contentHtml}
            <hr>
            <button class="btn btn-primary btn-lg" onclick="init()">Start New Order</button>
        </div>`;
}

function renderSummary(stateObj) {
    const name = stateObj.userName || "Guest";
    let itemsHtml = '';
    
    if (stateObj.selections.length > 0) {
        itemsHtml = '<ul class="list-group list-group-flush">';
        stateObj.selections.forEach(item => {
            itemsHtml += `<li class="list-group-item bg-light p-1">${item}</li>`;
        });
        itemsHtml += '</ul>';
    }

    summaryContainer.innerHTML = `
        <p><strong>Customer:</strong> ${name}</p>
        ${stateObj.burgerBase ? `<p><strong>Base:</strong> ${stateObj.burgerBase}</p><hr>` : ''}
        ${stateObj.selections.length > 0 ? `<h6>Ingredients:</h6>` : ''}
        ${itemsHtml}`;
}

let currentStepData = null;

function init() {
    resetState();
    renderSummary(state);
    renderStart();
}

function startOrder() {
    const nameInput = document.getElementById('username-input');
    const name = nameInput.value.trim();
    
    if (name) {
        setUserName(name);
        renderSummary(state);
        loadMenu();
    } else {
        alert("Enter your name.");
    }
}

async function loadMenu() {
    try {
        const burgers = await getBurgers();
        renderMenu(burgers);
    } catch (error) {
        console.error("Error loading menu:", error);
        document.getElementById('app-container').innerHTML = "<p class='text-danger'>Error loading API data.</p>";
    }
}

async function selectBurger(burgerId) {
    const burgers = await getBurgers();
    const selected = burgers.find(b => b.id === burgerId);
    
    setBurgerBase(selected);
    renderSummary(state);
    loadNextStep();
}

async function loadNextStep() {
    if (hasNextStep()) {
        const stepId = getCurrentStepId();
        const stepData = await getStepById(stepId);
        
        currentStepData = stepData;
        const stepNum = state.currentStepIndex + 1;
        
        renderStep(stepData, stepNum);
    } else {
        finishOrder(true);
    }
}

function handleInput(inputValue) {
    if (currentStepData.feedback && 
        inputValue >= parseInt(currentStepData.feedback.triggerValue)) {
        
        renderFeedback(currentStepData.feedback.message, true);
        addSelection(inputValue + " (Warning Given)");
    } else {
        addSelection(inputValue);
        renderSummary(state);
        
        renderFeedback("Great choice", false);
        
        setTimeout(() => {
            advanceStep();
            loadNextStep();
        }, 1000);
    }
}

function handleTextInput() {
    const input = document.getElementById('step-input-text');
    if(input.value) {
        handleInput(input.value);
    }
}

function resolveFeedback() {
    advanceStep();
    loadNextStep();
}

function finishOrder(isComplete) {
    state.isComplete = isComplete;
    renderEnd(state.userName, isComplete);
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});
