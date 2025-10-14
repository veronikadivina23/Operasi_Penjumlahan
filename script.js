const num1Input = document.getElementById("num1");
const num2Input = document.getElementById("num2");
const numberLine = document.getElementById("numberLine");
const resultBox = document.getElementById("resultBox");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");

const min = -15, max = 15;
const visibleMin = -10, visibleMax = 10;
const width = 600;

function scaleX(n) {
  return ((n - visibleMin) / (visibleMax - visibleMin)) * width;
}

// Buat angka di garis bilangan
for (let n = visibleMin; n <= visibleMax; n++) {
  const tick = document.createElement("div");
  tick.className = "tick";
  tick.style.left = scaleX(n) + "px";
  tick.innerHTML = n;
  numberLine.appendChild(tick);
}

// Buat bola
const ball1 = document.createElement("div");
ball1.className = "ball yellow";
const ball2 = document.createElement("div");
ball2.className = "ball green";
const ballResult = document.createElement("div");
ballResult.className = "ball red";
numberLine.appendChild(ball1);
numberLine.appendChild(ball2);
numberLine.appendChild(ballResult);

const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");

// Fungsi animasi garis (panah)
function animateLine(line, start, end, color, callback) {
  let progress = 0;
  const step = () => {
    progress += 0.02;
    if (progress > 1) progress = 1;
    const currentX = start + (end - start) * progress;
    line.setAttribute("x1", start);
    line.setAttribute("x2", currentX);
    if (progress < 1) requestAnimationFrame(step);
    else if (callback) callback();
  };
  line.setAttribute("stroke", color);
  line.setAttribute("x1", start);
  line.setAttribute("x2", start);
  requestAnimationFrame(step);
}

function resetAll() {
  const x0 = scaleX(0);
  ball1.style.left = x0 + "px";
  ball2.style.left = x0 + "px";
  ballResult.style.left = x0 + "px";
  line1.setAttribute("x1", x0);
  line1.setAttribute("x2", x0);
  line2.setAttribute("x1", x0);
  line2.setAttribute("x2", x0);
  resultBox.textContent = "Bilangan 1 + Bilangan 2 = 0";
}

function startAnimation() {
  const num1 = parseInt(num1Input.value) || 0;
  const num2 = parseInt(num2Input.value) || 0;
  const result = num1 + num2;

  const x0 = scaleX(0);
  const x1 = scaleX(num1);
  const x2 = scaleX(result);

  // Reset dulu posisi
  resetAll();

  // Jalankan animasi
  animateLine(line1, x0, x1, "yellow", () => {
    ball1.style.left = x1 + "px";
    animateLine(line2, x1, x2, "limegreen", () => {
      ball2.style.left = x2 + "px";
      ballResult.style.left = x2 + "px";
      resultBox.textContent = `Bilangan 1 + Bilangan 2 = ${result}`;
    });
  });
}

// Tombol
startBtn.addEventListener("click", startAnimation);
resetBtn.addEventListener("click", resetAll);

// Inisialisasi awal
resetAll();
