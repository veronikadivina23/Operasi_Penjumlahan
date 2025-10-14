const canvas = document.getElementById('lineCanvas');
const ctx = canvas.getContext('2d');

let viewMin = -10;
let viewMax = 10;

// Audio pop
const popSound = new Audio('pop.mp3');

// Fungsi background dengan bintang & awan
function drawBackground() {
  ctx.fillStyle = '#ccefff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i=0; i<15; i++) {
    ctx.beginPath();
    const x = Math.random()*canvas.width;
    const y = Math.random()*50 + 20;
    ctx.arc(x, y, 3, 0, 2*Math.PI);
    ctx.fillStyle = '#fffacd';
    ctx.fill();
  }

  ctx.fillStyle = '#ffffffaa';
  ctx.beginPath();
  ctx.arc(150, 50, 20, 0, 2*Math.PI);
  ctx.arc(170, 50, 25, 0, 2*Math.PI);
  ctx.arc(190, 50, 20, 0, 2*Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(600, 40, 25, 0, 2*Math.PI);
  ctx.arc(630, 40, 30, 0, 2*Math.PI);
  ctx.arc(660, 40, 25, 0, 2*Math.PI);
  ctx.fill();
}

// Gambar garis bilangan
function drawNumberLine(min = viewMin, max = viewMax) {
  drawBackground();

  ctx.beginPath();
  ctx.moveTo(50, 150);
  ctx.lineTo(850, 150);
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.stroke();

  const totalNumbers = max - min;
  const step = 800 / totalNumbers;

  ctx.font = "16px Arial";
  for (let i = min; i <= max; i++) {
    const x = 50 + (i - min) * step;
    ctx.beginPath();
    ctx.moveTo(x, 145);
    ctx.lineTo(x, 155);
    ctx.stroke();
    ctx.fillText(i, x - 5, 170);
  }

  return step;
}

// Garis putus-putus dengan label
function drawDashedLineWithLabel(start, end, color, step, min, label, yOffset) {
  const xStart = 50 + (start - min) * step;
  const xEnd = 50 + (end - min) * step;

  ctx.beginPath();
  ctx.setLineDash([5,5]);
  ctx.moveTo(xStart, yOffset);
  ctx.lineTo(xEnd, yOffset);
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.moveTo(xEnd, yOffset);
  ctx.lineTo(xEnd - 5 * Math.sign(xEnd - xStart), yOffset - 5);
  ctx.lineTo(xEnd - 5 * Math.sign(xEnd - xStart), yOffset + 5);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();

  ctx.fillStyle = color;
  ctx.font = "12px Arial";
  ctx.fillText(label, (xStart + xEnd)/2 - 6, yOffset - 5);
}

// Animasi bundaran langkah halus + bunyi
function animateSteps(start, end, color, step, min, callback) {
  let current = start;
  const increment = (end > start) ? 0.2 : -0.2; // perlahan
  let jumpUp = true;

  function stepAnimation() {
    drawNumberLine(viewMin, viewMax);

    for (let pos = start; (increment>0)? pos<=current : pos>=current; pos+=increment) {
      const xTrail = 50 + (pos - min) * step;
      const yTrail = 150 + (jumpUp ? -5 : 0);
      ctx.beginPath();
      ctx.arc(xTrail, yTrail, 4, 0, 2*Math.PI); 
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Bunyi pop tiap bilangan bulat
    if (Math.abs(current % 1) < 0.2) {
      popSound.currentTime = 0;
      popSound.play();
    }

    jumpUp = !jumpUp;

    if ((increment > 0 && current < end) || (increment < 0 && current > end)) {
      current += increment;
      setTimeout(stepAnimation, 50); // lambat & halus
    } else {
      callback();
    }
  }
  stepAnimation();
}

// Bundaran hijau hasil
function drawResultCircle(position, step, min) {
  const x = 50 + (position - min) * step;
  ctx.beginPath();
  ctx.arc(x, 150, 5, 0, 2*Math.PI);
  ctx.fillStyle = "green";
  ctx.fill();
}

// Sesuaikan view
function adjustView(num1, num2) {
  const result = num1 + num2;
  let minVisible = -10;
  let maxVisible = 10;
  if (num1 < minVisible || result < minVisible) minVisible = Math.min(num1, result)-2;
  if (num1 > maxVisible || result > maxVisible) maxVisible = Math.max(num1, result)+2;
  viewMin = minVisible;
  viewMax = maxVisible;
}

// Tombol Mulai
document.getElementById('startBtn').addEventListener('click', () => {
  let num1 = parseInt(document.getElement
