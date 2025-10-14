const canvas = document.getElementById("numberLine");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const resultInput = document.getElementById("result");
const num1Input = document.getElementById("num1");
const num2Input = document.getElementById("num2");

// Fungsi menggambar garis bilangan
function drawNumberLine(center = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const step = 40;
  const visibleRange = 10;
  const zeroX = canvas.width / 2 - center * step;

  // garis utama
  ctx.beginPath();
  ctx.moveTo(50, 150);
  ctx.lineTo(canvas.width - 50, 150);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  // titik & angka
  for (let i = -visibleRange; i <= visibleRange; i++) {
    const x = zeroX + i * step;
    ctx.beginPath();
    ctx.moveTo(x, 145);
    ctx.lineTo(x, 155);
    ctx.stroke();

    ctx.fillStyle = "black";
    ctx.font = "14px Poppins";
    ctx.fillText(i + center, x - 5, 175);
  }

  // panah ujung kanan
  ctx.beginPath();
  ctx.moveTo(canvas.width - 60, 150);
  ctx.lineTo(canvas.width - 50, 145);
  ctx.lineTo(canvas.width - 50, 155);
  ctx.fill();

  // panah ujung kiri
  ctx.beginPath();
  ctx.moveTo(60, 150);
  ctx.lineTo(50, 145);
  ctx.lineTo(50, 155);
  ctx.fill();
}

// Gambar garis putus-putus dengan panah dan label
function drawDashedArrow(from, to, color, label, level = 0) {
  const step = 40;
  const zeroX = canvas.width / 2;
  const y = 120 - level * 20;

  ctx.strokeStyle = color;
  ctx.setLineDash([6, 5]);
  ctx.lineWidth = 2;

  // garis putus-putus
  ctx.beginPath();
  ctx.moveTo(zeroX + from * step, y);
  ctx.lineTo(zeroX + to * step, y);
  ctx.stroke();

  // panah di ujung
  ctx.setLineDash([]);
  const arrowDir = to > from ? 1 : -1;
  const arrowX = zeroX + to * step;
  ctx.beginPath();
  ctx.moveTo(arrowX, y);
  ctx.lineTo(arrowX - 10 * arrowDir, y - 5);
  ctx.lineTo(arrowX - 10 * arrowDir, y + 5);
  ctx.fillStyle = color;
  ctx.fill();

  // label di atas garis
  ctx.fillStyle = color;
  ctx.font = "16px Poppins";
  ctx.fillText(label, zeroX + ((from + to) / 2) * step - 8, y - 5);
}

// Gambar bulatan kecil
function drawCircle(value, color) {
  const step = 40;
  const zeroX = canvas.width / 2;
  ctx.beginPath();
  ctx.arc(zeroX + value * step, 150, 5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
}

// Update tampilan
function update() {
  const num1 = parseInt(num1Input.value);
  const num2 = parseInt(num2Input.value);
  if (isNaN(num1) || isNaN(num2)) return;

  const result = num1 + num2;
  resultInput.value = result;

  let center = 0;
  // Geser agar hasil tetap terlihat
  if (result > 10) center = result - 10;
  else if (result < -10) center = result + 10;

  drawNumberLine(center);

  // Garis & panah bilangan pertama (kuning)
  drawDashedArrow(0, num1, "gold", num1, 0);
  drawCircle(num1, "gold");

  // Garis & panah bilangan kedua (hijau), sedikit di atas agar tidak menabrak
  drawDashedArrow(num1, num1 + num2, "limegreen", num2, 1);
  drawCircle(num1 + num2, "limegreen");

  // Bulatan merah untuk hasil
  drawCircle(result, "red");
}

startBtn.onclick = update;

resetBtn.onclick = () => {
  num1Input.value = "";
  num2Input.value = "";
  resultInput.value = "";
  drawNumberLine(0);
};

// tampil awal
drawNumberLine(0);
