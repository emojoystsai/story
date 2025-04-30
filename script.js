
function goToScene(n) {
    for (let i = 1; i <= 4; i++) {
        document.getElementById('scene' + i).style.display = (i === n) ? 'block' : 'none';
    }
}

const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

canvas.addEventListener('mousedown', e => {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});
canvas.addEventListener('mousemove', e => {
    if (!isDrawing) return;
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
});
canvas.addEventListener('mouseup', () => {
    isDrawing = false;
});

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function generateStory() {
    goToScene(3);
    setTimeout(() => {
        goToScene(4);
        const storyText = document.getElementById('storyText');
        storyText.innerHTML = '在風捲殘雲的筆觸之下，一座漂浮的城市逐漸顯形……';
        const resultCanvas = document.getElementById('resultCanvas');
        resultCanvas.getContext('2d').drawImage(canvas, 0, 0);
    }, 2000);
}
