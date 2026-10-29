/* ==========================================================
   ตั้งค่าตรงนี้ได้เลย
   หรือใส่ชื่อทางลิงก์ เช่น  index.html?name=มะลิ&from=เพื่อนซี้
   ========================================================== */
const CONFIG = {
  name: "แพรวววว",
  from: "บุคคลที่รักคุณมากมาย 💖",
  title: "¡Feliz cumpleaños!",
  wishSeconds: 3,            // เวลาให้อธิษฐาน (วินาที)
  youtube: "",               // วางลิงก์ YouTube ตรงนี้ เช่น "https://www.youtube.com/watch?v=xxxxxxxxxxx"
  youtubeStart: 0,           // เริ่มเล่นที่วินาทีที่เท่าไร (ข้ามช่วงโฆษณา/intro ได้)
 photos: ["images/photo1.jpg", "images/photo2.jpg", "images/photo3.jpg"],
  message: [
    "Feliz cumpleaños ในที่คือก็แปลว่าสุขสันต์วันเกิดนั่นแหละ คำอวยพรอาจจะยาวหน่อยแต่อยากให้อ่านให้จบนะ แพรวโตขึ้นอีกปีแล้วนะ เก่งมากเยยย ก็ขอให้ปีนี้ดีกว่าทุกปีที่ผ่านมา ขอให้โชคดีในทุกการเติบโต มีคนรักและเอ็นดูเยอะแยะ แต่เยอะเกินเราก็จะหวงอะดิ แต่ก็น่าจะดีนะ ขอให้ไม่มีฝนตกในใจ ถ้าแพรวยิ้มได้เยอะๆก็จะดี แต่ถ้าส่งมาให้เราดูด้วยก็จะดียิ่งกว่า และไม่ว่าแพรวจะเจอปัญหาอะไร เค้าเชื่อว่าแพรวจะผ่านไปได้แน่นอน เค้าจะอยู่ตรงกับแพรวเสมอ แล้วก็อย่าลืมดูแลตัวเอง รู้มั้ยว่าเค้าเป็นห่วงขนาดไหนเวลาแพรวไม่ได้กินข้าวแล้วบ่นปวดท้อง ตื่นมาปวดหัว แล้วก็มีเรื่องอะไรก็ทักมาระบายได้ เจอเรื่องอะไรในชีวิตประจำวันก็อยากให้มาเล่าให้ฟัง พร้อมรับฟังเสมอ and finally, i luv u just the way you are- always"
    
  ]
};

/* ---------- อ่านค่าจากลิงก์ ---------- */
const params = new URLSearchParams(location.search);
if (params.get("name")) CONFIG.name = params.get("name");
if (params.get("from")) CONFIG.from = params.get("from");

/* ---------- อ้างอิงองค์ประกอบ ---------- */
const $ = (id) => document.getElementById(id);
const cake = $("cake");
const candles = document.querySelector(".candles");
const hint = $("hint");
const countdown = $("countdown");
const overlay = $("overlay");
const confetti = $("confetti");
const bgm = $("bgm");
const soundBtn = $("sound");
const photosBox = $("photos");
CONFIG.photos.forEach((src) => {
  const fig = document.createElement("figure");
  fig.className = "photo";
  const img = new Image();
  img.src = src;
  img.alt = "";
  img.onerror = () => fig.remove();   // ไม่มีไฟล์รูปก็ข้ามไป ไม่พัง
  fig.appendChild(img);
  photosBox.appendChild(fig);
});

/* ---------- ใส่ข้อความบนกระดาษ (ใช้ textContent กันโค้ดแปลกปลอมจากลิงก์) ---------- */
$("title").textContent = CONFIG.title;
$("to").textContent = "ถึง " + CONFIG.name;
$("from").textContent = "จาก " + CONFIG.from;
CONFIG.message.forEach((line) => {
  const p = document.createElement("p");
  p.textContent = line;
  $("message").appendChild(p);
});

/* ---------- ขั้นที่ 1: นับถอยหลังให้อธิษฐาน ---------- */
let timer = null;

function startWish() {
  let n = CONFIG.wishSeconds;
  cake.disabled = true;
  cake.classList.remove("ready");
  candles.classList.remove("out");
  countdown.classList.remove("hide");
  hint.textContent = "เวลาอธิษฐาน 🙏";
   document.querySelectorAll(".photo").forEach((p) => p.classList.remove("in"));

  const show = () => {
    countdown.textContent = n;
    countdown.classList.remove("tick");
    void countdown.offsetWidth;          // รีสตาร์ทแอนิเมชัน
    countdown.classList.add("tick");
        const photo = photosBox.children[CONFIG.wishSeconds - n];   // เลข 3 → รูปที่ 1, เลข 2 → รูปที่ 2 ...
    if (photo) photo.classList.add("in");
  };
  show();

  clearInterval(timer);
  timer = setInterval(() => {
    n--;
    if (n > 0) { show(); return; }
    clearInterval(timer);
     document.querySelectorAll(".photo").forEach((p) => p.classList.add("in"));
    countdown.classList.add("hide");
    hint.textContent = "แตะที่เค้กเพื่อเป่าเทียน 🎂";
    cake.disabled = false;
    cake.classList.add("ready");
    cake.focus({ preventScroll: true });
  }, 1000);
}

