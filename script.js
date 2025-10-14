const canvas = document.getElementById("garisBilangan");
const ctx = canvas.getContext("2d");
const bil1Input = document.getElementById("bil1");
const bil2Input = document.getElementById("bil2");
const hasilBox = document.getElementById("hasil");
const tombolMulai = document.getElementById("mulai");
const tombolRefresh = document.getElementById("refresh");

let animating = false;

tombolMulai.addEventListener("click", mulaiOperasi);
tombolRefresh.addEventListener("click", resetGambar);

// gambar garis bilangan langsung di awal
gambarGarisBilangan();

function gambarGarisBilangan() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // garis utama
  ctx.beginPath();
  ctx.moveTo(50, 100);
  ctx.lineTo(950, 100);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  // tanda tiap bilangan -15 s.d 15
  for (let i = -15; i <= 15; i++) {
    const x = 500 + i * 30;
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

  // tanda nol (lebih tebal)
  ctx.beginPath();
  ctx.moveTo(500, 90);
  ctx.lineTo(500, 110);
  ctx.strokeStyle = "red";
  ctx.lineWidth = 3;
  ctx.stroke();
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
  const pos0 = 500;
  const pos1 = pos0 + bil1 * 30;
  const pos2 = pos1 + bil2 * 30;

  hasilBox.textContent = "";
  hasilBox.classList.remove("show");
  gambarGarisBilangan();

  animating = true;
  animasiBola(pos0, pos1, "yellow", () => {
    animasiBola(pos1, pos2, "green", () => {
      // titik merah hasil
      ctx.beginPath();
      ctx.arc(pos2, 100, 9, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();

      hasilBox.textContent = `${bil1} + ${bil2} = ${hasil}`;
      hasilBox.classList.add("show");
      animating = false;
    });
  });
}

// animasi gerakan bola
function animasiBola(startX, endX, color, callback) {
  let progress = 0;
  const durasi = 60; // frame
  const step = () => {
    gambarGarisBilangan();
    progress++;
    const x = startX + (endX - startX) * (progress / durasi);

    // gambar bola
    ctx.beginPath();
    ctx.arc(x, 100, 9, 0, Math.PI * 2);
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
  gambarGarisBilangan();
}
