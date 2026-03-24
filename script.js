// ====== Supabase Setup ======
const SUPABASE_URL = "https://zwntnhosqzoyvpatmenw.supabase.co"; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3bnRuaG9zcXpveXZwYXRtZW53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzMDM2NDMsImV4cCI6MjA4OTg3OTY0M30.mi6pgodcu2hUXCnB5Zbzv0h5NSyiriAZemB4lCQ2IZk"; // Replace with your anon key
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Get game type from URL
const urlParams = new URLSearchParams(window.location.search);
let gameType = urlParams.get('type') || "fill";

// ====== SET GAME TITLE (ADD IT HERE) ======
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
// ====== Global Variables ======
let currentUser = null;
let score = 0;
let currentQuestion = 0;
let gameType = null;

// ====== DOM Elements ======
const gameContainer = document.getElementById('game-container');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const playAgainBtn = document.getElementById('play-again');
const leaderboardContainer = document.getElementById('leaderboard-container');
const leaderboardList = document.getElementById('leaderboard-list');

// ====== Questions ======
// Fill-in-the-Blank
const fillQuestions = [
  { question: "The Lord is my ______; I shall not want.", answer: "shepherd" },
  { question: "For God so loved the ______, that He gave His only Son.", answer: "world" },
  { question: "I can do all things through ______ who strengthens me.", answer: "Christ" },
  { question: "In the beginning, God created the ______ and the earth.", answer: "heavens" },
  { question: "Trust in the Lord with all your ______.", answer: "heart" },
  // ... add more
];

// Guess the Character
const guessQuestions = [
  { question: "I built an ark to save animals.", answer: "Noah" },
  { question: "I was swallowed by a big fish.", answer: "Jonah" },
  { question: "I led the Israelites out of Egypt.", answer: "Moses" },
  // ... add more
];

// Trivia / Multiple Choice
const triviaQuestions = [
  { question: "Who was the first king of Israel?", options: ["David", "Saul", "Solomon", "Samuel"], answer: "Saul" },
  { question: "How many days and nights did it rain during the flood?", options: ["30", "40", "50", "20"], answer: "40" },
  // ... add more
];

// Word Scramble
const scrambleWords = [
  { word: "DAVID", hint: "Defeated Goliath" },
  { word: "MOSES", hint: "Led Israelites from Egypt" },
  { word: "JONAH", hint: "Swallowed by a big fish" },
  // ... add more
];

// Verse Match
const verseMatchQuestions = [
  { verse: "The Lord is my shepherd; I shall not want.", options: ["Psalms", "Genesis", "Exodus", "Proverbs"], answer: "Psalms" },
  { verse: "For God so loved the world that He gave His only Son.", options: ["John", "Romans", "Matthew", "Mark"], answer: "John" },
  // ... add more
];

// ====== User Login ======
async function loginUser() {
  let username = prompt("Enter your name:");
  if (!username) username = "Guest";

  let { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .single();

  if (!data) {
    const { data: newUser } = await supabase
      .from("users")
      .insert({ username, score: 0, streak: 0, last_played: null })
      .select()
      .single();
    currentUser = newUser;
  } else {
    currentUser = data;
  }
}

// ====== Show Question ======
function showQuestion() {
  let q;
  if (gameType === "fill") q = fillQuestions[currentQuestion];
  if (gameType === "guess") q = guessQuestions[currentQuestion];
  if (gameType === "trivia") q = triviaQuestions[currentQuestion];
  if (gameType === "scramble") q = scrambleWords[currentQuestion];
  if (gameType === "verse-match") q = verseMatchQuestions[currentQuestion];

  if (gameType === "fill" || gameType === "guess") {
    gameContainer.innerHTML = `
      <p>${q.question}</p>
      <input type="text" id="answer-input" placeholder="Type your answer">
      <button id="submit-answer">Submit</button>
    `;
    document.getElementById("submit-answer").addEventListener("click", checkAnswer);
  } else if (gameType === "trivia") {
    gameContainer.innerHTML = `
      <p>${q.question}</p>
      ${q.options.map((o,i)=>`<button class="option-btn">${o}</button>`).join('')}
    `;
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', ()=>checkAnswer(btn.textContent));
    });
  } else if (gameType === "scramble") {
    const scrambled = q.word.split('').sort(()=>0.5-Math.random()).join('');
    gameContainer.innerHTML = `
      <p>Unscramble this word: ${scrambled}</p>
      <small>Hint: ${q.hint}</small><br>
      <input type="text" id="answer-input" placeholder="Type your answer">
      <button id="submit-answer">Submit</button>
    `;
    document.getElementById("submit-answer").addEventListener("click", checkAnswer);
  } else if (gameType === "verse-match") {
    gameContainer.innerHTML = `
      <p>${q.verse}</p>
      ${q.options.map((o,i)=>`<button class="option-btn">${o}</button>`).join('')}
    `;
    document.querySelectorAll('.option-btn').forEach(btn => {
      btn.addEventListener('click', ()=>checkAnswer(btn.textContent));
    });
  }
}

