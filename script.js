document.addEventListener('DOMContentLoaded', () => {
    const inputA = document.getElementById('inputA');
    const inputB = document.getElementById('inputB');
    const resultC = document.getElementById('resultC');
    const startButton = document.getElementById('startButton');
    const refreshButton = document.getElementById('refreshButton');
    const svg = document.getElementById('numberLineSVG');

    const SVG_HEIGHT = 300;
    const CENTER_Y = SVG_HEIGHT / 2;
    const UNIT_LENGTH = 40; 
    
    // Waktu Gerak Token dari Angka X ke Angka Y
    const ANIMATION_DURATION = 180; 
    
    // Waktu Berhenti (JEDA) di setiap Angka
    const PAUSE_PER_STEP = 120; 
    
    // JEDA ANTARA ANIMASI A DAN B
    const PAUSE_BETWEEN_JUMPS = 500; 
    
    const COLOR_A = '#ff5757'; // Merah
    const COLOR_B = '#4caf50'; // Hijau

    // --- Fungsi Utilitas SVG (Tetap Sama) ---
    const createSVGElement = (tag, attributes) => {
        const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
        for (const key in attributes) {
            element.setAttribute(key, attributes[key]);
        }
        return element;
    };
    
    const defineArrowMarkers = () => {
        let defs = svg.querySelector('defs');
        if (!defs) {
            defs = createSVGElement('defs', {});
            svg.prepend(defs);
        } else {
            defs.innerHTML = '';
        }

        const ARROW_SIZE = '4'; 

        // Marker Merah (Lompatan A)
        let markerA = createSVGElement('marker', {
            id: 'arrowA', viewBox: '0 0 10 10', refX: '9', refY: '5',
            markerWidth: ARROW_SIZE, markerHeight: ARROW_SIZE, 
            orient: 'auto-start-reverse',
        });
        markerA.appendChild(createSVGElement('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: COLOR_A }));
        defs.appendChild(markerA);

        // Marker Hijau (Lompatan B)
        let markerB = createSVGElement('marker', {
            id: 'arrowB', viewBox: '0 0 10 10', refX: '9', refY: '5',
            markerWidth: ARROW_SIZE, markerHeight: ARROW_SIZE, 
            orient: 'auto-start-reverse',
        });
        markerB.appendChild(createSVGElement('path', { d: 'M 0 0 L 10 5 L 0 10 z', fill: COLOR_B }));
        defs.appendChild(markerB);
    };

    const drawNumberLine = (minVal, maxVal) => {
        svg.innerHTML = '';
        defineArrowMarkers();
        
        const paddingUnits = 2;
        const viewWidth = (maxVal - minVal + 2 * paddingUnits) * UNIT_LENGTH;
        const viewX = (minVal - paddingUnits) * UNIT_LENGTH;
        svg.setAttribute('viewBox', `${viewX} 0 ${viewWidth} ${SVG_HEIGHT}`);

        svg.appendChild(createSVGElement('line', {
            x1: minVal * UNIT_LENGTH, y1: CENTER_Y,
            x2: maxVal * UNIT_LENGTH, y2: CENTER_Y,
            class: 'number-line'
        }));

        for (let i = minVal; i <= maxVal; i++) {
            const xPos = i * UNIT_LENGTH;
            svg.appendChild(createSVGElement('line', {
                x1: xPos, y1: CENTER_Y - 5,
                x2: xPos, y2: CENTER_Y + 5,
                class: 'tick-line'
            }));
            svg.appendChild(createSVGElement('text', {
                x: xPos, y: CENTER_Y + 25,
                'text-anchor': 'middle', class: 'tick-label'
            })).textContent = i;
        }
    };


    // --- Fungsi Animasi Lompatan (LOMPATAN DISKRIT) ---

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

            // Garis Total Permanen (untuk panah)
            const totalLine = createSVGElement('line', {
                x1: startPixelTotal, y1: CENTER_Y + labelYOffset,
                x2: endPixelTotal, y2: CENTER_Y + labelYOffset,
                class: colorClass, 
                'stroke-dasharray': '8, 4', 
                'stroke-width': 4,
                'marker-end': arrowId,
                'stroke-opacity': 1, 
            });
            svg.appendChild(totalLine);

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
            
            // Loop animasi menggunakan setTimeout berantai
            const loopAnimationFixed = () => {
                // Pengecekan sebelum langkah dimulai
                if (stepCount >= steps) {
                    resolve();
                    return;
                }
                
                const prevPixel = currentUnit * UNIT_LENGTH;
                currentUnit += direction;
                const nextPixel = currentUnit * UNIT_LENGTH;

                // 1. Gambar Bulatan Bergerak (TOKEN)
                const dot = createSVGElement('circle', {
                    cx: prevPixel, 
                    cy: CENTER_Y + labelYOffset,
                    r: 6, 
                    fill: stepColor 
                });
                svg.appendChild(dot);
                
                // 2. Animasi pergerakan token
                dot.animate(
                    [{ cx: prevPixel }, { cx: nextPixel }],
                    { 
                        duration: ANIMATION_DURATION, // Waktu Gerak
                        easing: 'linear', 
                        fill: 'forwards' 
                    }
                );

                // LOGIKA BERHENTI TEPAT DI ANGKA:
                // Token dihapus setelah waktu gerak (ANIMATION_DURATION)
                // Langkah berikutnya dipanggil setelah waktu jeda (PAUSE_PER_STEP)
                
                setTimeout(() => {
                    // Hapus token setelah mencapai titik akhir langkah
                    dot.remove();
                    
                    // Panggil langkah berikutnya setelah JEDA
                    stepCount++;
                    setTimeout(loopAnimationFixed, PAUSE_PER_STEP); 
                    
                }, ANIMATION_DURATION); 
            };

            // Mulai loop setelah delay awal
            setTimeout(loopAnimationFixed, delay);
        });
    };

    const drawFinalResult = (resultUnit) => {
        const resultPixel = resultUnit * UNIT_LENGTH;
        svg.appendChild(createSVGElement('circle', {
            cx: resultPixel, cy: CENTER_Y, r: 8,
            class: 'result-dot'
        }));
    };

    // --- Event Listeners ---
    const startAnimation = async () => {
        let A = parseInt(inputA.value);
        let B = parseInt(inputB.value);

        if (isNaN(A)) A = 0; if (isNaN(B)) B = 0;
        A = Math.max(-15, Math.min(15, A)); B = Math.max(-15, Math.min(15, B));
        inputA.value = A; inputB.value = B;

        const C = A + B; resultC.value = C;
        startButton.disabled = true;

        const allVals = [0, A, C];
        const minValGlobal = Math.min(...allVals) - 2;
        const maxValGlobal = Math.max(...allVals) + 2;
        drawNumberLine(minValGlobal, maxValGlobal);

        // OFFSET (A: -25, B: -60)
        const OFFSET_A = -25;
        const OFFSET_B = -60; 

        await animateLompatan(A, 0, 'jump-line-A', `(${A})`, OFFSET_A, 0);
        await animateLompatan(B, A, 'jump-line-B', `(${B})`, OFFSET_B, PAUSE_BETWEEN_JUMPS);

        drawFinalResult(C); 
        startButton.disabled = false;
    };

    const reset = () => {
        svg.innerHTML = '';
        inputA.value = '';
        inputB.value = '';
        resultC.value = '';
        startButton.disabled = false;
        drawNumberLine(-10, 10);
    };

    startButton.addEventListener('click', startAnimation);
    refreshButton.addEventListener('click', reset);

    reset(); 
});
