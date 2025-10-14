const canvas = document.getElementById("garisBilangan");
const ctx = canvas.getContext("2d");

const bil1Input = document.getElementById("bil1");
const bil2Input = document.getElementById("bil2");
const hasilBox = document.getElementById("hasil");
const tombolMulai = document.getElementById("mulai");
const tombolRefresh = document.getElementById("refresh");

tombolMulai.addEventListener("click", mulaiOperasi);
tombolRefresh.addEventListener("click", refreshGambar);

// Fungsi menggambar garis bilangan
function gambarGarisBilangan() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.beginPath();
  ctx.moveTo(50, 100);
  ctx.lineTo(950, 100);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Titik dan angka dari -15 sampai 15 (tampil -10 s.d 10 di tengah)
  for (let i = -15; i <= 15; i++) {
    const x = 500 + i * 30;
    if (x >= 50 && x <= 950) {
      ctx.beginPath();
      ctx.moveTo(x, 95);
      ctx.lineTo(x, 105);
      ctx.stroke();

      ctx.fillStyle = "blue";
      ctx.font = "14px Arial";
      ctx.fillText(i, x - 6, 120);
    }
  }

  // Titik 0 (lebih tebal)
  ctx.beginPath();
  ctx.moveTo(500, 90);
  ctx.lineTo(500, 110);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "black";
  ctx.stroke();
}

function mulaiOperasi() {
  const bil1 = parseInt(bil1Input.value);
  const bil2 = parseInt(bil2Input.value);

  if (isNaN(bil1) || isNaN(bil2)) {
    alert("Silakan isi kedua bilangan terlebih dahulu!");
    return;
  }

  const hasil = bil1 + bil2;

  gambarGarisBilangan();

  // Bola kuning untuk bilangan pertama
  const startX = 500 + bil1 * 30;
  ctx.beginPath();
  ctx.arc(startX, 100, 7, 0, Math.PI * 2);
  ctx.fillStyle = "yellow";
  ctx.fill();

  // Garis & panah bilangan pertama (dari 0 ke bil1)
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(500, 80);
  ctx.lineTo(startX, 80);
  ctx.strokeStyle = "orange";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "orange";
  ctx.fillText(bil1, (500 + startX) / 2, 70);

  // Bola hijau untuk bilangan kedua
  const endX = startX + bil2 * 30;
  ctx.beginPath();
  ctx.arc(endX, 100, 7, 0, Math.PI * 2);
  ctx.fillStyle = "green";
  ctx.fill();

  // Garis & panah bilangan kedua
  ctx.beginPath();
  ctx.setLineDash([5, 5]);
  ctx.moveTo(startX, 80);
  ctx.lineTo(endX, 80);
  ctx.strokeStyle = "green";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = "green";
  ctx.fillText(bil2, (startX + endX) / 2, 70);

  // Titik merah hasil
  ctx.beginPath();
  ctx.arc(endX, 100, 9, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();

  hasilBox.textContent = `${bil1} + ${bil2} = ${hasil}`;
}

function refreshGambar() {
  bil1Input.value = "";
  bil2Input.value = "";
  hasilBox.textContent = "";
  gambarGarisBilangan();
}

// gambar awal (garis bilangan langsung muncul)
gambarGarisBilangan();
