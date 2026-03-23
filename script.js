// Get game type from URL
const urlParams = new URLSearchParams(window.location.search);
const gameType = urlParams.get('type');

const gameContainer = document.getElementById('game-container');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const playAgainBtn = document.getElementById('play-again');

let score = 0;
let currentQuestion = 0;

// ====== Game Data ======

// Fill-in-the-blank verses
const fillQuestions = [
  { question: "The Lord is my ______; I shall not want.", answer: "shepherd" },
  { question: "For God so loved the ______, that He gave His only Son.", answer: "world" },
  { question: "I can do all things through ______ who strengthens me.", answer: "Christ" },
  { question: "In the beginning, God created the ______ and the earth.", answer: "heavens" },
  { question: "Trust in the Lord with all your ______.", answer: "heart" }
];

// Guess the character
const guessQuestions = [
  { question: "I built an ark to save animals.", answer: "Noah" },
  { question: "I was swallowed by a big fish.", answer: "Jonah" },
  { question: "I led the Israelites out of Egypt.", answer: "Moses" },
  { question: "I defeated Goliath with a sling.", answer: "David" },
  { question: "I betrayed Jesus for 30 pieces of silver.", answer: "Judas" }
];

// ====== Initialize Game ======
function startGame() {
  score = 0;
  currentQuestion = 0;
  scoreElement.textContent = score;
  scoreContainer.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  showQuestion();
}

// ====== Show Question ======
function showQuestion() {
  let q;
  if (gameType === "fill") {
    q = fillQuestions[currentQuestion];
    gameContainer.innerHTML = `
      <p>${q.question}</p>
      <input type="text" id="answer-input" placeholder="Type your answer here">
      <button id="submit-answer">Submit</button>
    `;
    document.getElementById('submit-answer').addEventListener('click', checkAnswer);
  } else if (gameType === "guess") {
    q = guessQuestions[currentQuestion];
    gameContainer.innerHTML = `
      <p>${q.question}</p>
      <input type="text" id="answer-input" placeholder="Type your answer here">
      <button id="submit-answer">Submit</button>
    `;
    document.getElementById('submit-answer').addEventListener('click', checkAnswer);
  }
}

// ====== Check Answer ======
function checkAnswer() {
  const input = document.getElementById('answer-input').value.trim().toLowerCase();
  let correctAnswer;

  if (gameType === "fill") {
    correctAnswer = fillQuestions[currentQuestion].answer.toLowerCase();
  } else {
    correctAnswer = guessQuestions[currentQuestion].answer.toLowerCase();
  }

  if (input === correctAnswer) {
    score++;
    alert("✅ Correct!");
  } else {
    alert(`❌ Wrong! Correct answer: ${correctAnswer}`);
  }

  currentQuestion++;
  if (currentQuestion < (gameType === "fill" ? fillQuestions.length : guessQuestions.length)) {
    showQuestion();
  } else {
    endGame();
  }
}

// ====== End Game ======
function endGame() {
  gameContainer.classList.add('hidden');
  scoreContainer.classList.remove('hidden');
  scoreElement.textContent = score;
}

// ====== Event Listeners ======
playAgainBtn.addEventListener('click', startGame);

// Start the game when page loads
startGame();
