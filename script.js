/* =========================================================
   UNBLOCKED GAMES
   THE CAPTCHA PURGATORY EXPERIENCE
========================================================= */


/* =========================================================
   SETTINGS
========================================================= */

/*
    false = FAST TEST MODE

    true = THE ACTUAL NIGHTMARE

    In nightmare mode:

    First loading:
        2 minutes = +1%

    At 98%:
        98% -> -348%

    Second loading:
        5 minutes = +1%

    DON'T TURN THIS ON WHILE TESTING
*/

const FULL_NIGHTMARE = true;


/* =========================================================
   SCREEN MANAGEMENT
========================================================= */

const screens = {

    robot:
        document.getElementById("robot-screen"),

    captcha:
        document.getElementById("captcha-screen"),

    loading:
        document.getElementById("loading-screen"),

    final:
        document.getElementById("final-screen"),

    games:
        document.getElementById("games-screen")

};


function showScreen(name) {

    Object.values(screens).forEach(screen => {

        screen.classList.remove("active");

    });

    screens[name].classList.add("active");
}


/* =========================================================
   ROBOT CHECK
========================================================= */

const robotButton =
    document.getElementById("robot-button");

const robotResult =
    document.getElementById("robot-result");


robotButton.addEventListener("click", () => {

    robotButton.disabled = true;

    robotButton.textContent =
        "Checking...";


    setTimeout(() => {

        /*
            THERE IS ACTUALLY A 1% CHANCE
            OF PASSING.
        */

        if (Math.random() < 0.01) {

            robotResult.textContent =
                "✓ Verification successful!";

            robotResult.style.color =
                "#15803d";


            setTimeout(() => {

                beginCaptchaSequence();

            }, 900);


        } else {

            robotResult.textContent =
                "✕ Verification failed. Please try again.";

            robotResult.style.color =
                "#dc2626";


            robotButton.disabled = false;

            robotButton.textContent =
                "I'm Not a Robot";

        }

    }, 900);

});


/* =========================================================
   CAPTCHA DATA
========================================================= */

const captchaTypes = [

    {
        title:
            "Select all squares containing traffic lights.",

        instruction:
            "Click every square that matches the instruction.",

        targets:
            ["🚦", "🚦", "🚦"]
    },

    {
        title:
            "Select all squares containing bicycles.",

        instruction:
            "Click every bicycle you can find.",

        targets:
            ["🚲", "🚲", "🚲"]
    },

    {
        title:
            "Select all squares containing cats.",

        instruction:
            "Click every cat.",

        targets:
            ["🐱", "🐱", "🐱"]
    },

    {
        title:
            "Select all squares containing things that are blue.",

        instruction:
            "This one should be easy.",

        targets:
            ["🔵", "🔷", "🧢"]
    },

    {
        title:
            "Select all squares containing food.",

        instruction:
            "Please identify the food.",

        targets:
            ["🍕", "🍔", "🍩"]
    },

    {
        title:
            "Select all squares containing something that could theoretically be a chair.",

        instruction:
            "Use your best judgment.",

        targets:
            ["🪑", "🛋️", "🪨"]
    },

    {
        title:
            "Select all squares containing a Geometry Dash cube.",

        instruction:
            "We need to make sure.",

        targets:
            ["🟨", "🟨", "🟨"]
    },

    {
        title:
            "Select all squares containing a suspicious object.",

        instruction:
            "You will know it when you see it.",

        targets:
            ["👁️", "📦", "🕳️"]
    },

    {
        title:
            "Select all squares containing something that is definitely not a robot.",

        instruction:
            "This is extremely important.",

        targets:
            ["🐸", "🍕", "🌳"]
    },

    {
        title:
            "Select all squares containing something that exists.",

        instruction:
            "Good luck.",

        targets:
            ["🐶", "📦", "🌎"]
    }

];


const filler = [

    "🌳",
    "🚗",
    "🏠",
    "🐶",
    "⚽",
    "📱",
    "☁️",
    "🌙",
    "🎸",
    "📚",
    "🧸",
    "🌵",
    "🦆",
    "🎈"

];