/* ---------- ขั้นที่ 2: เป่าเทียน ---------- */
cake.addEventListener("click", () => {
  if (cake.disabled) return;
  cake.disabled = true;
  cake.classList.remove("ready");
  candles.classList.add("out");
  hint.textContent = "เย่ะ 💨";

  document.querySelectorAll(".candle").forEach((c, i) => {
    setTimeout(() => {
      const s = document.createElement("span");
      s.className = "smoke";
      c.appendChild(s);
      setTimeout(() => s.remove(), 1700);
    }, i * 120);
  });

  launchConfetti();
  playMusic();
  setTimeout(showPaper, 1400);
});

/* ---------- ขั้นที่ 3: กระดาษคำอวยพร ---------- */
function showPaper() {
  hint.textContent = "";
  overlay.classList.add("show");
  overlay.setAttribute("aria-hidden", "false");
}

$("replay").addEventListener("click", () => {
  overlay.classList.remove("show");
  overlay.setAttribute("aria-hidden", "true");
  setTimeout(startWish, 400);
});

/* ---------- เพลง ----------
   เบราว์เซอร์ไม่ให้เล่นเสียงเองก่อนที่ผู้ใช้จะแตะหน้าจอ
   จึงเริ่มเพลงตอน "แตะเค้กเป่าเทียน" ซึ่งเป็นการแตะอยู่แล้ว
   - ถ้าตั้ง CONFIG.youtube ไว้ จะเล่นจาก YouTube (ซ่อนตัววิดีโอ)
   - ถ้าไม่ได้ตั้ง จะเล่นไฟล์ audio/birthday.mp3 แทน */
bgm.volume = 0.7;

function getYouTubeId(url) {
  const m = String(url || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/|live\/)([\w-]{11})/);
  return m ? m[1] : null;
}

const ytId = getYouTubeId(CONFIG.youtube);
let ytPlayer = null;
let ytReady = false;
let ytWantPlay = false;
let muted = false;

function showSoundBtn() {
  soundBtn.hidden = false;
  soundBtn.textContent = muted ? "🔇" : "🔊";
}

if (ytId) {
  // โหลดตัวเล่นตั้งแต่เปิดหน้า เพื่อให้พร้อมตอนกดเค้ก
  window.onYouTubeIframeAPIReady = () => {
    ytPlayer = new YT.Player("yt-player", {
      width: "2",
      height: "2",
      videoId: ytId,
      playerVars: {
        playsinline: 1, controls: 0, rel: 0, disablekb: 1,
        loop: 1, playlist: ytId, start: CONFIG.youtubeStart
      },
      events: {
        onReady: () => {
          ytReady = true;
          ytPlayer.setVolume(70);
          if (ytWantPlay) ytPlayer.playVideo();
        },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) showSoundBtn();
        }
      }
    });
  };
  const tag = document.createElement("script");
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}

function playMusic() {
  if (ytId) {
    ytWantPlay = true;
    if (ytReady) {
      ytPlayer.seekTo(CONFIG.youtubeStart, true);
      ytPlayer.playVideo();
    }
    return;
  }
  bgm.currentTime = 0;
  const p = bgm.play();
  if (p && p.catch) p.catch(() => {});   // ไม่มีไฟล์เพลงก็ไม่เป็นไร หน้าเว็บยังทำงานต่อ
  bgm.addEventListener("playing", showSoundBtn, { once: true });
}

soundBtn.addEventListener("click", () => {
  muted = !muted;
  if (ytId && ytReady) muted ? ytPlayer.mute() : ytPlayer.unMute();
  else bgm.muted = muted;
  soundBtn.textContent = muted ? "🔇" : "🔊";
});

/* ---------- confetti ---------- */
function launchConfetti() {
  const colors = ["#ff8fab", "#ffb84d", "#8fd6c0", "#fff8ec", "#b79cff"];
  for (let i = 0; i < 90; i++) {
    const piece = document.createElement("i");
    piece.style.left = Math.random() * 100 + "vw";
    piece.style.background = colors[i % colors.length];
    piece.style.animationDuration = 2.4 + Math.random() * 2.6 + "s";
    piece.style.animationDelay = Math.random() * 0.8 + "s";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    confetti.appendChild(piece);
    setTimeout(() => piece.remove(), 6500);
  }
}

startWish();
