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
// 👇 online counter
let userSessionId = Math.random().toString(36).substring(2);
// 👇 ADD THESE EXACTLY HERE
let selectedLetters = "";
let foundWords = [];
// ---------- 4️⃣ DOM Elements ----------
const gameContainer = document.getElementById("game-container");
const scoreContainer = document.getElementById("score-container");
const scoreElement = document.getElementById("score");
const playAgainBtn = document.getElementById("play-again");
const leaderboardList = document.getElementById("leaderboard-list");

if (playAgainBtn) {
  playAgainBtn.addEventListener("click", () => {
    startGame();
  });
}

// ---------- 5️⃣ Sample Questions (Add 50+ per game mode) ----------
const questions = {
  // -------------------- FILL-IN-THE-BLANK --------------------
  fill: [
    { question: "The Lord is my ______", answer: "shepherd" },
    { question: "In the beginning, God created the ______ and the earth", answer: "heavens" },
    { question: "Jesus said, 'I am the ______ of the world'", answer: "light" },
    { question: "The fruit of the Spirit is ______, joy, peace...", answer: "love" },
    { question: "Noah built the ______ to survive the flood", answer: "ark" },
    { question: "The greatest commandment is to love God with all your ______", answer: "heart" },
    { question: "The walls of ______ fell after Joshua's army marched around them", answer: "Jericho" },
    { question: "Moses received the Ten ______ from God on Mount Sinai", answer: "commandments" },
    { question: "Jesus walked on ______", answer: "water" },
    { question: "David defeated ______ with a slingshot", answer: "Goliath" },
    { question: "God parted the ______ for the Israelites to cross", answer: "Red Sea" },
    { question: "The first man God created was ______", answer: "Adam" },
    { question: "The first woman God created was ______", answer: "Eve" },
    { question: "Jonah was swallowed by a large ______", answer: "fish" },
    { question: "Daniel prayed to God three times a ______", answer: "day" },
    { question: "Jesus fed 5000 people with five loaves and two ______", answer: "fish" },
    { question: "The garden where Adam and Eve lived was called the Garden of ______", answer: "Eden" },
    { question: "God told Abraham to sacrifice his son ______", answer: "Isaac" },
    { question: "The river where John baptized people was the River ______", answer: "Jordan" },
    { question: "The disciple who betrayed Jesus was ______", answer: "Judas" },
    { question: "Jesus rose from the ______ on the third day", answer: "dead" },
    { question: "The mountain where Moses saw the burning bush was Mount ______", answer: "Horeb" },
    { question: "God created the sun, moon, and stars on the ______ day", answer: "fourth" },
    { question: "The Ten Commandments were written on ______", answer: "stone" },
    { question: "The apostle known as the 'doubting' one was ______", answer: "Thomas" },
    { question: "Jesus turned water into ______ at Cana", answer: "wine" },
    { question: "The book that comes after Genesis is ______", answer: "Exodus" },
    { question: "The walls of Jerusalem were rebuilt under ______", answer: "Nehemiah" },
    { question: "Elijah was taken to heaven in a ______ of fire", answer: "chariot" },
    { question: "The last book of the Bible is ______", answer: "Revelation" },
    { question: "Jesus calmed the ______ during the storm", answer: "sea" },
    { question: "Paul was formerly called ______", answer: "Saul" },
    { question: "God created man in His own ______", answer: "image" },
    { question: "The man who slept in the lions' den was ______", answer: "Daniel" },
    { question: "The prophet who confronted Ahab and Jezebel was ______", answer: "Elijah" },
    { question: "The river where Moses floated as a baby was the River ______", answer: "Nile" },
    { question: "The first king of Israel was ______", answer: "Saul" },
    { question: "The psalm that begins 'The Lord is my shepherd' is Psalm ______", answer: "23" },
    { question: "The city where Jesus was born is ______", answer: "Bethlehem" },
    { question: "Jesus healed a blind man by putting mud on his ______", answer: "eyes" },
    { question: "The feast celebrated by the Israelites to remember the Exodus is ______", answer: "Passover" },
    { question: "The apostle who walked with Jesus on water was ______", answer: "Peter" },
    { question: "The river where Naaman was told to wash seven times was the River ______", answer: "Jordan" },
    { question: "The miracle of Jesus feeding 5000 took place near the Sea of ______", answer: "Galilee" },
    { question: "God promised Noah to never flood the earth again with a ______", answer: "rainbow" },
    { question: "The number of days Moses spent on Mount Sinai was ______", answer: "40" },
    { question: "The prophet who predicted Jesus' birth was ______", answer: "Isaiah" },
    { question: "The first miracle of Jesus was at the wedding in ______", answer: "Cana" },
    { question: "The man who carried Jesus' cross was ______", answer: "Simon" },
    { question: "The tree whose fruit Adam and Eve ate was the Tree of ______", answer: "Knowledge" },
    { question: "Jesus' mother is ______", answer: "Mary" },
    { question: "The man who wrote most of the Psalms was ______", answer: "David" },
    { question: "The first martyr in the Bible was ______", answer: "Stephen" },
  ],

  // -------------------- GUESS THE CHARACTER --------------------
  guess: [
    { question: "Who built the ark?", answer: "Noah" },
    { question: "Who received the Ten Commandments?", answer: "Moses" },
    { question: "Who was thrown into the lions' den?", answer: "Daniel" },
    { question: "Who denied Jesus three times?", answer: "Peter" },
    { question: "Who led the Israelites into the Promised Land?", answer: "Joshua" },
    { question: "Who was known for his wisdom and built the temple?", answer: "Solomon" },
    { question: "Who was called the 'weeping prophet'?", answer: "Jeremiah" },
    { question: "Who baptized Jesus?", answer: "John the Baptist" },
    { question: "Who wrote most of the Psalms?", answer: "David" },
    { question: "Who was swallowed by a big fish?", answer: "Jonah" },
    { question: "Who was the mother of Samuel?", answer: "Hannah" },
    { question: "Who was the first king of Israel?", answer: "Saul" },
    { question: "Who was a tax collector and became a disciple?", answer: "Matthew" },
    { question: "Who betrayed Jesus for 30 pieces of silver?", answer: "Judas" },
    { question: "Who climbed a sycamore tree to see Jesus?", answer: "Zacchaeus" },
    { question: "Who interpreted Pharaoh’s dreams?", answer: "Joseph" },
    { question: "Who parted the Red Sea?", answer: "Moses" },
    { question: "Who was known for his strength and fought the Philistines?", answer: "Samson" },
    { question: "Who was the mother of Jesus?", answer: "Mary" },
    { question: "Who doubted Jesus' resurrection until he saw the wounds?", answer: "Thomas" },
    { question: "Who was chosen to replace Judas as apostle?", answer: "Matthias" },
    { question: "Who visited Jesus at birth with gifts?", answer: "Wise Men" },
    { question: "Who walked with God and was taken to heaven without dying?", answer: "Enoch" },
    { question: "Who was Abraham’s wife?", answer: "Sarah" },
    { question: "Who wrestled with an angel and got a new name?", answer: "Jacob" },
    { question: "Who is the 'forerunner' of Jesus?", answer: "John the Baptist" },
    { question: "Who was stoned for his faith in the early church?", answer: "Stephen" },
    { question: "Who interpreted dreams in Babylon?", answer: "Daniel" },
    { question: "Who was the prophet that confronted Ahab and Jezebel?", answer: "Elijah" },
    { question: "Who was a Pharisee who became Paul the Apostle?", answer: "Saul" },
    { question: "Who carried Jesus’ cross?", answer: "Simon" },
    { question: "Who was king when Jesus was born?", answer: "Herod" },
    { question: "Who fasted 40 days in the wilderness?", answer: "Jesus" },
    { question: "Who denied Peter three times?", answer: "Jesus" },
    { question: "Who was the Ethiopian eunuch baptized by Philip?", answer: "Ethiopian Eunuch" },
    { question: "Who was Elijah’s successor?", answer: "Elisha" },
    { question: "Who was Abraham’s first son?", answer: "Ishmael" },
    { question: "Who wrestled with Jacob?", answer: "Angel" },
    { question: "Who was the mother of John the Baptist?", answer: "Elizabeth" },
    { question: "Who was the first disciple Jesus called?", answer: "Peter" },
    { question: "Who denied Jesus?", answer: "Judas" },
    { question: "Who wrote Revelation?", answer: "John" },
    { question: "Who interpreted the handwriting on the wall?", answer: "Daniel" },
    { question: "Who built the tower to heaven?", answer: "Babel" },
    { question: "Who killed Goliath?", answer: "David" },
    { question: "Who anointed Saul as king?", answer: "Samuel" },
    { question: "Who prayed for his enemies and lived in Nineveh?", answer: "Jonah" },
    { question: "Who led the Israelites out of Egypt?", answer: "Moses" },
    { question: "Who betrayed Samson?", answer: "Delilah" },
    { question: "Who was the tax collector that climbed a tree?", answer: "Zacchaeus" },
  ],
  // -------------------- MULTIPLE CHOICE TRIVIA --------------------
  trivia: [
    { question: "How many days did God take to create the world?", answer: "6" },
    { question: "What is the first book of the Bible?", answer: "Genesis" },
    { question: "Who was the oldest man in the Bible?", answer: "Methuselah" },
    { question: "Which sea did God part for the Israelites?", answer: "Red Sea" },
    { question: "Who was thrown into the fiery furnace?", answer: "Shadrach" },
    { question: "Who was the mother of Samuel?", answer: "Hannah" },
    { question: "Which apostle walked on water with Jesus?", answer: "Peter" },
    { question: "Where was Jesus born?", answer: "Bethlehem" },
    { question: "Which prophet was swallowed by a big fish?", answer: "Jonah" },
    { question: "Who betrayed Jesus for 30 pieces of silver?", answer: "Judas" },
    { question: "Who interpreted Pharaoh's dreams?", answer: "Joseph" },
    { question: "What river did John baptize people in?", answer: "Jordan" },
    { question: "Who was known for his strength and fought the Philistines?", answer: "Samson" },
    { question: "Who denied Jesus three times?", answer: "Peter" },
    { question: "Which king was known for his wisdom?", answer: "Solomon" },
    { question: "Which mountain did Moses receive the Ten Commandments on?", answer: "Mount Sinai" },
    { question: "How many books are in the Bible?", answer: "66" },
    { question: "Who was the first king of Israel?", answer: "Saul" },
    { question: "Who was thrown into the lions' den?", answer: "Daniel" },
    { question: "What is the shortest verse in the Bible?", answer: "Jesus wept" },
    { question: "Who was Abraham's wife?", answer: "Sarah" },
    { question: "What did God place in the sky as a promise to Noah?", answer: "Rainbow" },
    { question: "Who was the first martyr in the Bible?", answer: "Stephen" },
    { question: "Which disciple doubted Jesus' resurrection?", answer: "Thomas" },
    { question: "Which city was destroyed with fire and brimstone?", answer: "Sodom" },
    { question: "What is the last book of the Bible?", answer: "Revelation" },
    { question: "Who led the Israelites into the Promised Land?", answer: "Joshua" },
    { question: "Who wrote most of the Psalms?", answer: "David" },
    { question: "Who was known as the 'weeping prophet'?", answer: "Jeremiah" },
    { question: "What miracle did Jesus perform at Cana?", answer: "Turned water into wine" },
    { question: "How many people were fed with five loaves and two fish?", answer: "5000" },
    { question: "Who was the first disciple Jesus called?", answer: "Peter" },
    { question: "Which apostle wrote Revelation?", answer: "John" },
    { question: "Who betrayed Samson?", answer: "Delilah" },
    { question: "Who anointed Saul as king?", answer: "Samuel" },
    { question: "Who was Elijah's successor?", answer: "Elisha" },
    { question: "Who prayed for his enemies and survived in Nineveh?", answer: "Jonah" },
    { question: "Who climbed a sycamore tree to see Jesus?", answer: "Zacchaeus" },
    { question: "Who denied Peter three times?", answer: "Jesus" },
    { question: "Which woman turned into a pillar of salt?", answer: "Lot's wife" },
    { question: "Which book comes after Genesis?", answer: "Exodus" },
    { question: "Who was known as the forerunner of Jesus?", answer: "John the Baptist" },
    { question: "Who was the first man?", answer: "Adam" },
    { question: "Who was the first woman?", answer: "Eve" },
    { question: "Who killed Goliath?", answer: "David" },
    { question: "Which prophet confronted Ahab and Jezebel?", answer: "Elijah" },
    { question: "Who was Paul's former name?", answer: "Saul" },
    { question: "What garden did Adam and Eve live in?", answer: "Eden" },
    { question: "Who carried Jesus' cross?", answer: "Simon" },
    { question: "Who was the king when Jesus was born?", answer: "Herod" },
    { question: "Who fasted 40 days in the wilderness?", answer: "Jesus" },
  ],

  // -------------------- WORD SCRAMBLE --------------------
  scramble: [
    { question: "Unscramble: SEJUS", answer: "JESUS" },
    { question: "Unscramble: HEMOS", answer: "MOSES" },
    { question: "Unscramble: NHOA", answer: "NOAH" },
    { question: "Unscramble: DVAID", answer: "DAVID" },
    { question: "Unscramble: TAHOMT", answer: "MATTHEW" },
    { question: "Unscramble: SASMON", answer: "SAMSON" },
    { question: "Unscramble: AELIJH", answer: "ELIJAH" },
    { question: "Unscramble: NEHCO", answer: "ENOCH" },
    { question: "Unscramble: RNNEAJM", answer: "JEREMIAH" },
    { question: "Unscramble: LRHAS", answer: "SARAH" },
    { question: "Unscramble: IHCNAH", answer: "HANNAH" },
    { question: "Unscramble: JOHN", answer: "JOHN" },
    { question: "Unscramble: IANLED", answer: "DANIEL" },
    { question: "Unscramble: ABEL", answer: "ABEL" },
    { question: "Unscramble: SAMUEL", answer: "SAMUEL" },
    { question: "Unscramble: ISRAEL", answer: "ISRAEL" },
    { question: "Unscramble: EZRA", answer: "EZRA" },
    { question: "Unscramble: SOLOMON", answer: "SOLOMON" },
    { question: "Unscramble: REBEKAH", answer: "REBEKAH" },
    { question: "Unscramble: JACOB", answer: "JACOB" },
    { question: "Unscramble: ISAAC", answer: "ISAAC" },
    { question: "Unscramble: PHARAOH", answer: "PHARAOH" },
    { question: "Unscramble: ZACCHAEUS", answer: "ZACCHAEUS" },
    { question: "Unscramble: ELISHA", answer: "ELISHA" },
    { question: "Unscramble: MATTHIAS", answer: "MATTHIAS" },
    { question: "Unscramble: STEPHEN", answer: "STEPHEN" },
    { question: "Unscramble: HEROD", answer: "HEROD" },
    { question: "Unscramble: BETHEL", answer: "BETHEL" },
    { question: "Unscramble: GALILEE", answer: "GALILEE" },
    { question: "Unscramble: BETHLEHEM", answer: "BETHLEHEM" },
    { question: "Unscramble: NAAMAN", answer: "NAAMAN" },
    { question: "Unscramble: ZION", answer: "ZION" },
    { question: "Unscramble: EDOM", answer: "EDOM" },
    { question: "Unscramble: JORDAN", answer: "JORDAN" },
    { question: "Unscramble: CANA", answer: "CANA" },
    { question: "Unscramble: ARK", answer: "ARK" },
    { question: "Unscramble: EVE", answer: "EVE" },
    { question: "Unscramble: ADAM", answer: "ADAM" },
    { question: "Unscramble: METHUSELAH", answer: "METHUSELAH" },
    { question: "Unscramble: REVELATION", answer: "REVELATION" },
    { question: "Unscramble: EXODUS", answer: "EXODUS" },
    { question: "Unscramble: PSALMS", answer: "PSALMS" },
    { question: "Unscramble: ISAIAH", answer: "ISAIAH" },
    { question: "Unscramble: NEHEMIAH", answer: "NEHEMIAH" },
    { question: "Unscramble: JUDAS", answer: "JUDAS" },
    { question: "Unscramble: PETER", answer: "PETER" },
    { question: "Unscramble: THOMAS", answer: "THOMAS" },
    { question: "Unscramble: MATTHEW", answer: "MATTHEW" },
    { question: "Unscramble: JOHN THE BAPTIST", answer: "JOHN THE BAPTIST" },
    { question: "Unscramble: DELILAH", answer: "DELILAH" },
  ],

  // -------------------- VERSE MATCH / SCRIPTURE MEMORY --------------------
  "verse-match": [
    { question: "Match: John 3:16", answer: "For God so loved the world" },
    { question: "Match: Psalm 23:1", answer: "The Lord is my shepherd" },
    { question: "Match: Genesis 1:1", answer: "In the beginning God created the heavens and the earth" },
    { question: "Match: Exodus 20:12", answer: "Honor your father and your mother" },
    { question: "Match: Philippians 4:13", answer: "I can do all things through Christ who strengthens me" },
    { question: "Match: Romans 8:28", answer: "All things work together for good to those who love God" },
    { question: "Match: Proverbs 3:5", answer: "Trust in the Lord with all your heart" },
    { question: "Match: Isaiah 41:10", answer: "Fear not, for I am with you" },
    { question: "Match: Matthew 5:14", answer: "You are the light of the world" },
    { question: "Match: Matthew 6:33", answer: "Seek first the kingdom of God" },
    { question: "Match: Joshua 1:9", answer: "Be strong and courageous" },
    { question: "Match: Psalm 46:1", answer: "God is our refuge and strength" },
    { question: "Match: 1 Corinthians 13:4", answer: "Love is patient, love is kind" },
    { question: "Match: John 14:6", answer: "I am the way, the truth, and the life" },
    { question: "Match: Revelation 3:20", answer: "Behold, I stand at the door and knock" },
    { question: "Match: Psalm 119:105", answer: "Your word is a lamp to my feet" },
    { question: "Match: Matthew 28:19", answer: "Go therefore and make disciples of all nations" },
    { question: "Match: Galatians 5:22", answer: "Fruit of the Spirit is love, joy, peace" },
    { question: "Match: 1 John 4:8", answer: "God is love" },
    { question: "Match: Proverbs 16:3", answer: "Commit your work to the Lord" },
    { question: "Match: Isaiah 40:31", answer: "Those who wait on the Lord shall renew their strength" },
    { question: "Match: Romans 12:2", answer: "Do not be conformed to this world" },
    { question: "Match: Matthew 7:7", answer: "Ask, and it will be given to you" },
    { question: "Match: Psalm 37:4", answer: "Delight yourself in the Lord" },
    { question: "Match: Ecclesiastes 3:1", answer: "To everything there is a season" },
    { question: "Match: 2 Timothy 1:7", answer: "God gave us a spirit of power, love, and self-discipline" },
    { question: "Match: Matthew 11:28", answer: "Come to me, all you who labor and are heavy laden" },
    { question: "Match: Psalm 34:8", answer: "Taste and see that the Lord is good" },
    { question: "Match: Proverbs 3:6", answer: "In all your ways acknowledge Him" },
    { question: "Match: Romans 5:8", answer: "God demonstrates His love for us" },
    { question: "Match: Psalm 91:1", answer: "He who dwells in the shelter of the Most High" },
    { question: "Match: 1 Peter 5:7", answer: "Cast all your anxiety on Him" },
    { question: "Match: Matthew 22:37", answer: "Love the Lord your God with all your heart" },
    { question: "Match: Proverbs 18:10", answer: "The name of the Lord is a strong tower" },
    { question: "Match: John 8:12", answer: "I am the light of the world" },
    { question: "Match: Isaiah 26:3", answer: "You will keep him in perfect peace" },
    { question: "Match: Psalm 27:1", answer: "The Lord is my light and my salvation" },
    { question: "Match: Matthew 6:34", answer: "Do not worry about tomorrow" },
    { question: "Match: Psalm 118:24", answer: "This is the day that the Lord has made" },
    { question: "Match: Philippians 4:6", answer: "Do not be anxious about anything" },
    { question: "Match: John 15:5", answer: "I am the vine, you are the branches" },
    { question: "Match: Romans 6:23", answer: "For the wages of sin is death" },
    { question: "Match: Isaiah 53:5", answer: "He was pierced for our transgressions" },
    { question: "Match: Psalm 1:1", answer: "Blessed is the man who does not walk in the counsel of the wicked" },
    { question: "Match: 1 Corinthians 10:13", answer: "God will not let you be tempted beyond what you can bear" },
    { question: "Match: James 1:5", answer: "If any of you lacks wisdom, let him ask God" },
    { question: "Match: Hebrews 11:1", answer: "Faith is the assurance of things hoped for" },
    { question: "Match: Matthew 5:9", answer: "Blessed are the peacemakers" },
    { question: "Match: Psalm 46:10", answer: "Be still, and know that I am God" },
  ],

puzzle: [
  {
    grid: [
      ["J","E","S","U","S"],
      ["A","D","A","M","X"],
      ["N","O","A","H","Y"],
      ["M","O","S","E","S"],
      ["D","A","V","I","D"]
    ],
    words: ["JESUS", "ADAM", "NOAH", "MOSES", "DAVID"]
  }
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
// ---------- PUZZLE UI ----------
function showPuzzle() {
  const puzzle = questions.puzzle[0];

  selectedLetters = "";
  foundWords = [];

  let html = "<h3>🧩 Find the Words</h3>";

  puzzle.grid.forEach((row, rowIndex) => {
    html += `<div class="puzzle-row">`;

    row.forEach((letter, colIndex) => {
      html += `
        <span class="puzzle-cell"
          data-letter="${letter}"
          data-row="${rowIndex}"
          data-col="${colIndex}">
          ${letter}
        </span>
      `;
    });

    html += "</div>";
  });

  html += `<p>Words: ${puzzle.words.join(", ")}</p>`;
  html += `<p>Selected: <span id="selected-word"></span></p>`;

  gameContainer.innerHTML = html;

  attachPuzzleEvents(puzzle);
}
// 👇👇👇 PLACE IT EXACTLY HERE

// ---------- PUZZLE EVENTS ----------
function attachPuzzleEvents(puzzle) {
  const cells = document.querySelectorAll(".puzzle-cell");
  const selectedDisplay = document.getElementById("selected-word");

  cells.forEach(cell => {
    cell.addEventListener("click", () => {
      const letter = cell.dataset.letter;

      selectedLetters += letter;
      selectedDisplay.textContent = selectedLetters;

      // ✅ CHECK WORD MATCH
      if (puzzle.words.includes(selectedLetters) && !foundWords.includes(selectedLetters)) {

        foundWords.push(selectedLetters);

        // ✅ INCREASE SCORE
        score++;
        updateScore();

        alert("✅ Found: " + selectedLetters);

        // RESET INPUT
        selectedLetters = "";
        selectedDisplay.textContent = "";

        // ✅ CHECK IF GAME COMPLETED
        if (foundWords.length === puzzle.words.length) {
          setTimeout(() => {
            showFinalResult(puzzle.words.length);
          }, 500);
        }
      }
    });
  });
}
// ---------- 7️⃣ Check Answer ----------
function checkAnswer(userAnswer, correctAnswer) {
  const isCorrect =
    userAnswer.trim().toLowerCase() === correctAnswer.toLowerCase();

  if (isCorrect) {
    score++;
    updateScore();
  }

  // SHOW FEEDBACK
  gameContainer.innerHTML = `
    <p>${isCorrect ? "✅ Correct!" : "❌ Wrong!"}</p>
    <p>Correct Answer: <strong>${correctAnswer}</strong></p>
  `;

  currentQuestion++;

  setTimeout(() => {
    const gameQuestions = questions[gameType];

    if (currentQuestion < gameQuestions.length) {
      showQuestion();
    } else {
      showFinalResult(gameQuestions.length);
    }
  }, 1500);
}
// ---------- 8️⃣ Update Score ----------
function updateScore() {
  if (scoreElement) scoreElement.textContent = score;
}
// 👇👇👇 ADD IT RIGHT HERE
async function updateOnlineStatus() {
  await supabase
    .from("online_users")
    .upsert({
      user_id: userSessionId,
      last_seen: new Date().toISOString()
    });
}
// 👇👇👇 ADD IT EXACTLY HERE
async function getOnlineUsers() {
  const { data, error } = await supabase
    .from("online_users")
    .select("*")
    .gt("last_seen", new Date(Date.now() - 60000).toISOString()); // last 60 seconds

  if (data) {
    const el = document.getElementById("online-users");
    if (el) {
      el.textContent = `🟢 ${data.length} players online`;
    }
  }
}
// ---------- FINAL RESULT ----------
function showFinalResult(totalQuestions) {
  const wrong = totalQuestions - score;
  const percent = Math.round((score / totalQuestions) * 100);

  let message = "";

  if (percent >= 80) message = "🔥 Excellent! Bible Scholar!";
  else if (percent >= 50) message = "👍 Good job!";
  else message = "📖 Keep learning, you're improving!";

  gameContainer.innerHTML = `
    <h2>Game Over</h2>
    <p>Total Questions: ${totalQuestions}</p>
    <p>Correct: ${score}</p>
    <p>Wrong: ${wrong}</p>
    <p>Score: ${percent}%</p>
    <h3>${message}</h3>
  `;

  scoreContainer.classList.remove("hidden");

  updateLeaderboard();
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
function startGame() {
  score = 0;
  currentQuestion = 0;

  if (scoreContainer) scoreContainer.classList.add("hidden");
  if (gameContainer) gameContainer.classList.remove("hidden");

  if (gameType === "puzzle") {
    showPuzzle();
    return;
  }

  showQuestion();
}

// ---------- 1️⃣2️⃣ Start Game on Page Load ----------
document.addEventListener("DOMContentLoaded", () => {
  score = 0;
  currentQuestion = 0;
  if (gameType === "puzzle") {
  showPuzzle();
  return;
}
  scoreContainer.classList.add("hidden");
  gameContainer.classList.remove("hidden");
  showQuestion();
});
document.addEventListener("DOMContentLoaded", () => {
  startGame();
// 👇 ADD IT EXACTLY HERE
  updateOnlineStatus(); // run once immediately
  setInterval(updateOnlineStatus, 5000); // then every 5 seconds
  // =========================
  // HOME BUTTON
  const backBtn = document.getElementById("back-home");
  if (backBtn) {
    backBtn.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }

  // =========================
  // GAME SWITCHER
  const switchBtn = document.getElementById("switch-game");
  const switchSelect = document.getElementById("game-switcher");

  if (switchBtn && switchSelect) {
    switchBtn.addEventListener("click", () => {
      const newGame = switchSelect.value;
      window.location.href = `game.html?type=${newGame}&v=${Date.now()}`;
    });
  }
});
const backBtn = document.getElementById("back-home");

if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}