let currentCaptcha = null;

let selectedTiles =
    new Set();

let captchaRun = 0;

let finalMode = false;


/* =========================================================
   START CAPTCHA SEQUENCE
========================================================= */

function beginCaptchaSequence() {

    finalMode = false;

    captchaRun = 0;

    showScreen("captcha");

    createCaptcha();

}


/* =========================================================
   CREATE CAPTCHA
========================================================= */

function createCaptcha() {

    selectedTiles.clear();


    currentCaptcha =
        captchaTypes[
            Math.floor(
                Math.random() *
                captchaTypes.length
            )
        ];


    document.getElementById(
        "captcha-title"
    ).textContent =
        currentCaptcha.title;


    document.getElementById(
        "captcha-instruction"
    ).textContent =
        currentCaptcha.instruction;


    document.getElementById(
        "captcha-message"
    ).textContent =
        "";


    const grid =
        document.getElementById(
            "captcha-grid"
        );


    grid.innerHTML = "";


    /*
        Create 9 squares.
    */

    const tiles =
        Array(9).fill(null);


    const positions = [];


    /*
        Put 3 correct answers
        into random positions.
    */

    while (positions.length < 3) {

        const position =
            Math.floor(
                Math.random() * 9
            );


        if (
            !positions.includes(position)
        ) {

            positions.push(position);

        }

    }


    positions.forEach(
        (position, index) => {

            tiles[position] =
                currentCaptcha.targets[
                    index %
                    currentCaptcha.targets.length
                ];

        }
    );


    /*
        Fill remaining squares.
    */

    for (let i = 0; i < 9; i++) {

        if (!tiles[i]) {

            tiles[i] =
                filler[
                    Math.floor(
                        Math.random() *
                        filler.length
                    )
                ];

        }


        const tile =
            document.createElement("div");


        tile.className =
            "captcha-tile";


        tile.dataset.index =
            i;


        tile.dataset.target =
            positions.includes(i)
                ? "true"
                : "false";


        const art =
            document.createElement("div");


        art.className =
            "tile-art";


        art.textContent =
            tiles[i];


        tile.appendChild(art);


        tile.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        tile.dataset.index
                    );


                if (
                    selectedTiles.has(index)
                ) {

                    selectedTiles.delete(
                        index
                    );

                    tile.classList.remove(
                        "selected"
                    );

                } else {

                    selectedTiles.add(
                        index
                    );

                    tile.classList.add(
                        "selected"
                    );

                }

            }
        );


        grid.appendChild(tile);

    }

}


/* =========================================================
   CAPTCHA VERIFY
========================================================= */

document
    .getElementById("captcha-verify")
    .addEventListener(
        "click",
        () => {

            const tiles =
                [
                    ...document.querySelectorAll(
                        ".captcha-tile"
                    )
                ];


            const correct =
                tiles
                    .filter(
                        tile =>
                            tile.dataset.target
                            === "true"
                    )
                    .map(
                        tile =>
                            Number(
                                tile.dataset.index
                            )
                    );


            const selected =
                [
                    ...selectedTiles
                ]
                .sort(
                    (a, b) =>
                        a - b
                );


            const answer =
                [
                    ...correct
                ]
                .sort(
                    (a, b) =>
                        a - b
                );


            const isCorrect =

                selected.length ===
                    answer.length &&

                selected.every(
                    (value, index) =>
                        value ===
                        answer[index]
                );


            const message =
                document.getElementById(
                    "captcha-message"
                );


            if (!isCorrect) {

                message.textContent =
                    "✕ Incorrect. Please try again.";

                message.style.color =
                    "#dc2626";

                return;

            }


            captchaRun++;


            const weirdMessages = [

                "✓ Verification successful!",

                "✓ Human characteristics confirmed.",

                "✓ That appears to be correct.",

                "✓ Thank you for your cooperation.",

                "✓ Your existence has been noted.",

                "✓ Verification successful. Probably."

            ];


            message.textContent =
                weirdMessages[
                    Math.floor(
                        Math.random() *
                        weirdMessages.length
                    )
                ];


            message.style.color =
                "#15803d";


            setTimeout(() => {

                /*
                    FINAL CAPTCHA MODE
                */

                if (finalMode) {

                    if (captchaRun >= 10) {

                        showGames();

                    } else {

                        createCaptcha();

                    }

                    return;

                }


                /*
                    NORMAL CAPTCHA MODE

                    There is deliberately NO
                    visible counter.
                */

                if (captchaRun >= 12) {

                    startLoading();

                } else {

                    createCaptcha();

                }

            }, 700);

        }
    );


