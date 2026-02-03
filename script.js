const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const question = document.getElementById("question");
const result = document.getElementById("result");
const countdownBox = document.getElementById("countdownBox");
const buttonsWrap = document.getElementById("buttonsWrap");

const resetBtn = document.getElementById("resetBtn");
const resetBtn2 = document.getElementById("resetBtn2");

// Countdown fields
const dEl = document.getElementById("d");
const hEl = document.getElementById("h");
const mEl = document.getElementById("m");
const sEl = document.getElementById("s");

// Countdown labels + title/note
const countdownTitle = document.getElementById("countdownTitle");
const countdownNote = document.getElementById("countdownNote");
const dlbl = document.getElementById("dlbl");
const hlbl = document.getElementById("hlbl");
const mlbl = document.getElementById("mlbl");
const slbl = document.getElementById("slbl");

// Yes result nodes
const yesTitle = document.getElementById("yesTitle");
const yesText = document.getElementById("yesText");

let noCount = 0;
const FINAL_NO_AT = 9;       // after this many "No" -> countdown
let changedOnce = false;     // start EN, after first No -> DE

const EN = {
  question: "Will you be my Valentine?",
  countdownTitle: "Countdown to Feb 14",
  countdownNote: "Bis bald ",
  labels: { d: "days", h: "hours", m: "minutes", s: "seconds" },
  yesTitle: "yaaaayyyy",
  yesText: "Freu ich mich."
};

const DE = {
  labels: { d: "Tage", h: "Stunden", m: "Minuten", s: "Sekunden" },
  countdownTitle: "Countdown bis zum 14. Februar",
  countdownNote: "Bis bald ",
  yesTitle: "yaaaayyyy",
  yesText: "Freu ich mich.",
  messages: [
    "Echt jetzt?",
    "Bist du dir sicher?",
    "Hmm okay…",
    "Aua.",
    "Ich frag einfach nochmal.",
    "Okay letzter Versuch…",
    "Warum so 😭",
    "Okay. Ich geb auf.",
    "Countdown läuft."
  ]
};

function rand(min, max){ return Math.floor(Math.random() * (max - min + 1)) + min; }
function clamp(n, min, max){ return Math.max(min, Math.min(max, n)); }

function haptic(){
  const card = document.querySelector(".card");
  if (!card) return;
  card.classList.remove("pulse");
  void card.offsetWidth;
  card.classList.add("pulse");
}

function moveNoButton(){
  const wrapRect = buttonsWrap.getBoundingClientRect();
  const btnRect = noBtn.getBoundingClientRect();

  const maxX = wrapRect.width - btnRect.width;
  const maxY = wrapRect.height - btnRect.height;

  const x = clamp(rand(0, maxX), 0, maxX);
  const y = clamp(rand(0, maxY), 0, maxY);

  noBtn.style.left = x + "px";
  noBtn.style.top  = y + "px";
  noBtn.style.right = "auto";
  noBtn.style.transform = `rotate(${rand(-10, 10)}deg)`;
}

function switchToGermanUI(){
  countdownTitle.textContent = DE.countdownTitle;
  countdownNote.textContent = DE.countdownNote;

  dlbl.textContent = DE.labels.d;
  hlbl.textContent = DE.labels.h;
  mlbl.textContent = DE.labels.m;
  slbl.textContent = DE.labels.s;

  yesTitle.textContent = DE.yesTitle;
  yesText.textContent = DE.yesText;
}

function setTextAfterNo(){
  if (!changedOnce) {
    changedOnce = true;
    switchToGermanUI();
  }
  const idx = clamp(noCount - 1, 0, DE.messages.length - 1);
  question.textContent = DE.messages[idx];
}

let countdownInterval = null;

function getNextValentines(){
  const now = new Date();
  // Feb = 1 (0=Jan)
  let target = new Date(now.getFullYear(), 1, 14, 0, 0, 0);
  if (target.getTime() <= now.getTime()) {
    target = new Date(now.getFullYear() + 1, 1, 14, 0, 0, 0);
  }
  return target;
}

function startCountdown(){
  const target = getNextValentines();

  const tick = () => {
    const diff = target.getTime() - Date.now();

    if (diff <= 0) {
      dEl.textContent = "00"; hEl.textContent = "00";
      mEl.textContent = "00"; sEl.textContent = "00";
      clearInterval(countdownInterval);
      countdownInterval = null;
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    dEl.textContent = String(days).padStart(2, "0");
    hEl.textContent = String(hours).padStart(2, "0");
    mEl.textContent = String(minutes).padStart(2, "0");
    sEl.textContent = String(seconds).padStart(2, "0");
  };

  tick();
  countdownInterval = setInterval(tick, 1000);
}

function showCountdownMode(){
  buttonsWrap.classList.add("hidden");
  result.classList.add("hidden");
  countdownBox.classList.remove("hidden");

  if (!changedOnce) {
    changedOnce = true;
    switchToGermanUI();
  }

  startCountdown();
}

function sprinkle(){
  const count = 16;
  for(let i=0;i<count;i++){
    const el = document.createElement("span");
    el.textContent = ["✦","✨","•","✺","⟡"][rand(0,4)];
    el.style.position = "fixed";
    el.style.left = rand(5, 95) + "vw";
    el.style.top = "-6vh";
    el.style.fontSize = rand(14, 26) + "px";
    el.style.opacity = "0.95";
    el.style.transition = "transform 1.2s ease, opacity 1.2s ease";
    el.style.zIndex = 9999;
    document.body.appendChild(el);

    requestAnimationFrame(() => {
      el.style.transform = `translateY(${rand(90, 112)}vh) rotate(${rand(-180, 180)}deg)`;
      el.style.opacity = "0";
    });

    setTimeout(() => el.remove(), 1300);
  }
}

function resetAll(){
  noCount = 0;
  changedOnce = false;

  question.textContent = EN.question;

  countdownTitle.textContent = EN.countdownTitle;
  countdownNote.textContent = EN.countdownNote;
  dlbl.textContent = EN.labels.d;
  hlbl.textContent = EN.labels.h;
  mlbl.textContent = EN.labels.m;
  slbl.textContent = EN.labels.s;

  yesTitle.textContent = EN.yesTitle;
  yesText.textContent = EN.yesText;

  buttonsWrap.classList.remove("hidden");
  result.classList.add("hidden");
  countdownBox.classList.add("hidden");

  noBtn.style.left = "auto";
  noBtn.style.top = "0";
  noBtn.style.right = "0";
  noBtn.style.transform = "none";

  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", () => {
  noCount += 1;
  haptic();
  setTextAfterNo();
  moveNoButton();

  if (noCount >= FINAL_NO_AT) {
    showCountdownMode();
  }
});

yesBtn.addEventListener("click", () => {
  console.log('yes clicked');
  haptic();

  if (question) question.textContent = "yaaaayyyy";

  // show the result section (text is already "Freu ich mich.")
  result?.classList.remove("hidden");
  countdownBox?.classList.add("hidden");
  sprinkle();
});

resetBtn?.addEventListener("click", resetAll);
resetBtn2?.addEventListener("click", resetAll);