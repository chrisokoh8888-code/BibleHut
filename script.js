// ==========================
// BibleHut Pro Script.js
// ==========================

// ---------- SUPABASE SETUP ----------
const SUPABASE_URL = "https://zwntnhosqzoyvpatmenw.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bnRuaG9zcXpveXZwYXRtZW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDM2NDMsImV4cCI6MjA4OTg3OTY0M30.mi6pgodcu2hUXCnB5Zbzv0h5NSyiriAZemB4lCQ2IZk";
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ---------- GET GAME TYPE FROM URL ----------
const urlParams = new URLSearchParams(window.location.search);
let gameType = urlParams.get('type') || "fill";

// ---------- SET GAME TITLE ----------
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

// ---------- GLOBAL VARIABLES ----------
let currentUser = null;
let score = 0;
let currentQuestion = 0;

// ---------- DOM ELEMENTS ----------
const gameContainer = document.getElementById('game-container');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const playAgainBtn = document.getElementById('play-again');
const leaderboardList = document.getElementById('leaderboard-list');

// ---------- SAMPLE QUESTIONS ----------
const questions = {
  fill: [
    { question: "The Lord is my ______", answer: "shepherd" },
    { question: "Jesus fed 5000 with five loaves and two ______", answer: "fish" },
    // add more 50+ questions here
  ],
  guess: [
    { question: "Who built the ark?", answer: "Noah" },
    { question: "Who received the Ten Commandments?", answer: "Moses" },
    // add more
  ],
  trivia: [
    { question: "How many days did God take to create the world?", answer: "6" },
    { question: "What is the first book of the Bible?", answer: "Genesis" },
    // add more
  ],
  scramble: [
    { question: "Unscramble: SEJUS", answer: "JESUS" },
    { question: "Unscramble: AHON", answer: "NOAH" },
    // add more
  ],
  "verse-match": [
    { question: "Match: John 3:16", answer: "For God so loved the world..." },
    { question: "Match: Psalm 23:1", answer: "The Lord is my shepherd" },
    // add more
  ]
};

// =========================
// ---------- SUPABASE LOGIN ----------
async function loginUser() {
  // Anonymous login for MVP
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
  if (error) {
    console.log("Login error:", error.message);
  } else {
    currentUser = supabase.auth.user();
  }
}

// =========================
// ---------- SHOW QUESTION ----------
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

// =========================
// ---------- CHECK ANSWER ----------
function checkAnswer(userAnswer, correctAnswer) {
  if (userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase()) {
    score += 1;
    updateScore();
  }

  currentQuestion += 1;
  const gameQuestions = questions[gameType];
  if (currentQuestion < gameQuestions.length) {
    showQuestion();
  } else {
    gameContainer.innerHTML = "<p>Game Over!</p>";
    scoreContainer.classList.remove("hidden");
    updateLeaderboard();
  }
}

// =========================
// ---------- UPDATE SCORE ----------
function updateScore() {
  if (scoreElement) scoreElement.textContent = score;
}

// =========================
// ---------- LEADERBOARD & STREAKS ----------
async function updateLeaderboard() {
  if (!currentUser) return;

  const { data, error } = await supabase
    .from('biblehut_scores')
    .insert([{ user_id: currentUser.id, score: score, game_type: gameType }]);

  if (error) {
    console.log("Leaderboard update error:", error);
  }

  // Get top 10 scores
  const { data: leaderboardData } = await supabase
    .from('biblehut_scores')
    .select('score, user_id')
    .eq('game_type', gameType)
    .order('score', { ascending: false })
    .limit(10);

  if (leaderboardData && leaderboardList) {
    leaderboardList.innerHTML = "";
    leaderboardData.forEach((entry, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${entry.user_id.substring(0,5)} - ${entry.score}`;
      leaderboardList.appendChild(li);
    });
  }
}

// =========================
// ---------- START GAME ----------
async function startGame() {
  await loginUser();

  score = 0;
  currentQuestion = 0;

  if (scoreContainer) scoreContainer.classList.add("hidden");
  if (gameContainer) gameContainer.classList.remove("hidden");

  showQuestion(); // 🔥 MUST BE HERE
}

// =========================
// ---------- PLAY AGAIN ----------
if (playAgainBtn) {
  playAgainBtn.addEventListener("click", () => {
    startGame();
  });
}

// =========================
// ---------- PAGE LOAD ----------
document.addEventListener("DOMContentLoaded", () => {
  startGame();
});
