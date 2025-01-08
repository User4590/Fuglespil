document.addEventListener("DOMContentLoaded", () => {
    // Variabler
    let birds = 7;
    let score = 0;
    let obstacles = [];
    let fallingObjects = []; // Tesla og sattelitter
    let gameRunning = false; // Kører ikke
    let gameStartTime = 0; // Tidspunktet spillet starter
    let timeLimit = 10000; // 10 sekunder

    // Hent billeder
    const birdImage = document.getElementById("birdImage");
    const stoneImage = document.getElementById("stoneImage");
    const teslaImage = document.getElementById("teslaImage");
    const satelliteImage = document.getElementById("satelliteImage");

    // Canvas opsætning
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");

    canvas.width = 800;
    canvas.height = 600;

    // Fugleflokkens position
    const flock = {
        x: 100,
        y: canvas.height / 2,
        width: 50,
        height: 50,
        dy: 0,
    };

    // Funktioner for at tegne objekterne på canvas
    function drawBirds() {
        for (let i = 0; i < birds; i++) {
            ctx.drawImage(birdImage, flock.x - i * 10, flock.y + i * 5, flock.width, flock.height);
        }
    }

    function drawObstacles() {
        obstacles.forEach((obstacle) => {
            ctx.drawImage(stoneImage, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });
    }

    function drawFallingObjects() {
        fallingObjects.forEach((object) => {
            if (object.type === "tesla") {
                ctx.drawImage(teslaImage, object.x, object.y, object.width, object.height);
            } else if (object.type === "satellite") {
                ctx.drawImage(satelliteImage, object.x, object.y, object.width, object.height);
            }
        });
    }

    // Start spillet
    function startGame() {
        gameRunning = true;
        birds = 7;
        score = 0;
        obstacles = [];
        fallingObjects = [];
        flock.y = canvas.height / 2;
        gameStartTime = Date.now(); // Start timer
        document.getElementById("game-over").classList.add("hidden");
        updateGame();
    }

    // Opdater spillet
    function updateGame() {
        if (!gameRunning) return;

        // Ryd canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Tegn fugleflokken
        drawBirds();

        // Flyt fugleflokken
        flock.y += flock.dy;

        // Tegn og flyt sten
        obstacles.forEach((obstacle, index) => {
            obstacle.x -= obstacle.speed;
            
            // Kollisionsdetektion for sten
            if (
                flock.x < obstacle.x + obstacle.width &&
                flock.x + flock.width > obstacle.x &&
                flock.y < obstacle.y + obstacle.height &&
                flock.y + flock.height > obstacle.y
            ) {
                birds--; // Reducer antal fugle
                obstacles.splice(index, 1); // Fjern forhindringen
                if (birds <= 0) endGame(); // Tjek Game Over
            }

            // Fjern forhindringer uden for skærmen
            if (obstacle.x + obstacle.width < 0) {
                obstacles.splice(index, 1);
                score++; // +score
            }
        });

        // Tesla og sattelit efter 10 sekunder
        if (Date.now() - gameStartTime > timeLimit) {
            if (Math.random() < 0.01) createFallingObject(); // Tilføj Tesla og satellitter
        }

        // Tegn og flyt Tesla Roadster og satellitter
        fallingObjects.forEach((object, index) => {
            object.y += object.speed;

            // Kollisionsdetektion for Tesla og Satellit
            if (
                flock.x < object.x + object.width &&
                flock.x + flock.width > object.x &&
                flock.y < object.y + object.height &&
                flock.y + flock.height > object.y
            ) {
                birds--; // Reducer antal fugle
                fallingObjects.splice(index, 1); // Fjern objektet
                if (birds <= 0) endGame(); // Tjek Game Over
            }

            // Fjern objekter, der er uden for skærmen
            if (object.y > canvas.height) {
                fallingObjects.splice(index, 1);
            }
        });

        drawObstacles();
        drawFallingObjects();

        // Opdater score og fugle
        document.getElementById("score").textContent = `Score: ${score} | Birds: ${birds}`;

        // Tilføj nye forhindringer
        if (Math.random() < 0.02) createObstacle();

        // Hold fuglene indenfor skærmen
        flock.y = Math.max(0, Math.min(canvas.height - flock.height, flock.y));

        // Fortsæt animationen
        if (gameRunning) requestAnimationFrame(updateGame);
    }

    // Afslut spillet
    function endGame() {
        gameRunning = false; // Stop spillet
        document.getElementById("game-over").classList.remove("hidden"); // Vis Game Over tekst
    }
    

    // Styring
    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowUp") flock.dy = -5;
        if (e.key === "ArrowDown") flock.dy = 5;
        if (e.key === "Enter" && !gameRunning) startGame(); // Start spillet på Enter
    });

    document.addEventListener("keyup", () => {
        flock.dy = 0;
    });

    // Tilføj roadster og sattelitter
    function createFallingObject() {
        const randomType = Math.random() < 0.5 ? "tesla" : "satellite"; // Tilfældigt valg af Tesla eller satellit
        const object = {
            type: randomType,
            x: Math.random() * canvas.width, // Position langs toppen
            y: 0, // Start fra toppen
            width: 50,
            height: 50,
            speed: 3,
        };
        fallingObjects.push(object);
    }

    // Tilføj sten som forhindring
    function createObstacle() {
        const obstacle = {
            x: canvas.width,
            y: Math.random() * (canvas.height - 50),
            width: 50,
            height: 50,
            speed: 3,
        };
        obstacles.push(obstacle);
    }

// Baggrundsbillede og variabler til animation
const backgroundImage = new Image();
backgroundImage.src = 'background.jpg';

let backgroundX = 0; // Startposition for baggrunden
let backgroundSpeed = 1; // Hastigheden på baggrundens bevægelse
// Tegn og flyt baggrunden
function drawBackground() {
    // Tegn baggrunden to gange for at gentage den horisontalt
    ctx.drawImage(backgroundImage, backgroundX, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, backgroundX + canvas.width, 0, canvas.width, canvas.height);

    // Flyt baggrundens position
    backgroundX -= backgroundSpeed;

    // Hvis baggrunden er scrollet ud af skærmen, nulstil positionen
    if (backgroundX <= -canvas.width) {
        backgroundX = 0;
    }
}
function updateGame() {
    if (!gameRunning) return;

    // Ryd canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Tegn baggrunden
    drawBackground();

    // Tegn fugleflokken
    drawBirds();
    function drawBirds() {
        if (!gameRunning) return; // Stop med at tegne fuglene, hvis spillet er slut
        for (let i = 0; i < birds; i++) {
            ctx.drawImage(birdImage, flock.x - i * 10, flock.y + i * 5, flock.width, flock.height);
        }
    }
    
    // Flyt fugleflokken
    flock.y += flock.dy;

    // Tegn og opdater sten og faldende objekter
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacle.speed;

        if (
            flock.x < obstacle.x + obstacle.width &&
            flock.x + flock.width > obstacle.x &&
            flock.y < obstacle.y + obstacle.height &&
            flock.y + flock.height > obstacle.y
        ) {
            birds--;
            obstacles.splice(index, 1);
            if (birds <= 0) endGame();
        }

        if (obstacle.x + obstacle.width < 0) {
            obstacles.splice(index, 1);
            score++;
        }
    });

    drawObstacles();

    fallingObjects.forEach((object, index) => {
        object.y += object.speed;

        if (
            flock.x < object.x + object.width &&
            flock.x + flock.width > object.x &&
            flock.y < object.y + object.height &&
            flock.y + flock.height > object.y
        ) {
            birds--;
            fallingObjects.splice(index, 1);
            if (birds <= 0) endGame();
        }

        if (object.y > canvas.height) {
            fallingObjects.splice(index, 1);
        }
    });

    drawFallingObjects();

    // Opdater score og fugle
    document.getElementById("score").textContent = `Score: ${score} | Birds: ${birds}`;

    // Tilføj nye forhindringer
    if (Math.random() < 0.02) createObstacle();

    // Hold fuglene indenfor skærmen
    flock.y = Math.max(0, Math.min(canvas.height - flock.height, flock.y));

    // Fortsæt animationen
    if (gameRunning) requestAnimationFrame(updateGame);
}

});
