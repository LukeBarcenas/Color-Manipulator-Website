// Variables
const redSlider = document.getElementById('red-slider');
const greenSlider = document.getElementById('green-slider');
const blueSlider = document.getElementById('blue-slider');
const colorSquare = document.getElementById('color-square');
const hexCode = document.getElementById('hex-code');
const redPercentElem = document.getElementById('red-percent');
const greenPercentElem = document.getElementById('green-percent');
const bluePercentElem = document.getElementById('blue-percent');
const hexValueElem = document.getElementById('hex-value');
const decimalValueElem = document.getElementById('decimal-value');
const binaryValueElem = document.getElementById('binary-value');
const octalValueElem = document.getElementById('octal-value');
const hrElements = document.getElementsByClassName('colored-hr');

// Variables for swapped color boxes
const colorRbg = document.getElementById('color-rbg');
const colorBrg = document.getElementById('color-brg');
const colorBgr = document.getElementById('color-bgr');
const colorGrb = document.getElementById('color-grb');
const colorGbr = document.getElementById('color-gbr');

// Game Logic
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('start-game').addEventListener('click', startGame);
    document.getElementById('restart-game').addEventListener('click', restartGame);
    document.getElementById('return-to-name').addEventListener('click', returnToName);

    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => option.addEventListener('click', checkColor));

    let userColor, userRGB, score, correctHex;

    function startGame() {
        const userName = document.getElementById('user-name').value;
        if (userName.trim() === '') {
            alert('Please enter a name.');
            return;
        }

        userColor = getUserColor(userName);
        userRGB = userColor.match(/\d+/g).map(Number);
        score = 0;
        document.getElementById('score').textContent = `Score: ${score}`;

        document.getElementById('user-color').style.backgroundColor = userColor;
        document.getElementById('user-hex').textContent = rgbToHex(userRGB);
        generateColorOptions();

        document.getElementById('name-entry').style.display = 'none';
        document.getElementById('game-content').style.display = 'block';
        document.getElementById('restart-game').style.display = 'none';
        document.getElementById('return-to-name').style.display = 'none';
        document.querySelectorAll('#game-content > *:not(.bottom-buttons)').forEach(element => {
            element.style.display = '';
        });
    }

    function getUserColor(name) {
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }

        const ranges = [
            { min: 0, max: 50 },
            { min: 51, max: 150 },
            { min: 151, max: 255 }
        ];

        const shuffledRanges = shuffleRanges(ranges, hash);

        const r = hashColorValue(hash, shuffledRanges[0]);
        const g = hashColorValue(hash >> 8, shuffledRanges[1]);
        const b = hashColorValue(hash >> 16, shuffledRanges[2]);

        return `rgb(${r}, ${g}, ${b})`;
    }

    function shuffleRanges(ranges, hash) {
        const shuffled = [...ranges];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = (hash % (i + 1) + i) % shuffled.length;
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            hash = Math.floor(hash / 10);
        }
        return shuffled;
    }

    function hashColorValue(hash, range) {
        return range.min + (Math.abs(hash) % (range.max - range.min + 1));
    }

    function rgbToHex(rgb) {
        return `#${rgb.map(v => v.toString(16).padStart(2, '0')).join('')}`;
    }

    function generateColorOptions() {
        const options = [];

        while (options.length < 3) {
            const randomColor = [randomValue(100, 255), randomValue(100, 255), randomValue(100, 255)];
            options.push(randomColor);
        }

        options.sort(() => Math.random() - 0.5);

        let minDifference = Infinity;
        options.forEach((color, index) => {
            const optionElement = document.getElementById(`option-${index + 1}`);
            const optionHexElement = document.getElementById(`option-${index + 1}-hex`);
            if (optionElement) {
                optionElement.style.backgroundColor = `rgb(${color.join(',')})`;
                optionElement.dataset.rgb = JSON.stringify(color);
                const hex = rgbToHex(color);
                optionHexElement.textContent = hex;

                // Calculate the difference for correctHex identification
                const difference = calculateDifference(userRGB, color);
                if (difference < minDifference) {
                    minDifference = difference;
                    correctHex = hex;
                }
            }
        });
    }

    function randomValue(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function checkColor(event) {
        const selectedColor = event.target.dataset.rgb ? JSON.parse(event.target.dataset.rgb) : null;
        if (selectedColor) {
            const selectedDifference = calculateDifference(userRGB, selectedColor);
            const differences = Array.from(colorOptions).map(option => {
                const color = JSON.parse(option.dataset.rgb);
                return calculateDifference(userRGB, color);
            });
            const minDifference = Math.min(...differences);

            if (selectedDifference === minDifference) {
                score++;
                document.getElementById('score').textContent = `Score: ${score}`;
                generateColorOptions();
            } else {
                alert(`Incorrect! The correct color was ${correctHex}. You can restart the game or return to name selection.`);
                document.querySelectorAll('#game-content > *:not(.bottom-buttons)').forEach(element => {
                    element.style.display = 'none';
                });
                document.getElementById('restart-game').style.display = 'inline-block';
                document.getElementById('return-to-name').style.display = 'inline-block';
            }
        }
    }

    function calculateDifference(color1, color2) {
        return Math.abs(color1[0] - color2[0]) + Math.abs(color1[1] - color2[1]) + Math.abs(color1[2] - color2[2]);
    }

    function restartGame() {
        score = 0;
        document.getElementById('score').textContent = `Score: ${score}`;
        document.getElementById('restart-game').style.display = 'none';
        document.getElementById('return-to-name').style.display = 'none';
        document.querySelectorAll('#game-content > *:not(.bottom-buttons)').forEach(element => {
            element.style.display = '';
        });
        generateColorOptions();
    }

    function returnToName() {
        document.getElementById('name-entry').style.display = 'block';
        document.getElementById('game-content').style.display = 'none';
        document.getElementById('user-name').value = '';
    }
});

