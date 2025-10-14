document.addEventListener('DOMContentLoaded', () => {
    const inputA = document.getElementById('inputA');
    const inputB = document.getElementById('inputB');
    const resultC = document.getElementById('resultC');
    const startButton = document.getElementById('startButton');
    const refreshButton = document.getElementById('refreshButton');
    const svg = document.getElementById('numberLineSVG');

    const SVG_HEIGHT = 300;
    const CENTER_Y = SVG_HEIGHT / 2;
    const UNIT_LENGTH = 40; // Piksel per unit bilangan
    const ANIMATION_SPEED = 400; // ms per lompatan

    let currentX = 0; // Posisi X saat ini (dalam unit bilangan)

    // --- Fungsi Utilitas SVG ---
    const createSVGElement = (tag, attributes) => {
        const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        return element;
    };

    const drawNumberLine = (minVal, maxVal) => {
        // Hapus elemen lama
        svg.innerHTML = '';
        
        // Atur viewBox dinamis agar garis bilangan terlihat di tengah
        const viewWidth = (maxVal - minVal + 5) * UNIT_LENGTH;
        const viewX = minVal * UNIT_LENGTH - 2.5 * UNIT_LENGTH;
        svg.setAttribute('viewBox', `${viewX} 0 ${viewWidth} ${SVG_HEIGHT}`);

        // Garis utama
        svg.appendChild(createSVGElement('line', {
            x1: minVal * UNIT_LENGTH,
            y1: CENTER_Y,
            x2: maxVal * UNIT_LENGTH,
            y2: CENTER_Y,
            class: 'number-line'
        }));

        // Tanda centang (ticks) dan label
        for (let i = minVal; i <= maxVal; i++) {
            const xPos = i * UNIT_LENGTH;
            // Garis kecil
            svg.appendChild(createSVGElement('line', {
                x1: xPos,
                y1: CENTER_Y - 5,
                x2: xPos,
                y2: CENTER_Y + 5,
                class: 'tick-line'
            }));
            // Label angka
            svg.appendChild(createSVGElement('text', {
                x: xPos,
                y: CENTER_Y + 25,
                'text-anchor': 'middle',
                class: 'tick-label'
            })).textContent = i;
        }
        
        return { minX: minVal * UNIT_LENGTH, maxX: maxVal * UNIT_LENGTH };
    };

    // --- Fungsi Animasi Lompatan ---

    const animateLompatan = (value, startPos, colorClass, labelText, labelYOffset, delay) => {
        return new Promise(resolve => {
            const steps = Math.abs(value);
            const direction = Math.sign(value);
            let currentUnit = startPos;
            let currentPixel = startPos * UNIT_LENGTH;
            
            const stepDuration = ANIMATION_SPEED / steps;
            
            const doStep = (i) => {
                if (i >= steps) {
                    resolve();
                    return;
                }
                
                const nextUnit = currentUnit + direction;
                const nextPixel = nextUnit * UNIT_LENGTH;

                // 1. Gambar Jejak (Garis Putus-putus)
                const line = createSVGElement('line', {
                    x1: currentPixel,
                    y1: CENTER_Y + labelYOffset,
                    x2: nextPixel,
                    y2: CENTER_Y + labelYOffset,
                    class: colorClass
                });
                svg.appendChild(line);

                // 2. Gambar Bulatan Melangkah (Token)
                const dot = createSVGElement('circle', {
                    cx: currentPixel,
                    cy: CENTER_Y + labelYOffset,
                    r: 6,
                    fill: line.getAttribute('stroke')
                });
                svg.appendChild(dot);
                
                // Animasi pergerakan dot
                dot.animate(
                    [{ cx: currentPixel }, { cx: nextPixel }],
                    { duration: stepDuration, easing: 'ease-in-out' }
                );

                // Hapus dot setelah animasi selesai (optional: agar tidak menumpuk)
                setTimeout(() => dot.remove(), stepDuration);
                
                currentUnit = nextUnit;
                currentPixel = nextPixel;
                
                setTimeout(() => doStep(i + 1), stepDuration);
            };
            
            // Tampilkan Label Arah
            const startPixel = startPos * UNIT_LENGTH;
            const endPixel = (startPos + value) * UNIT_LENGTH;
            const midPixel = (startPixel + endPixel) / 2;

            setTimeout(() => {
                svg.appendChild(createSVGElement('text', {
                    x: midPixel,
                    y: CENTER_Y + labelYOffset - 15,
                    'text-anchor': 'middle',
                    fill: colorClass.includes('A') ? '#ff69b4' : '#00bfff', // Warna yang lebih kuat
                    class: 'label-text'
                })).textContent = labelText;

                doStep(0);
            }, delay);
        });
    };

    const drawFinalResult = (resultUnit) => {
        const resultPixel = resultUnit * UNIT_LENGTH;
        svg.appendChild(createSVGElement('circle', {
            cx: resultPixel,
            cy: CENTER_Y,
            r: 8,
            class: 'result-dot'
        }));
    };

    // --- Event Listeners ---

    const startAnimation = async () => {
        const A = parseInt(inputA.value);
        const B = parseInt(inputB.value);
        const C = A + B;
        resultC.value = C;
        
        startButton.disabled = true;

        // 1. Tentukan rentang dinamis
        const allVals = [0, A, C];
        const minVal = Math.min(...allVals) - 2;
        const maxVal = Math.max(...allVals) + 2;

        // 2. Gambar garis bilangan
        drawNumberLine(minVal, maxVal);

        // 3. Animasi Lompatan A (dari 0 ke A)
        await animateLompatan(A, 0, 'jump-line-A', `(${A})`, -30, 0);

        // 4. Animasi Lompatan B (dari A ke C)
        await animateLompatan(B, A, 'jump-line-B', `+ (${B})`, 30, 300); // Beri jeda 300ms

        // 5. Tampilkan Hasil
        drawFinalResult(C);
        startButton.disabled = false;
    };

    const reset = () => {
        svg.innerHTML = '';
        inputA.value = 3;
        inputB.value = -5;
        resultC.value = '';
        startButton.disabled = false;
        
        // Inisialisasi garis bilangan dasar
        drawNumberLine(-10, 10);
    };

    startButton.addEventListener('click', startAnimation);
    refreshButton.addEventListener('click', reset);

    // Inisialisasi awal
    reset(); 
});
