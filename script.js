const canvas = document.getElementById("garisBilangan");
const ctx = canvas.getContext("2d");
const bil1Input = document.getElementById("bil1");
const bil2Input = document.getElementById("bil2");
const hasilBox = document.getElementById("hasil");
const tombolMulai = document.getElementById("mulai");
const tombolRefresh = document.getElementById("refresh");

let animating = false;
let centerValue = 0; // titik tengah garis bilangan

tombolMulai.addEventListener("click", mulaiOperasi);
tombolRefresh.addEventListener("click", resetGambar);

gambarGarisBilangan();

function gambarGarisBilangan() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const start = centerValue - 10;
  const end = centerValue + 10;

  ctx.beginPath();
  ctx.moveTo(50, 100);
  ctx.lineTo(950, 100);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  for (let i = start; i <= end; i++) {
    const x = 500 + (i - centerValue) * 45;
    if (x >= 50 && x <= 950) {
      ctx.beginPath();
      ctx.moveTo(x, 95);
      ctx.lineTo(x, 105);
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = "blue";
      ctx.font = "14px Poppins";
      ctx.fillText(i, x - 6, 120);
    }
  }
}

function mulaiOperasi() {
  if (animating) return;

  const bil1 = parseInt(bil1Input.value);
  const bil2 = parseInt(bil2Input.value);

  if (isNaN(bil1) || isNaN(bil2)) {
    alert("Silakan isi kedua bilangan terlebih dahulu!");
    return;
  }

  const hasil = bil1 + bil2;
  hasilBox.textContent = "";
  hasilBox.classList.remove("show");

  // pusatkan garis bilangan agar hasil terlihat
  centerValue = hasil;
  gambarGarisBilangan();

  const pos0 = 500 + (0 - centerValue) * 45;
  const pos1 = 500 + (bil1 - centerValue) * 45;
  const pos2 = 500 + (hasil - centerValue) * 45;

  animating = true;
  animasiBola(pos0, pos1, "yellow", () => {
    animasiBola(pos1, pos2, "green", () => {
      // titik hasil merah kecil
      ctx.beginPath();
      ctx.arc(pos2, 100, 6, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();

      hasilBox.textContent = `${bil1} + ${bil2} = ${hasil}`;
      hasilBox.classList.add("show");
      animating = false;
    });
  });
}

function animasiBola(startX, endX, color, callback) {
  let progress = 0;
  const durasi = 60;
  const step = () => {
    gambarGarisBilangan();
    progress++;
    const x = startX + (endX - startX) * (progress / durasi);

    ctx.beginPath();
    ctx.arc(x, 100, 6, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    if (progress < durasi) {
      requestAnimationFrame(step);
    } else {
      if (callback) callback();
    }
  };
  step();
}

function resetGambar() {
  hasilBox.textContent = "";
  hasilBox.classList.remove("show");
  bil1Input.value = "";
  bil2Input.value = "";
  centerValue = 0;
  gambarGarisBilangan();
}