// Update color function
function updateColor() {
    const red = parseInt(redSlider.value);
    const green = parseInt(greenSlider.value);
    const blue = parseInt(blueSlider.value);

    // Update color square
    colorSquare.style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;

    // Convert RGB to Hex
    const hex = rgbToHex(red, green, blue);
    hexCode.textContent = `#${hex}`;
    hexValueElem.textContent = `#${hex}`;

    // Calculate percentages
    const total = red + green + blue;
    const redPercent = ((red / total) * 100).toFixed(0);
    const greenPercent = ((green / total) * 100).toFixed(0);
    const bluePercent = ((blue / total) * 100).toFixed(0);

    // Display percentages
    if (red === 0 && green === 0 && blue === 0) {
        redPercentElem.textContent = `0%`;
        greenPercentElem.textContent = `0%`;
        bluePercentElem.textContent = `0%`;
    }
    else {
        redPercentElem.textContent = `${redPercent}%`;
        greenPercentElem.textContent = `${greenPercent}%`;
        bluePercentElem.textContent = `${bluePercent}%`;
    }

    // Convert RGB to Decimal, Binary, and Octal
    const decimal = red * 65536 + green * 256 + blue;
    decimalValueElem.textContent = decimal;
    binaryValueElem.textContent = decimal.toString(2).padStart(24, '0');
    octalValueElem.textContent = decimal.toString(8).padStart(8, '0');

    document.querySelector('nav').style.borderColor = `rgb(${red}, ${green}, ${blue})`;

    // Update background color of each icon-wrapper
    document.getElementById('github-icon').style.backgroundColor = `rgb(${blue}, ${red}, ${green})`;
    document.getElementById('linkedin-icon').style.backgroundColor = `rgb(${red}, ${green}, ${blue})`;
    document.getElementById('mail-icon').style.backgroundColor = `rgb(${green}, ${blue}, ${red})`;

    // Update background color of hr
    Array.from(hrElements).forEach(hr => {
        hr.style.borderColor = `rgb(${red}, ${green}, ${blue})`;
    });

    // Update swapped color boxes
    colorRbg.style.backgroundColor = `rgb(${red}, ${blue}, ${green})`;
    colorBrg.style.backgroundColor = `rgb(${blue}, ${red}, ${green})`;
    colorBgr.style.backgroundColor = `rgb(${blue}, ${green}, ${red})`;
    colorGrb.style.backgroundColor = `rgb(${green}, ${red}, ${blue})`;
    colorGbr.style.backgroundColor = `rgb(${green}, ${blue}, ${red})`;

    // Update the colors of the name parts
    document.getElementById('name-part-1').style.color = `rgb(${red}, ${green}, ${blue})`;
    document.getElementById('name-part-2').style.color = `rgb(${red}, ${blue}, ${green})`;
    document.getElementById('name-part-3').style.color = `rgb(${blue}, ${red}, ${green})`;
    document.getElementById('name-part-4').style.color = `rgb(${blue}, ${green}, ${red})`;
    document.getElementById('name-part-5').style.color = `rgb(${green}, ${red}, ${blue})`;
    document.getElementById('name-part-6').style.color = `rgb(${green}, ${blue}, ${red})`;

    // Check for secrets
    checkForSecrets(red, green, blue);

    // Update contact links if color is too dark
    if (red < 65 && green < 65 && blue < 65) {
        document.querySelectorAll('.icon').forEach(icon => {
            icon.style.backgroundColor = 'white'; 
            icon.style.color = 'black'; 
            icon.style.borderRadius = '25%'; 
        });
    } 
    else {
        document.querySelectorAll('.icon').forEach(icon => {
            icon.style.backgroundColor = ''; 
            icon.style.color = ''; 
            icon.style.borderRadius = '25%'; 
        });
    }
}