// ====== Check Answer ======
function checkAnswer(inputValue=null) {
  const q = (gameType === "fill") ? fillQuestions[currentQuestion]
          : (gameType === "guess") ? guessQuestions[currentQuestion]
          : (gameType === "trivia") ? triviaQuestions[currentQuestion]
          : (gameType === "scramble") ? scrambleWords[currentQuestion]
          : verseMatchQuestions[currentQuestion];

  const answer = q.answer.toLowerCase();
  const input = inputValue ? inputValue.toLowerCase() : document.getElementById("answer-input").value.trim().toLowerCase();

  if (input === answer) {
    score++;
    alert("✅ Correct!");
  } else {
    alert(`❌ Wrong! Correct answer: ${q.answer}`);
  }

  currentQuestion++;
  const totalQ = (gameType==="fill")? fillQuestions.length :
                 (gameType==="guess")? guessQuestions.length :
                 (gameType==="trivia")? triviaQuestions.length :
                 (gameType==="scramble")? scrambleWords.length :
                 verseMatchQuestions.length;

  if (currentQuestion < totalQ) showQuestion();
  else endGame();
}

// ====== Update Score ======
async function updateScore(points) {
  const newScore = (currentUser.score || 0) + points;
  const { data } = await supabase
    .from("users")
    .update({ score: newScore })
    .eq("id", currentUser.id)
    .select()
    .single();
  currentUser = data;
}

// ====== Update Streak ======
async function updateStreak() {
  const lastPlayed = currentUser.last_played ? new Date(currentUser.last_played) : null;
  const today = new Date();
  let streak = currentUser.streak || 0;

  if (!lastPlayed || (today - lastPlayed) > 24*60*60*1000) {
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (lastPlayed && lastPlayed.toDateString() === yesterday.toDateString()) streak += 1;
    else streak = 1;
  }

  const { data } = await supabase
    .from("users")
    .update({ streak, last_played: new Date() })
    .eq("id", currentUser.id)
    .select()
    .single();
  currentUser = data;
  return streak;
}

// ====== Show Leaderboard ======
async function showLeaderboard() {
  const { data } = await supabase
    .from("users")
    .select("*")
    .order("score", { ascending: false })
    .limit(10);

  leaderboardList.innerHTML = "";
  data.forEach((user,index)=>{
    const li = document.createElement("li");
    li.textContent = `${index+1}. ${user.username} - ${user.score} pts (Streak: ${user.streak})`;
    leaderboardList.appendChild(li);
  });
}

// ====== End Game ======
async function endGame() {
  gameContainer.classList.add('hidden');
  scoreContainer.classList.remove('hidden');
  scoreElement.textContent = score;

  await updateScore(score);
  const streak = await updateStreak();
  alert(`🎉 Your daily streak: ${streak} day(s)!`);
  showLeaderboard();
}

// ====== Start Game ======
async function startGame() {
  await loginUser();
  score = 0;
  currentQuestion = 0;
  gameType = gameSelector ? gameSelector.value : "fill";
  scoreElement.textContent = score;
  scoreContainer.classList.add('hidden');
  gameContainer.classList.remove('hidden');
  showQuestion();
}

// ====== Event Listeners ======
playAgainBtn.addEventListener("click", startGame);
if(gameSelector) gameSelector.addEventListener("change", startGame);

// ====== Launch ======
document.addEventListener("DOMContentLoaded", () => {
  startGame();
});
