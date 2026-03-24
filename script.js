// =========================
// BibleHut MVP Script.js
// =========================

// ---------- 1️⃣ Get Game Type from URL ----------
const urlParams = new URLSearchParams(window.location.search);
let gameType = urlParams.get('type') || "fill"; // default to fill
console.log("Game Type:", gameType);

// ---------- 2️⃣ Set Game Title ----------
document.addEventListener("DOMContentLoaded", () => {
  const gameTitle = document.getElementById("game-title");
  if (gameTitle) {
    const titles = {
      fill: "Fill-in-the-Blank",
      guess: "Guess the Character",
      trivia: "Bible Trivia",
      scramble: "Word Scramble",
      "verse-match": "Verse Match"
    };
    gameTitle.textContent = titles[gameType] || "Bible Game";
  }
});

// ---------- 3️⃣ Global Variables ----------
let score = 0;
let currentQuestion = 0;

// ---------- 4️⃣ DOM Elements ----------
const gameContainer = document.getElementById("game-container");
const scoreContainer = document.getElementById("score-container");
const scoreElement = document.getElementById("score");
const playAgainBtn = document.getElementById("play-again");
const leaderboardList = document.getElementById("leaderboard-list");

// ---------- 5️⃣ Sample Questions (Add 50+ per game mode) ----------
const questions = {
  fill: [
    { question: "The Lord is my ______", answer: "shepherd" },
    { question: "Jesus fed 5000 with five loaves and two ______", answer: "fish" },
    // ...add more here
  ],
  guess: [
    { question: "Who built the ark?", answer: "Noah" },
    { question: "Who received the Ten Commandments?", answer: "Moses" },
    // ...add more here
  ],
  trivia: [
    { question: "How many days did God take to create the world?", answer: "6" },
    { question: "What is the first book of the Bible?", answer: "Genesis" },
    // ...add more here
  ],
  scramble: [
    { question: "Unscramble: SEJUS", answer: "JESUS" },
    { question: "Unscramble: AHON", answer: "NOAH" },
    // ...add more here
  ],
  "verse-match": [
    { question: "Match: John 3:16", answer: "For God so loved the world" },
    { question: "Match: Psalm 23:1", answer: "The Lord is my shepherd" },
    // ...add more here
  ]
};

// ---------- 6️⃣ Show Question ----------
function showQuestion() {
  const gameQuestions = questions[gameType];
  if (!gameQuestions || gameQuestions.length === 0) {
    gameContainer.innerHTML = "<p>No questions found for this game.</p>";
    return;
  }

  const q = gameQuestions[currentQuestion];
  if (!q) return;

  gameContainer.innerHTML = `
    <p>${q.question}</p>
    <input type="text" id="answer-input" placeholder="Type your answer here"/>
    <button id="submit-answer">Submit</button>
  `;

  const submitBtn = document.getElementById("submit-answer");
  const answerInput = document.getElementById("answer-input");

  submitBtn.addEventListener("click", () => {
    checkAnswer(answerInput.value, q.answer);
  });
}

// ---------- 7️⃣ Check Answer ----------
function checkAnswer(userAnswer, correctAnswer) {
  if (userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()) {
    score++;
    updateScore();
  }

  currentQuestion++;
  const gameQuestions = questions[gameType];

  if (currentQuestion < gameQuestions.length) {
    showQuestion();
  } else {
    endGame();
  }
}

// ---------- 8️⃣ Update Score ----------
function updateScore() {
  if (scoreElement) scoreElement.textContent = score;
}

// ---------- 9️⃣ End Game ----------
function endGame() {
  gameContainer.innerHTML = "<p>Game Over!</p>";
  scoreContainer.classList.remove("hidden");
  updateLeaderboard();
}

// ---------- 🔟 Leaderboard (Static for MVP) ----------
function updateLeaderboard() {
  const leaderboardData = [
    { username: "Player1", score: 5 },
    { username: "Player2", score: 4 },
    { username: "Player3", score: 3 },
    { username: "Player4", score: 2 },
    { username: "Player5", score: 1 },
  ];

  if (leaderboardList) {
    leaderboardList.innerHTML = "";
    leaderboardData.forEach((entry, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${entry.username} - ${entry.score}`;
      leaderboardList.appendChild(li);
    });
  }
}

// ---------- 1️⃣1️⃣ Play Again ----------
if (playAgainBtn) {
  playAgainBtn.addEventListener("click", () => {
    score = 0;
    currentQuestion = 0;
    scoreContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    showQuestion();
  });
}

// ---------- 1️⃣2️⃣ Start Game on Page Load ----------
document.addEventListener("DOMContentLoaded", () => {
  score = 0;
  currentQuestion = 0;
  scoreContainer.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  showQuestion();
});