// RGB to Hex conversion function
function rgbToHex(r, g, b) {
    // Convert each color component to hexadecimal
    const redHex = Number(r).toString(16).padStart(2, '0');
    const greenHex = Number(g).toString(16).padStart(2, '0');
    const blueHex = Number(b).toString(16).padStart(2, '0');
    
    // Concatenate the hex values
    return redHex + greenHex + blueHex;
}

// Randomize RGB values function
function randomizeRGBValues() {
    const randomRed = Math.floor(Math.random() * 256);
    const randomGreen = Math.floor(Math.random() * 256);
    const randomBlue = Math.floor(Math.random() * 256);

    redSlider.value = randomRed;
    greenSlider.value = randomGreen;
    blueSlider.value = randomBlue;

    updateColor();
}

// Check for secret messages and animations
function checkForSecrets(red, green, blue) {
    const message = document.createElement('div');
    message.classList.add('secret-message');

    if (red === 255 && green === 255 && blue === 255) {
        message.textContent = 'Pure White';
        message.style.color = 'black';
    }
    else if (red === 255 && green === 0 && blue === 0) {
        message.textContent = 'Pure Red';
        message.style.color = 'white';
    } else if (red === 0 && green === 255 && blue === 0) {
        message.textContent = 'Pure Green';
        message.style.color = 'white';
    } else if (red === 0 && green === 0 && blue === 255) {
        message.textContent = 'Pure Blue';
        message.style.color = 'white';
    } else if (red === 0 && green === 0 && blue === 0) {
        message.textContent = 'Pure Black';
        message.style.color = 'white';
    } 
    else if(red === 255 && blue === 255 && green === 0) {
        message.textContent = 'Magenta';
        message.style.color = 'white';    
    }
    else if(red === 255 && green === 255 && blue === 0) {
        message.textContent = 'Yellow';
        message.style.color = 'black';    
    }
    else if(green === 255 && blue === 255 && red === 0) {
        message.textContent = 'Cyan';
        message.style.color = 'white';    
    }
    else if (red === green && green === blue) {
        if (red < 32) {
            message.textContent = 'Black';
            message.style.color = 'white';
        } else if (red < 85) {
            message.textContent = 'Dark Gray';
            message.style.color = 'white';
        } else if (red < 187) {
            message.textContent = 'Gray';
            message.style.color = 'white';
        } else if (red < 236) {
            message.textContent = 'Light Gray';
            message.style.color = 'black';
        } else if (red < 255) {
            message.textContent = 'White';
            message.style.color = 'black';
        }
    }

    if (message.textContent) {
        colorSquare.innerHTML = '';
        colorSquare.appendChild(message);
        fadeInMessage(message);
    } else {
        colorSquare.innerHTML = '';
    }
}

// Fade in message
function fadeInMessage(message) {
    message.style.opacity = 0;
    message.style.transition = 'opacity 1s';
    message.style.position = 'relative';
    message.style.zIndex = 1;
    message.style.textAlign = 'center';
    message.style.fontSize = '2em';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';

    setTimeout(() => {
        message.style.opacity = 1;
    }, 10);
}

// Event listeners for sliders
redSlider.addEventListener('input', updateColor);
greenSlider.addEventListener('input', updateColor);
blueSlider.addEventListener('input', updateColor);

// Event listener for randomize button
document.getElementById('randomize-colors-toggle').addEventListener('click', randomizeRGBValues);

// Initial color update
updateColor();

// Night mode implementation
document.getElementById('night-mode-toggle').addEventListener('click', function() {
    const body = document.body;
    body.classList.toggle('night-mode');
    
    // Toggle night mode for navigation
    document.querySelector('nav').classList.toggle('night-mode');

    // Toggle night mode for links
    const links = document.querySelectorAll('.links a');
    links.forEach(link => link.classList.toggle('night-mode'));

    // Toggle night mode for moon icon
    const modeIcon = document.getElementById('mode-icon');
    modeIcon.src = body.classList.contains('night-mode') ? 'images/moon-light.png' : 'images/moon-dark.png';

    // Toggle night mode for dice icon
    const diceIcon = document.getElementById('dice-icon');
    diceIcon.src = body.classList.contains('night-mode') ? 'images/dice-light.png' : 'images/dice-dark.png';

    // Toggle outline color for "By:"
    const byElement = document.querySelector('#colorful-name span#by');
    if (body.classList.contains('night-mode')) {
        byElement.style.webkitTextStroke = '1px black';
    } else {
        byElement.style.webkitTextStroke = '1px white';
    }
});

// Page changing logic
document.querySelectorAll('.links a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const sectionId = this.getAttribute('data-section');

        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        setTimeout(() => {
            document.querySelectorAll('.section').forEach(section => {
                section.style.display = 'none';
            });
            const activeSection = document.getElementById(sectionId);
            activeSection.style.display = 'block';
            setTimeout(() => {
                activeSection.classList.add('active');
            }, 10);
        }, 500);
    });
});
