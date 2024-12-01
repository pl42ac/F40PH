


// Labels and coordinates

const labels = [
    { name: "Toilet", coords: [143, 270, 245, 326] },
    { name: "Battery", coords: [1079, 377, 1162, 435] },
    { name: "Control Stand", coords: [283, 163, 371, 258] },
    { name: "Truck", coords: [263, 377, 680, 467] },
    { name: "Electrical Cabinet", coords: [466, 107, 526, 258] },
    { name: "Inertial Filter Blower", coords: [586, 39, 728, 92] },
    { name: "Engine Air Filter", coords: [536, 97, 586, 159] },
    { name: "Traction Motor Blower", coords: [591, 136, 645, 240] },
    { name: "Generator Blower", coords: [654, 137, 684, 249] },
    { name: "Main Generator", coords: [698, 308, 763, 357] },
    { name: "AC Auxiliary Generator", coords: [692, 144, 761, 245] },
    { name: "Exhaust Silencer", coords: [742, 23, 845, 126] },
    { name: "Starting Motors", coords: [849, 268, 900, 329] },
    { name: "Fuel Tank", coords: [734, 375, 1034, 467] },
    { name: "Diesel Engine", coords: [868, 161, 1253, 272] },
    { name: "Air Reservoirs", coords: [1175, 377, 1322, 467] },
    { name: "Lube Oil Strainer", coords: [1265, 260, 1339, 331] },
    { name: "Equipment Rack", coords: [1347, 249, 1458, 333] },
    { name: "Dynamic Brake Blower", coords: [994, 35, 1228, 109] },
    { name: "Radiator Cooling Fans", coords: [1294, 36, 1771, 73] },
    { name: "Radiators", coords: [1298, 79, 1563, 139] },
    { name: "Air Compressor", coords: [1495, 229, 1573, 334] },
    { name: "Kim Hot Start", coords: [1593, 207, 1636, 287] },
    { name: "HEP Cooling Fan", coords: [1784, 38, 1938, 76] },
    { name: "HEP Radiator", coords: [1802, 85, 1892, 153] },
    { name: "HEP Engine", coords: [1800, 193, 1898, 307] },
    { name: "HEP Generator", coords: [1660, 217, 1757, 301] },
    { name: "HEP Exhaust", coords: [1593, 112, 1791, 157] },
    { name: "HEP Electrical Cabinet", coords: [1637, 164, 1687, 203] },
    { name: "HEP Air Reservoir", coords: [1041, 361, 1070, 460] },
    { name: "HEP Expansion Tank", coords: [1900, 85, 1939, 153] },
    { name: "Sand Boxes", coords: [1895, 167, 1949, 235] },
];




let currentIndex = 0;
const missedLabels = []; // Track missed labels
let correctCount = 0;
let incorrectCount = 0;

// Shuffle the labels array
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Shuffle labels before starting the quiz
shuffle(labels);

// Set the initial question
function setQuestion() {
    if (currentIndex < labels.length) {
        document.getElementById("question").textContent = `Click on: ${labels[currentIndex].name}`;
    } else {
        endQuiz();
    }
}

// Add a highlight for correct or incorrect answers
function addHighlight(coords, container, color, label = null) {
    const diagram = document.getElementById("diagram");
    const scaleX = diagram.clientWidth / diagram.naturalWidth;
    const scaleY = diagram.clientHeight / diagram.naturalHeight;

    const x1 = coords[0] * scaleX;
    const y1 = coords[1] * scaleY;
    const x2 = coords[2] * scaleX;
    const y2 = coords[3] * scaleY;

    const highlight = document.createElement("div");
    highlight.classList.add("highlight");
    highlight.style.left = `${x1}px`;
    highlight.style.top = `${y1}px`;
    highlight.style.width = `${x2 - x1}px`;
    highlight.style.height = `${y2 - y1}px`;
    highlight.style.borderColor = color;
    highlight.style.backgroundColor = color === "green" ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)";

    if (label) {
        highlight.addEventListener("mouseover", () => {
            label.style.display = "block";
            label.style.left = `${x2 + 5}px`; // Position label to the right of the highlight
            label.style.top = `${y1}px`; // Align vertically
        });
        highlight.addEventListener("mouseout", () => {
            label.style.display = "none";
        });
    }

    container.appendChild(highlight);
    return highlight; // Return the highlight for additional controls
}

// End the quiz and display the summary
function endQuiz() {
    const questionElement = document.getElementById("question");
    const feedbackElement = document.getElementById("feedback");
    const diagramContainer = document.getElementById("diagram-container");

    const score = ((correctCount / labels.length) * 100).toFixed(2); // Calculate score percentage

    questionElement.textContent = "Quiz Completed!";
    feedbackElement.innerHTML = `
        <p>Score: ${score}%</p>
        <p>Correct: ${correctCount}</p>
        <p>Incorrect: ${incorrectCount}</p>
        <p>Missed Labels:</p>
        <ul>
            ${missedLabels
                .map(
                    (label) =>
                        `<li class="missed-label" data-label="${label.name}">${label.name}</li>`
                )
                .join("")}
        </ul>
    `;

    // Highlight missed areas in red when hovered and show labels
    const missedLabelElements = document.querySelectorAll(".missed-label");
    missedLabelElements.forEach((element) => {
        const label = labels.find((l) => l.name === element.dataset.label);
        let tempHighlight = null; // Track the temporary highlight
        let tempLabel = null; // Track the temporary label
        element.addEventListener("mouseover", () => {
            tempHighlight = addHighlight(label.coords, diagramContainer, "red");
            tempLabel = document.createElement("div");
            tempLabel.classList.add("label");
            tempLabel.textContent = label.name;
            tempLabel.style.left = `${tempHighlight.style.left}`;
            tempLabel.style.top = `${parseInt(tempHighlight.style.top) + 20}px`; // Below the highlight
            diagramContainer.appendChild(tempLabel);
        });
        element.addEventListener("mouseout", () => {
            if (tempHighlight) tempHighlight.remove(); // Remove the highlight
            if (tempLabel) tempLabel.remove(); // Remove the label
        });
    });
}

// Start the quiz
setQuestion();

function checkAnswer(isCorrect) {
    const feedback = document.getElementById("feedback");
    const diagramContainer = document.getElementById("diagram-container");
    const currentLabel = labels[currentIndex];

    if (isCorrect) {
        feedback.textContent = "Correct!";
        feedback.style.color = "green";
        correctCount++;

        const label = document.createElement("div");
        label.classList.add("label");
        label.textContent = currentLabel.name;
        label.style.display = "none";

        addHighlight(currentLabel.coords, diagramContainer, "green", label);
        diagramContainer.appendChild(label);
    } else {
        feedback.textContent = "Incorrect! Moving to the next label.";
        feedback.style.color = "red";
        incorrectCount++;
        missedLabels.push(currentLabel);
    }

    currentIndex++;
    setQuestion();
}

const diagram = document.getElementById("diagram");
diagram.addEventListener("click", (event) => {
    const scaleX = diagram.naturalWidth / diagram.clientWidth;
    const scaleY = diagram.naturalHeight / diagram.clientHeight;

    const x = Math.round(event.offsetX * scaleX);
    const y = Math.round(event.offsetY * scaleY);

    const coords = labels[currentIndex].coords;

    // Check if the click is within the bounds
    const isCorrect =
        x >= coords[0] && x <= coords[2] && y >= coords[1] && y <= coords[3];

    checkAnswer(isCorrect);
});
