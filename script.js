const canvas = document.getElementById("garisBilangan");
const ctx = canvas.getContext("2d");
const centerX = canvas.width / 2;
const scale = 25;
const maxNum = 15;
const viewRange = 10;

function gambarGaris() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(50, 120);
  ctx.lineTo(750, 120);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  for (let i = -maxNum; i <= maxNum; i++) {
    const x = centerX + i * scale;
    ctx.beginPath();
    ctx.moveTo(x, 115);
    ctx.lineTo(x, 125);
    ctx.stroke();
    if (i >= -viewRange && i <= viewRange) {
      ctx.fillStyle = "blue";
      ctx.font = "14px Poppins";
      ctx.fillText(i, x - 5, 140);
    }
  }
}

function animasiLompatan(x1, x2, warna, label, callback) {
  let progress = 0;
  const langkah = () => {
    gambarGaris();

    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(x1, 100);
    ctx.lineTo(x1 + (x2 - x1) * progress, 100);
    ctx.strokeStyle = warna;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);

    const posX = x1 + (x2 - x1) * progress;
    const posY = 100 - Math.sin(progress * Math.PI) * 30;
    ctx.beginPath();
    ctx.arc(posX, posY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = warna;
    ctx.fill();

    ctx.fillStyle = warna;
    ctx.font = "14px Poppins";
    ctx.fillText(label, (x1 + x2) / 2, 80);

    if (progress < 1) {
      progress += 0.02;
      requestAnimationFrame(langkah);
    } else if (callback) {
      callback();
    }
  };
  langkah();
}

function mulai() {
  gambarGaris();
  const bil1 = parseInt(document.getElementById("bil1").value);
  const bil2 = parseInt(document.getElementById("bil2").value);
  const hasil = bil1 + bil2;

  const startX = centerX;
  const pos1 = startX + bil1 * scale;
  const posHasil = startX + hasil * scale;

  // animasi bilangan pertama (kuning)
  animasiLompatan(startX, pos1, "gold", bil1, () => {
    // animasi bilangan kedua (hijau)
    animasiLompatan(pos1, posHasil, "green", bil2, () => {
      // titik hasil (merah)
      ctx.beginPath();
      ctx.arc(posHasil, 120, 10, 0, 2 * Math.PI);
      ctx.fillStyle = "red";
      ctx.fill();

      document.getElementById("hasil").innerText = `${bil1} + ${bil2} = ${hasil}`;
    });
  });
}

document.getElementById("mulaiBtn").addEventListener("click", mulai);
gambarGaris();
