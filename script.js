const canvas = document.getElementById("numberLine");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const resultBox = document.getElementById("result");
const num1Input = document.getElementById("num1");
const num2Input = document.getElementById("num2");

let animationFrame;
const step = 50; // jarak antar angka

function drawNumberLine(center = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const visibleRange = 10;
  const zeroX = canvas.width / 2 - center * step;

  // garis utama
  ctx.beginPath();
  ctx.moveTo(50, 150);
  ctx.lineTo(canvas.width - 50, 150);
  ctx.strokeStyle = "#3498db";
  ctx.lineWidth = 4;
  ctx.stroke();

  // angka & tanda
  for (let i = -visibleRange; i <= visibleRange; i++) {
    const x = zeroX + i * step;
    ctx.beginPath();
    ctx.moveTo(x, 145);
    ctx.lineTo(x, 155);
    ctx.strokeStyle = "#2980b9";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = i === 0 ? "#e74c3c" : "#2c3e50";
    ctx.font = "bold 16px Comic Sans MS";
    ctx.fillText(i + center, x - 7, 175);
  }

  // panah kiri-kanan
  ctx.fillStyle = "#3498db";
  ctx.beginPath();
  ctx.moveTo(60, 150);
  ctx.lineTo(50, 145);
  ctx.lineTo(50, 155);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(canvas.width - 60, 150);
  ctx.lineTo(canvas.width - 50, 145);
  ctx.lineTo(canvas.width - 50, 155);
  ctx.fill();
}

// menggambar bola
function drawBall(x, color, size = 10) {
  ctx.beginPath();
  ctx.arc(x, 150, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

// animasi lompatan
function animateJump(start, end, color, callback) {
  let pos = start;
  const dir = end > start ? 1 : -1;

  function frame() {
    drawNumberLine(currentCenter);
    drawBall(canvas.width / 2 - currentCenter * step + pos * step, color);
    pos += 0.1 * dir;

    if ((dir > 0 && pos < end) || (dir < 0 && pos > end)) {
      animationFrame = requestAnimationFrame(frame);
    } else {
      drawNumberLine(currentCenter);
      drawBall(canvas.width / 2 - currentCenter * step + end * step, color);
      cancelAnimationFrame(animationFrame);
      if (callback) callback();
    }
  }
  frame();
}

let currentCenter = 0;

function startAnimation() {
  const num1 = parseInt(num1Input.value);
  const num2 = parseInt(num2Input.value);
  if (isNaN(num1) || isNaN(num2)) return;

  const result = num1 + num2;
  resultBox.value = result;

  // pastikan hasil terlihat
  if (result > 10) currentCenter = result - 10;
  else if (result < -10) currentCenter = result + 10;
  else currentCenter = 0;

  drawNumberLine(currentCenter);

  const zeroX = canvas.width / 2 - currentCenter * step;

  // animasi bola kuning (bilangan 1)
  animateJump(0, num1, "#f1c40f", () => {
    // animasi bola hijau (bilangan 2)
    animateJump(num1, num1 + num2, "#2ecc71", () => {
      // tampilkan bola hasil merah besar
      drawNumberLine(currentCenter);
      drawBall(zeroX + result * step, "#e74c3c", 14);
    });
  });
}

startBtn.onclick = startAnimation;
resetBtn.onclick = () => {
  num1Input.value = "";
  num2Input.value = "";
  resultBox.value = "";
  currentCenter = 0;
  cancelAnimationFrame(animationFrame);
  drawNumberLine(0);
};

drawNumberLine(0);
