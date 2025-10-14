const canvas = document.getElementById("garisBilangan");
const ctx = canvas.getContext("2d");
const bil1Input = document.getElementById("bil1");
const bil2Input = document.getElementById("bil2");
const hasilBox = document.getElementById("hasil");

document.getElementById("mulai").addEventListener("click", mulaiOperasi);
document.getElementById("refresh").addEventListener("click", resetGambar);

let animating = false;
let offset = 0; // pergeseran ke kanan agar hasil tetap terlihat tapi 0 tetap ada

function gambarGarisBilangan(bil1 = 0, bil2 = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const hasil = bil1 + bil2;

  // Hitung rentang agar hasil tetap di layar, tapi 0 selalu terlihat
  const minVal = Math.min(0, bil1, hasil, -10);
  const maxVal = Math.max(0, bil1, hasil, 10);

  // posisi x untuk setiap angka
  const range = maxVal - minVal;
  const scale = 45;
  const startX = 100;
  const baseY = 130;

  // garis utama
  ctx.beginPath();
  ctx.moveTo(startX, baseY);
  ctx.lineTo(startX + range * scale, baseY);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  // angka dan garis kecil
  for (let i = minVal; i <= maxVal; i++) {
    const x = startX + (i - minVal) * scale;
    ctx.beginPath();
    ctx.moveTo(x, baseY - 5);
    ctx.lineTo(x, baseY + 5);
    ctx.strokeStyle = "black";
    ctx.stroke();
    ctx.font = "14px Poppins";
    ctx.fillStyle = "blue";
    ctx.fillText(i, x - 6, baseY + 20);
  }

  return { minVal, scale, startX, baseY };
}

function mulaiOperasi() {
  if (animating) return;

  const bil1 = parseInt(bil1Input.value);
  const bil2 = parseInt(bil2Input.value);

  if (isNaN(bil1) || isNaN(bil2)) {
    alert("Isi kedua bilangan terlebih dahulu!");
    return;
  }

  const hasil = bil1 + bil2;
  hasilBox.textContent = "";
  hasilBox.classList.remove("show");

  const { minVal, scale, startX, baseY } = gambarGarisBilangan(bil1, bil2);
  const pos0 = startX + (0 - minVal) * scale;
  const pos1 = startX + (bil1 - minVal) * scale;
  const pos2 = startX + (hasil - minVal) * scale;

  animating = true;

  // Garis pertama
  gambarGarisPutus(pos0, pos1, "yellow", bil1, baseY - 40, () => {
    // Garis kedua
    gambarGarisPutus(pos1, pos2, "green", bil2, baseY - 70, () => {
      // titik hasil
      ctx.beginPath();
      ctx.arc(pos2, baseY, 6, 0, Math.PI * 2);
      ctx.fillStyle = "red";
      ctx.fill();
      hasilBox.textContent = `${bil1} + ${bil2} = ${hasil}`;
      hasilBox.classList.add("show");
      animating = false;
    });
  });
}

function gambarGarisPutus(x1, x2, color, label, labelY, callback) {
  const step = 3;
  let progress = 0;
  const durasi = Math.abs(x2 - x1) / step;

  const arah = x2 > x1 ? 1 : -1;

  function animStep() {
    gambarGarisBilangan(
      parseInt(bil1Input.value) || 0,
      parseInt(bil2Input.value) || 0
    );

    const posisi = x1 + (x2 - x1) * (progress / durasi);

    // garis putus-putus
    ctx.beginPath();
    ctx.setLineDash([6, 6]);
    ctx.moveTo(x1, labelY + 10);
    ctx.lineTo(posisi, labelY + 10);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    // bola kecil
    ctx.beginPath();
    ctx.arc(posisi, 130, 6, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();

    // panah arah
    const panahX = x1 + (x2 - x1) * 0.9;
    ctx.beginPath();
    ctx.moveTo(panahX, labelY + 10);
    ctx.lineTo(panahX - 8 * arah, labelY + 5);
    ctx.lineTo(panahX - 8 * arah, labelY + 15);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // label di atas garis
    ctx.fillStyle = color;
    ctx.font = "bold 14px Poppins";
    ctx.fillText(label, (x1 + x2) / 2 - 6, labelY);

    if (progress < durasi) {
      progress++;
      requestAnimationFrame(animStep);
    } else {
      callback && callback();
    }
  }

  animStep();
}

function resetGambar() {
  hasilBox.textContent = "";
  hasilBox.classList.remove("show");
  bil1Input.value = "";
  bil2Input.value = "";
  animating = false;
  gambarGarisBilangan();
}

gambarGarisBilangan();