/* =========================================================
   LOADING NIGHTMARE
========================================================= */

function startLoading() {

    showScreen("loading");


    const progressBar =
        document.getElementById(
            "progress-bar"
        );


    const progressText =
        document.getElementById(
            "progress-text"
        );


    const loadingTitle =
        document.getElementById(
            "loading-title"
        );


    const loadingStatus =
        document.getElementById(
            "loading-status"
        );


    const loadingDetail =
        document.getElementById(
            "loading-detail"
        );


    progressBar.style.width =
        "0%";


    progressText.textContent =
        "0%";


    loadingTitle.textContent =
        "Preparing your games...";


    loadingStatus.textContent =
        "Please do not close this page.";


    loadingDetail.textContent =
        "Initializing secure game environment";


    /*
        TRUE:
            120,000ms = 2 minutes

        FALSE:
            80ms

        The fast mode lets you test
        the entire site without waiting.
    */

    const FIRST_PHASE_MS =
        FULL_NIGHTMARE
            ? 120000
            : 80;


    const SECOND_PHASE_MS =
        FULL_NIGHTMARE
            ? 300000
            : 120;


    let progress = 0;


    const firstPhase =
        setInterval(() => {

            progress++;


            updateProgress(
                progress
            );


            if (progress >= 98) {

                clearInterval(
                    firstPhase
                );


                setTimeout(() => {

                    runRollback(
                        SECOND_PHASE_MS
                    );

                }, 800);

            }

        }, FIRST_PHASE_MS);

}


/* =========================================================
   UPDATE PROGRESS
========================================================= */

function updateProgress(value) {

    const progressBar =
        document.getElementById(
            "progress-bar"
        );


    const progressText =
        document.getElementById(
            "progress-text"
        );


    progressBar.style.width =
        Math.max(
            0,
            value
        ) + "%";


    progressText.textContent =
        value + "%";


    const details = {

        10:
            "Downloading game metadata",

        25:
            "Checking browser compatibility",

        50:
            "Optimizing game files",

        75:
            "Optimizing optimization",

        90:
            "Almost there",

        95:
            "Finalizing",

        98:
            "Finishing up..."

    };


    if (details[value]) {

        document.getElementById(
            "loading-detail"
        ).textContent =
            details[value];

    }

}


/* =========================================================
   THE -348% INCIDENT
========================================================= */

function runRollback(
    secondPhaseMs
) {

    const title =
        document.getElementById(
            "loading-title"
        );


    const status =
        document.getElementById(
            "loading-status"
        );


    const detail =
        document.getElementById(
            "loading-detail"
        );


    const progressBar =
        document.getElementById(
            "progress-bar"
        );


    const progressText =
        document.getElementById(
            "progress-text"
        );


    title.textContent =
        "Uh oh.";


    status.textContent =
        "Something went slightly wrong.";


    detail.textContent =
        "Recalculating loading progress...";


    /*
        Slowly watch your hope disappear.
    */

    const rollbackValues = [

        74,

        31,

        -12,

        -86,

        -214,

        -348

    ];


    rollbackValues.forEach(
        (value, index) => {

            setTimeout(() => {

                progressBar.style.width =
                    Math.max(
                        0,
                        value
                    ) + "%";


                progressText.textContent =
                    value + "%";

            }, index * 300);

        }
    );


    /*
        Restart at 0%.
    */

    setTimeout(() => {

        title.textContent =
            "Rebuilding progress...";


        status.textContent =
            "This may take a little longer than expected.";


        detail.textContent =
            "Starting verification-compatible loading protocol";


        progressBar.style.width =
            "0%";


        progressText.textContent =
            "0%";


        let progress = 0;


        /*
            The second loading phase.

            TRUE:
                5 minutes per 1%

            FALSE:
                120ms per 1%
        */

        const secondPhase =
            setInterval(() => {

                progress++;


                updateProgress(
                    progress
                );


                if (progress >= 100) {

                    clearInterval(
                        secondPhase
                    );


                    setTimeout(() => {

                        showScreen(
                            "final"
                        );

                    }, 800);

                }

            }, secondPhaseMs);

    }, 2500);

}


