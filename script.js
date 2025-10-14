const num1Input = document.getElementById("num1");
const num2Input = document.getElementById("num2");
const numberLine = document.getElementById("numberLine");
const resultBox = document.getElementById("resultBox");

const min = -15, max = 15;
const visibleMin = -10, visibleMax = 10;
const width = 600;

function scaleX(n) {
  return ((n - visibleMin) / (visibleMax - visibleMin)) * width;
}

// Tambahkan tanda angka pada garis
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

function animateBall(ball, start, end) {
  const duration = 500; // ms
  const startTime = performance.now();

  function animate(time) {
    const t = Math.min((time - startTime) / duration, 1);
    const x = start + (end - start) * t;
    ball.style.left = x + "px";
    if (t < 1) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

function update() {
  const num1 = parseInt(num1Input.value) || 0;
  const num2 = parseInt(num2Input.value) || 0;
  const result = num1 + num2;

  const x0 = scaleX(0);
  const x1 = scaleX(num1);
  const x2 = scaleX(result);

  animateBall(ball1, parseFloat(ball1.style.left) || x0, x1);
  animateBall(ball2, parseFloat(ball2.style.left) || x0, x2);
  ballResult.style.left = x2 + "px";

  line1.setAttribute("x1", x0);
  line1.setAttribute("x2", x1);
  line2.setAttribute("x1", x1);
  line2.setAttribute("x2", x2);

  resultBox.textContent = `Bilangan 1 + Bilangan 2 = ${result}`;
}

num1Input.addEventListener("input", update);
num2Input.addEventListener("input", update);
update();
