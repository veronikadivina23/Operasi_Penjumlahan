const canvas = document.getElementById("numberLine");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const resultInput = document.getElementById("result");

let num1Input = document.getElementById("num1");
let num2Input = document.getElementById("num2");

function drawNumberLine(center = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const step = 40;
  const visibleRange = 10;
  const zeroX = canvas.width / 2 - center * step;

  // Garis utama
  ctx.beginPath();
  ctx.moveTo(50, 130);
  ctx.lineTo(canvas.width - 50, 130);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tanda dan angka
  for (let i = -visibleRange; i <= visibleRange; i++) {
    const x = zeroX + i * step;
    ctx.beginPath();
    ctx.moveTo(x, 125);
    ctx.lineTo(x, 135);
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "14px Poppins";
    ctx.fillText(i + center, x - 5, 150);
  }

  // Panah kiri dan kanan
  ctx.beginPath();
  ctx.moveTo(canvas.width - 60, 130);
  ctx.lineTo(canvas.width - 50, 125);
  ctx.lineTo(canvas.width - 50, 135);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(60, 130);
  ctx.lineTo(50, 125);
  ctx.lineTo(50, 135);
  ctx.fill();
}

function drawDashedArrow(from, to, color, label) {
  const step = 40;
  const zeroX = canvas.width / 2;
  const y = 90;

  ctx.strokeStyle = color;
  ctx.setLineDash([6, 4]);
  ctx.beginPath();
  ctx.moveTo(zeroX + from * step, y);
  ctx.lineTo(zeroX + to * step, y);
  ctx.stroke();
  ctx.setLineDash([]);

  // Panah di ujung
  const arrowDir = to > from ? 1 : -1;
  ctx.beginPath();
  ctx.moveTo(zeroX + to * step, y);
  ctx.lineTo(zeroX + to * step - 8 * arrowDir, y - 5);
  ctx.lineTo(zeroX + to * step - 8 * arrowDir, y + 5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  // Label di atas garis
  ctx.fillStyle = color;
  ctx.font = "16px Poppins";
  ctx.fillText(label, zeroX + ((from + to) / 2) * step - 5, y - 10);
}

function drawCircle(value, color) {
  const step = 40;
  const zeroX = canvas.width / 2;
  ctx.beginPath();
  ctx.arc(zeroX + value * step, 130, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

function update() {
  const num1 = parseInt(num1Input.value);
  const num2 = parseInt(num2Input.value);
  if (isNaN(num1) || isNaN(num2)) return;

  const result = num1 + num2;
  resultInput.value = result;

  let center = 0;
  if (result > 10) center = result - 10;
  else if (result < -10) center = result + 10;

  drawNumberLine(center);

  // Bilangan pertama
  drawDashedArrow(0, num1, "gold", num1);
  drawCircle(num1, "gold");

  // Bilangan kedua (tetap di atas bilangan pertama)
  drawDashedArrow(num1, num1 + num2, "limegreen", num2);
  drawCircle(num1 + num2, "limegreen");

  // Hasil
  drawCircle(result, "red");
}

startBtn.onclick = update;
resetBtn.onclick = () => {
  num1Input.value = "";
  num2Input.value = "";
  resultInput.value = "";
  drawNumberLine(0);
};

drawNumberLine(0);
