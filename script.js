// ... (Kode sebelumnya) ...

    // --- Fungsi Animasi Lompatan (GARIS LANGKAH DISKRIT) ---

    const animateLompatan = (value, startPos, colorClass, labelText, labelYOffset, delay) => {
        return new Promise(resolve => {
            const steps = Math.abs(value);
            const direction = Math.sign(value);
            let currentUnit = startPos;
            const arrowId = colorClass.includes('A') ? 'url(#arrowA)' : 'url(#arrowB)';
            const stepColor = colorClass.includes('A') ? COLOR_A : COLOR_B;
            const labelColor = stepColor;
            
            const startPixelTotal = startPos * UNIT_LENGTH;
            const endPixelTotal = (startPos + value) * UNIT_LENGTH;

            if (value === 0) {
                // ... (Penanganan nilai 0) ...
                setTimeout(() => {
                    const midPixel = startPos * UNIT_LENGTH;
                     svg.appendChild(createSVGElement('text', {
                        x: midPixel, y: CENTER_Y + labelYOffset - 10, 
                        'text-anchor': 'middle', fill: labelColor,
                        class: 'label-text'
                    })).textContent = labelText;
                    resolve();
                }, delay);
                return;
            }

            // Tampilkan Label Arah
            const midPixelLabel = (startPixelTotal + endPixelTotal) / 2;

            setTimeout(() => {
                svg.appendChild(createSVGElement('text', {
                    x: midPixelLabel, y: CENTER_Y + labelYOffset - 10,
                    'text-anchor': 'middle', fill: labelColor,
                    class: 'label-text'
                })).textContent = labelText;
            }, delay);

            let stepCount = 0;
            let lastLine = null; // Menyimpan garis langkah terakhir

            // Loop animasi menggunakan setTimeout berantai
            const loopAnimationFixed = () => {
                
                const isLastStep = (stepCount === steps - 1); // PENTING: Cek apakah ini langkah terakhir
                
                // 1. Pengecekan sebelum langkah dimulai
                if (stepCount >= steps) {
                    // Setelah semua langkah selesai, tambahkan panah ke garis terakhir
                    if (lastLine) {
                         lastLine.setAttribute('marker-end', arrowId);
                    }
                    resolve();
                    return;
                }
                
                // Hapus panah dari garis langkah sebelumnya (jika ada)
                if (lastLine && lastLine.getAttribute('marker-end')) {
                    lastLine.removeAttribute('marker-end');
                }
                
                const prevPixel = currentUnit * UNIT_LENGTH;
                currentUnit += direction;
                const nextPixel = currentUnit * UNIT_LENGTH;

                // 2. Gambar Garis Langkah
                const line = createSVGElement('line', {
                    x1: prevPixel, y1: CENTER_Y + labelYOffset,
                    x2: nextPixel, y2: CENTER_Y + labelYOffset,
                    class: colorClass, 
                    'stroke-dasharray': '8, 4', 
                    'stroke-width': 4,
                    'stroke-opacity': 1, 
                });
                svg.appendChild(line);
                lastLine = line;

                // 3. Gambar Bulatan Bergerak (TOKEN)
                const dot = createSVGElement('circle', {
                    cx: prevPixel, 
                    cy: CENTER_Y + labelYOffset,
                    r: 6, 
                    fill: stepColor 
                });
                svg.appendChild(dot);
                
                // 4. Animasi pergerakan token
                dot.animate(
                    [{ cx: prevPixel }, { cx: nextPixel }],
                    { 
                        duration: ANIMATION_DURATION, // Waktu Gerak
                        easing: 'linear', 
                        fill: 'forwards' 
                    }
                );

                // 5. Logika Berhenti dan Jeda
                setTimeout(() => {
                    
                    // JIKA INI BUKAN LANGKAH TERAKHIR, HAPUS TOKEN
                    if (!isLastStep) {
                        dot.remove();
                    }
                    
                    // Panggil langkah berikutnya setelah JEDA
                    stepCount++;
                    // Jika ini langkah terakhir, kita hanya resolve, tidak perlu setTimeout lagi
                    if (!isLastStep) {
                        setTimeout(loopAnimationFixed, PAUSE_PER_STEP);
                    } else {
                         // Untuk langkah terakhir, kita tunggu PAUSE_PER_STEP baru resolve
                         // Ini memungkinkan bulatan tetap di tempat hasil sebelum bulatan kuning muncul
                         setTimeout(() => {
                            if (lastLine) {
                                lastLine.setAttribute('marker-end', arrowId);
                            }
                            resolve();
                         }, PAUSE_PER_STEP);
                    }
                    
                }, ANIMATION_DURATION); 
            };

            // Mulai loop setelah delay awal
            setTimeout(loopAnimationFixed, delay);
        });
    };

// ... (Kode selanjutnya tetap sama) ...
