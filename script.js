// Diasumsikan: A, B sudah didapat dari input, C = A + B
// unitLength adalah jarak antar bilangan (misalnya 50 piksel)

function animateLompatan(value, startPos, color, isFirstStep) {
    let currentPos = startPos;
    let direction = Math.sign(value); // +1 atau -1
    let steps = Math.abs(value);

    for (let i = 0; i < steps; i++) {
        // Tentukan posisi berikutnya
        let nextPos = currentPos + direction;

        // Jeda waktu (setTimeout atau Promise) untuk menciptakan animasi langkah
        setTimeout(() => {
            // 1. Gambar Bulatan Melangkah (Token)
            // Gambar lingkaran (circle SVG) di posisi 'currentPos * unitLength'
            
            // 2. Gambar Jejak (Garis Putus-putus)
            // Gambar garis putus-putus dari 'currentPos' ke 'nextPos'

            currentPos = nextPos;

            // Jika ini adalah langkah terakhir panah B, tandai sebagai Hasil
            if (!isFirstStep && i === steps - 1) {
                drawFinalResult(currentPos);
            }
        }, i * 300); // Jeda 300ms antar lompatan
    }
}

// Tombol Mulai
document.getElementById('startButton').addEventListener('click', () => {
    // 1. Mulai Lompatan A (dari 0 ke A)
    animateLompatan(A, 0, 'purple', true);

    // 2. Mulai Lompatan B (dari A ke C) - Panggil setelah animasi A selesai
    // Perlu menggunakan Promise/async-await untuk memastikan animasi A selesai baru B dimulai.
    // ... panggil animateLompatan(B, A, 'green', false);
});
