// ----- Questions -----
const questions = {
  easter: {
    day1: [
      { question: "Which prophet foretold the suffering servant?", answer: "Isaiah" },
      { question: "Who prophesied the Messiah would be born in Bethlehem?", answer: "Micah" }
    ],
    day2: [
      { question: "Where was Jesus born?", answer: "Bethlehem" }
    ],
    day3: [
      { question: "Who did Jesus raise from the dead?", answer: "Lazarus" }
    ],
    day4: [
      { grid: [
        ["C","R","O","S","S"],
        ["J","E","S","U","S"],
        ["N","A","I","L","S"],
        ["T","H","O","R","N"],
        ["B","L","O","O","D"]
      ],
        words: ["CROSS","JESUS","NAILS","THORN","BLOOD"]
      }
    ],
    day5: [
      { question: "He is not here, He is ____", answer: "risen" }
    ]
  }
};

let score = 0;
let streak = parseInt(localStorage.getItem('streak') || 0);
let currentQuestion = 0;
let currentEasterQuestions = [];

// ----- Utility Functions -----
function getEasterDay() {
  const start = new Date("2026-04-01");
  const today = new Date();
  const diff = Math.floor((today - start)/(1000*60*60*24));
  return Math.min(diff +1, 6);
}

// ----- Game Functions -----
function showQuestion() {
  if(currentQuestion >= currentEasterQuestions.length) {
    showFinalResult();
    return;
  }
  const q = currentEasterQuestions[currentQuestion];
  document.getElementById('question-container').textContent = q.question || "Puzzle Day!";
}

function startGame() {
  score = 0;
  currentQuestion = 0;

  const day = getEasterDay();
  currentEasterQuestions = questions.easter["day" + day];
  document.getElementById('game-container').classList.remove('hidden');
  document.getElementById('result-screen').classList.add('hidden');

  showQuestion();
  updateCountdown();
}

function submitAnswer() {
  const input = document.getElementById('answer-input');
  const selected = input.value.trim();
  const correct = currentEasterQuestions[currentQuestion].answer || "";

  if(selected.toLowerCase() === correct.toLowerCase()){
    score++;
    streak++;
    localStorage.setItem('streak', streak);
    launchConfetti();
    showBadge(getEasterDay());
    spawnEgg();
  }
  currentQuestion++;
  input.value = '';
  showQuestion();
}

function showFinalResult(){
  document.getElementById('game-container').classList.add('hidden');
  document.getElementById('result-screen').classList.remove('hidden');
  document.getElementById('final-score').textContent = score;
  document.getElementById('final-streak').textContent = streak;
  saveLeaderboard();
}

function restartGame() {
  startGame();
}

// ----- Leaderboard -----
let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');

function saveLeaderboard() {
  const name = prompt("Enter your name for the leaderboard:", "Player");
  leaderboard.push({name, streak});
  leaderboard.sort((a,b) => b.streak - a.streak);
  leaderboard = leaderboard.slice(0,5);
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

function showLeaderboard(){
  if(leaderboard.length ===0) alert("No scores yet!");
  else alert(
    leaderboard.map((p,i)=>`${i+1}. ${p.name}: ${p.streak}🔥`).join("\n")
  );
}

// ----- Countdown -----
function updateCountdown(){
  const end = new Date("2026-04-06");
  const today = new Date();
  const diff = end - today;
  const days = Math.max(Math.ceil(diff/(1000*60*60*24)),0);
  document.getElementById('day-number').textContent = `Day ${getEasterDay()} - ${days} days left!`;
}
setInterval(updateCountdown, 60000);

// ----- Badges -----
function showBadge(day){
  const badge = document.createElement('img');
  badge.src = `assets/badge-day${day}.png`;
  badge.className = 'badge';
  document.body.appendChild(badge);
  setTimeout(()=>badge.remove(), 4000);
}

// ----- Confetti -----
function launchConfetti(){
  for(let i=0;i<30;i++){
    const conf = document.createElement('div');
    conf.className='confetti';
    conf.style.left=Math.random()*window.innerWidth+'px';
    conf.style.animationDuration= (2+Math.random()*2)+'s';
    document.body.appendChild(conf);
    setTimeout(()=>conf.remove(),3000);
  }
}

// ----- Falling Eggs -----
function spawnEgg(){
  const egg = document.createElement('div');
  egg.className='egg';
  egg.style.left=Math.random()*window.innerWidth+'px';
  egg.style.animationDuration = (3+Math.random()*2)+'s';
  document.body.appendChild(egg);
  setTimeout(()=>egg.remove(),5000);
}

// ----- Share -----
function shareBadge(){
  const text = `I scored ${score} in BibleHut Easter Challenge! 🐣 Can you beat my streak of ${streak}?`;
  if(navigator.share){
    navigator.share({ text });
  } else {
    alert(text + "\nCopy and share this link: easter-challenge/index.html");
  }
}

// ----- Event Listeners -----
document.getElementById('submit-btn').addEventListener('click',submitAnswer);
startGame();