/* =========================================================
   "JUUST TO BE SURE"
========================================================= */

document
    .getElementById("final-start")
    .addEventListener(
        "click",
        () => {

            finalMode = true;

            captchaRun = 0;

            showScreen(
                "captcha"
            );

            createCaptcha();

        }
    );


/* =========================================================
   GAMES
========================================================= */

const games = [

    [
        "Geometry Dash",
        "🟨",
        "Rhythm platformer"
    ],

    [
        "Slope",
        "🟢",
        "Endless runner"
    ],

    [
        "Run 3",
        "🏃",
        "Space runner"
    ],

    [
        "Minecraft Classic",
        "⛏️",
        "Block building"
    ],

    [
        "Flappy Bird",
        "🐦",
        "Don't hit the pipes"
    ],

    [
        "Cookie Clicker",
        "🍪",
        "Click cookies"
    ],

    [
        "2048",
        "🔢",
        "Number puzzle"
    ],

    [
        "Tetris",
        "🧱",
        "Classic puzzle"
    ],

    [
        "Snake",
        "🐍",
        "Eat. Grow. Repeat."
    ],

    [
        "Drive Mad",
        "🚗",
        "Physics driving"
    ],

    [
        "Pong",
        "🏓",
        "Classic arcade"
    ],

    [
        "Stickman Hook",
        "🪝",
        "Swing around"
    ]

];


function showGames() {

    showScreen(
        "games"
    );


    const grid =
        document.getElementById(
            "games-grid"
        );


    grid.innerHTML = "";


    games.forEach(
        (game, index) => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "game";


            card.innerHTML = `

                <div class="game-image">
                    ${game[1]}
                </div>

                <div class="game-info">

                    <strong>
                        ${game[0]}
                    </strong>

                    <small>
                        ${game[2]}
                    </small>

                    <br>

                    <span class="badge">
                        ${
                            index < 3
                                ? "POPULAR"
                                : "UNBLOCKED"
                        }
                    </span>

                </div>

            `;


            card.addEventListener(
                "click",
                () => {

                    alert(

                        `${game[0]} would open here!\n\n` +

                        "Imagine wasting ALL that time for these games to be fake. " +

                        "I got you sooooo hard 😂😂😂😂😂😂😂😂😂" 

                    );

                }
            );


            grid.appendChild(
                card
            );

        }
    );


    startSessionTimer();

}


/* =========================================================
   SESSION TIMER
========================================================= */

let sessionInterval;


function startSessionTimer() {

    clearInterval(
        sessionInterval
    );


    let seconds = 300;


    const timer =
        document.getElementById(
            "session-timer"
        );


    sessionInterval =
        setInterval(() => {

            seconds--;


            const minutes =
                Math.floor(
                    seconds / 60
                );


            const secs =
                seconds % 60;


            timer.textContent =

                String(minutes)
                    .padStart(2, "0")

                + ":" +

                String(secs)
                    .padStart(2, "0");


            if (seconds <= 0) {

                clearInterval(
                    sessionInterval
                );


                alert(

                    "Your session has expired.\n\n" +

                    "Please begin verification again."

                );


                location.reload();

            }

        }, 1000);

}


/* =========================================================
   FAKE AD
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            event.target.matches(
                ".fake-ad button"
            )
        ) {

            event.target.textContent =
                "Loading...";


            setTimeout(() => {

                event.target.textContent =
                    "CLICK NOW";


                alert(

                    "Congratulations!\n\n" +

                    "You clicked the button.\n\n" +

                    "Nothing happened."

                );

            }, 700);

        }

    }
);