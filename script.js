const canvas = document.getElementById("numberLine");
const ctx = canvas.getContext("2d");

const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const resultDisplay = document.getElementById("result");
const num1Input = document.getElementById("num1");
const num2Input = document.getElementById("num2");

let num1 = null, num2 = null, result = null;
let offset = 0;

function drawLine() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const centerX = canvas.width / 2 + offset;
  const step = 40;

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.lineTo(canvas.width, 100);
  ctx.stroke();

  // tanda tiap bilangan
  ctx.font = "16px Poppins";
  ctx.textAlign = "center";
  for (let i = -10; i <= 10; i++) {
    const x = centerX + i * step;
    ctx.beginPath();
    ctx.moveTo(x, 95);
    ctx.lineTo(x, 105);
    ctx.stroke();
    ctx.fillStyle = "black";
    ctx.fillText(i, x, 125);
  }

  // nol selalu terlihat
  const zeroX = centerX;
  ctx.beginPath();
  ctx.moveTo(zeroX, 90);
  ctx.lineTo(zeroX, 110);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawArrow(from, to, color, label) {
  const step = 40;
  const baseY = 100;
  const height = 50;

  ctx.setLineDash([6, 5]);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(from, baseY);
  ctx.lineTo(to, baseY - height);
  ctx.stroke();

  // panah
  const arrowSize = 10;
  ctx.beginPath();
  if (to > from) {
    ctx.moveTo(to - arrowSize, baseY - height - arrowSize / 2);
    ctx.lineTo(to, baseY - height);
    ctx.lineTo(to - arrowSize, baseY - height + arrowSize / 2);
  } else {
    ctx.moveTo(to + arrowSize, baseY - height - arrowSize / 2);
    ctx.lineTo(to, baseY - height);
    ctx.lineTo(to + arrowSize, baseY - height + arrowSize / 2);
  }
  ctx.stroke();

  // label
  ctx.setLineDash([]);
  ctx.fillStyle = color;
  ctx.font = "16px Poppins";
  ctx.textAlign = "center";
  ctx.fillText(label, (from + to) / 2, baseY - height - 10);
}

function drawBall(position, color) {
  const baseY = 100;
  const step = 40;
  const centerX = canvas.width / 2 + offset;
  const x = centerX + position * step;

  ctx.beginPath();
  ctx.arc(x, baseY, 8, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function start() {
  num1 = parseInt(num1Input.value);
  num2 = parseInt(num2Input.value);

  if (isNaN(num1) || isNaN(num2)) {
    alert("Masukkan kedua bilangan terlebih dahulu (antara -10 hingga 10)!");
    return;
  }

  result = num1 + num2;
  resultDisplay.textContent = `${num1} + ${num2} = ${result}`;

  // perhitungan pergeseran
  const step = 40;
  const baseVisibleRange = 10;
  if (result > baseVisibleRange - 2) offset = -(result - (baseVisibleRange - 2)) * step;
  else if (result < -(baseVisibleRange - 2)) offset = -(result + (baseVisibleRange - 2)) * step;
  else offset = 0;

  // gambar ulang
  drawLine();
  const centerX = canvas.width / 2 + offset;
  const stepSize = 40;

  // titik bilangan 1
  const startX = centerX;
  const endX1 = centerX + num1 * stepSize;
  drawArrow(startX, endX1, "blue", num1);
  drawBall(num1, "blue");

  // titik bilangan 2
  const startX2 = endX1;
  const endX2 = endX1 + num2 * stepSize;
  drawArrow(startX2, endX2, "green", num2);
  drawBall(num2 + num1, "red");
}

function reset() {
  num1Input.value = "";
  num2Input.value = "";
  resultDisplay.textContent = "";
  offset = 0;
  drawLine();
}

startBtn.addEventListener("click", start);
resetBtn.addEventListener("click", reset);
drawLine();
