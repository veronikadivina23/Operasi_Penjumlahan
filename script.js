// Canvas
const canvasLines = document.getElementById("canvasLines");
const ctxLines = canvasLines.getContext("2d");
const canvasAnim = document.getElementById("canvasAnim");
const ctxAnim = canvasAnim.getContext("2d");

// Elemen
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const popAudio = document.getElementById("popAudio");
const resultBox = document.getElementById("result-box");

// Variabel
let viewMin = -10;
let viewMax = 10;
let step = 40;

// Gambar garis bilangan
function drawNumberLine(min, max) {
  ctxLines.clearRect(0, 0, canvasLines.width, canvasLines.height);

  // garis utama
  ctxLines.beginPath();
  ctxLines.moveTo(50, 150);
  ctxLines.lineTo(850, 150);
  ctxLines.strokeStyle = "#000";
  ctxLines.lineWidth = 2;
  ctxLines.stroke();

  for (let i = min; i <= max; i++) {
    const x = 50 + (i - min) * step;

    // garis kecil
    ctxLines.beginPath();
    ctxLines.moveTo(x, 145);
    ctxLines.lineTo(x, 155);
    ctxLines.stroke();

    // angka
    ctxLines.font = "14px Arial";
    ctxLines.textAlign = "center";
    ctxLines.fillText(i, x, 170);
  }
}

// Garis putus-putus
function drawDashedLine(start, end, color, offsetY, label) {
  const xStart = 50 + (start - viewMin) * step;
  const xEnd = 50 + (end - viewMin) * step;

  ctxLines.beginPath();
  ctxLines.setLineDash([5,5]);
  ctxLines.moveTo(xStart, 150 - offsetY);
  ctxLines.lineTo(xEnd, 150 - offsetY);
  ctxLines.strokeStyle = color;
  ctxLines.lineWidth = 2;
  ctxLines.stroke();
  ctxLines.setLineDash([]);

  // panah
  ctxLines.beginPath();
  ctxLines.moveTo(xEnd, 150 - offsetY);
  ctxLines.lineTo(xEnd - 5 * Math.sign(xEnd - xStart), 150 - offsetY -5);
  ctxLines.lineTo(xEnd - 5 * Math.sign(xEnd - xStart), 150 - offsetY +5);
  ctxLines.closePath();
  ctxLines.fillStyle = color;
  ctxLines.fill();

  // label
  ctxLines.fillStyle = color;
  ctxLines.font = "12px Arial";
  ctxLines.fillText(label, (xStart + xEnd)/2, 150 - offsetY - 5);
}

// Bunyi pop
function playPop() {
  const sound = popAudio.cloneNode();
  sound.volume = 0.4;
  sound.play().catch(()=>{});
}

// Animasi lompat
function animateSteps(start, end, color, offsetY, callback) {
  let current = start;
  const increment = end > start ? 1 : -1;

  function stepAnimation() {
    ctxAnim.clearRect(0, 0, canvasAnim.width, canvasAnim.height);

    const x = 50 + (current - viewMin) * step;
    const y = 150 - offsetY * ((current % 2 === 0) ? 1 : -1);

    ctxAnim.beginPath();
    ctxAnim.arc(x, y, 5, 0, 2*Math.PI);
    ctxAnim.fillStyle = color;
    ctxAnim.fill();

    playPop();

    if (current !== end) {
      current += increment;
      setTimeout(stepAnimation, 500);
    } else {
      callback();
    }
  }
  stepAnimation();
}

// Bundaran hasil
function drawResultCircle(result) {
  const x = 50 + (result - viewMin) * step;
  ctxAnim.beginPath();
  ctxAnim.arc(x, 150, 8, 0, 2*Math.PI);
  ctxAnim.fillStyle = "green";
  ctxAnim.fill();
}

// Geser view
function adjustView(num1, num2) {
  const result = num1 + num2;
  let minVisible = -10;
  let maxVisible = 10;

  if (num1 < minVisible || result < minVisible) minVisible = Math.min(num1,result) -2;
  if (num1 > maxVisible || result > maxVisible) maxVisible = Math.max(num1,result) +2;

  viewMin = minVisible;
  viewMax = maxVisible;
}

// Tombol Mulai
startBtn.addEventListener("click", () => {
  const num1 = parseInt(document.getElementById("num1").value);
  const num2 = parseInt(document.getElementById("num2").value);
  if (isNaN(num1) || isNaN(num2)) return;

  const result = num1 + num2;
  adjustView(num1, num2);

  drawNumberLine(viewMin, viewMax);
  drawDashedLine(0, num1, "red", 35, num1);  
  drawDashedLine(num1, result, "blue", 20, num2 < 0 ? `(${num2})` : num2); 

  resultBox.innerHTML = `${num1} + (${num2}) = ?`;

  animateSteps(0, num1, "red", 35, () => {
    animateSteps(num1, result, "blue", 20, () => {
      drawResultCircle(result);
      resultBox.innerHTML = `${num1} + (${num2}) = <b>${result}</b>`;
    });
  });
});

// Tombol Refresh
resetBtn.addEventListener("click", () => {
  document.getElementById("num1").value = "";
  document.getElementById("num2").value = "";
  resultBox.innerHTML = "";
  viewMin = -10;
  viewMax = 10;
  drawNumberLine(viewMin, viewMax);
  ctxAnim.clearRect(0,0,canvasAnim.width,canvasAnim.height);
});

// Inisialisasi
drawNumberLine(viewMin, viewMax);
