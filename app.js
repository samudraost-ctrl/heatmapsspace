/* ==========================
   XAUUSD HEATMAP PRO
========================== */
const API_KEY = "2e17930862544ff2a98735e8bac44bdf";
const heatmapCanvas =
document.getElementById("heatmapCanvas");
const overlayCanvas =
document.getElementById("overlayCanvas");
const heatCtx =
heatmapCanvas.getContext("2d");
const overlayCtx =
overlayCanvas.getContext("2d");
const livePrice =
document.getElementById("livePrice");
const floatingPrice =
document.getElementById("floatingPrice");
const orderBook =
document.getElementById("orderBook");
const fpsCounter =
document.getElementById("fpsCounter");
const currentTime =
document.getElementById("currentTime");
const icebergCount =
document.getElementById("icebergCount");
const volumeValue =
document.getElementById("volumeValue");
const spreadValue =
document.getElementById("spreadValue");
const clickSound =
document.getElementById("clickSound");
/* ==========================
   AUDIO
========================== */
function playClick(){
    if(!clickSound) return;
    clickSound.currentTime = 0;
    clickSound.play().catch(() => {});
}
document
.querySelectorAll("button")
.forEach(btn => {
    btn.addEventListener(
        "click",
        playClick
    );
});
/* ==========================
   TIMEFRAME
========================== */
let currentTF = "M15";
document
.querySelectorAll(".tf-btn")
.forEach(btn => {
    btn.addEventListener("click",()=>{
        document
        .querySelectorAll(".tf-btn")
        .forEach(b =>
            b.classList.remove("active")
        );
        btn.classList.add("active");
        currentTF =
        btn.dataset.tf;
    });
});
/* ==========================
   MARKET DATA
========================== */
let marketPrice = 3300.00;
let lastPrice = 3300.00;
let spread = 0.20;
async function getGoldPrice(){
    try{
        const response =
        await fetch(
        `https://api.twelvedata.com/price?symbol=XAU/USD&apikey=${API_KEY}`
        );
        const data =
        await response.json();
        if(data.price){
            marketPrice =
            parseFloat(data.price);
            livePrice.textContent =
            marketPrice.toFixed(2);
            floatingPrice.textContent =
            marketPrice.toFixed(2);
            document
            .getElementById("priceStatus")
            .textContent =
            "LIVE";
            lastPrice =
            marketPrice;
        }
    }catch(error){
        console.log(error);
        document
        .getElementById("priceStatus")
        .textContent =
        "OFFLINE";
    }
}
getGoldPrice();
setInterval(
    getGoldPrice,
    5000
);
/* ==========================
   CLOCK
========================== */
setInterval(()=>{
    currentTime.textContent =
    new Date()
    .toLocaleTimeString();
},1000);
/* ==========================
   ORDER BOOK
========================== */
function generateBook(){
    orderBook.innerHTML = "";
    for(let i=0;i<18;i++){
        const row =
        document.createElement("div");
        const side =
        Math.random() > 0.5
        ? "ask"
        : "bid";
        row.className =
        `book-row ${side}`;
        const price =
        side==="ask"
        ? marketPrice +
          (i*0.10)
        : marketPrice -
          (i*0.10);
        const size =
        (
        Math.random()*500
        ).toFixed(0);
        row.innerHTML = `
            <span>
            ${price.toFixed(2)}
            </span>
            <span>
            ${size}
            </span>
        `;
        orderBook.appendChild(row);
    }
    spread =
    (Math.random()*0.4)
    .toFixed(2);
    spreadValue.textContent =
    spread;
}
setInterval(
    generateBook,
    1000
);
/* ==========================
   HEATMAP DATA
========================== */
let heatColumns = [];
let bubbles = [];
let icebergs = [];
const MAX_ROWS = 100;
const MAX_COLS = 180;
/* ==========================
   RESIZE
========================== */
function resizeCanvas(){
    heatmapCanvas.width =
    heatmapCanvas.offsetWidth;
    heatmapCanvas.height =
    heatmapCanvas.offsetHeight;
    overlayCanvas.width =
    overlayCanvas.offsetWidth;
    overlayCanvas.height =
    overlayCanvas.offsetHeight;
}
window.addEventListener(
    "resize",
    resizeCanvas
);
resizeCanvas();
/* ==========================
   HEATMAP GENERATOR
========================== */
function generateHeatmapColumn(){
    const column = [];
    for(let row=0; row<MAX_ROWS; row++){
        let liquidity =
        Math.random() * 100;
        const distance =
        Math.abs(
            row - (MAX_ROWS / 2)
        );
        liquidity +=
        Math.max(
            0,
            50 - distance
        );
        column.push(liquidity);
    }
    heatColumns.push(column);
    if(
        heatColumns.length >
        MAX_COLS
    ){
        heatColumns.shift();
    }
}
/* ==========================
   DRAW HEATMAP
========================== */
function drawHeatmap(){
    const w =
    heatmapCanvas.width;
    const h =
    heatmapCanvas.height;
    const cellW =
    w / MAX_COLS;
    const cellH =
    h / MAX_ROWS;
    heatCtx.clearRect(
        0,
        0,
        w,
        h
    );
    for(
        let x=0;
        x<heatColumns.length;
        x++
    ){
        const col =
        heatColumns[x];
        for(
            let y=0;
            y<col.length;
            y++
        ){
            const value =
            col[y];
            let color;
            if(value < 20){
                color =
                "rgba(20,25,40,.3)";
            }else if(value < 40){
                color =
                "rgba(120,90,20,.4)";
            }else if(value < 60){
                color =
                "rgba(180,120,30,.6)";
            }else if(value < 80){
                color =
                "rgba(245,197,66,.8)";
            }else{
                color =
                "rgba(255,245,180,1)";
            }
            heatCtx.fillStyle =
            color;
            heatCtx.fillRect(
                x * cellW,
                y * cellH,
                cellW + 1,
                cellH + 1
            );
        }
    }
}
/* ==========================
   BUBBLE TRADES
========================== */
function createBubble(){
    const side =
    Math.random() > .5
    ? "buy"
    : "sell";
    bubbles.push({
        x:
        heatmapCanvas.width,
        y:
        Math.random() *
        heatmapCanvas.height,
        radius:
        3 +
        Math.random()*12,
        side,
        alpha:1
    });
    volumeValue.textContent =
    parseInt(
        volumeValue.textContent || 0
    ) + 1;
}
setInterval(
    createBubble,
    300
);
function drawBubbles(){
    bubbles.forEach(b=>{
        overlayCtx.beginPath();
        overlayCtx.arc(
            b.x,
            b.y,
            b.radius,
            0,
            Math.PI*2
        );
        overlayCtx.fillStyle =
        b.side==="buy"
        ? `rgba(43,217,107,${b.alpha})`
        : `rgba(255,90,90,${b.alpha})`;
        overlayCtx.fill();
        b.x -= 2;
        b.alpha -= .003;
    });
    bubbles =
    bubbles.filter(
        b => b.alpha > 0
    );
}
/* ==========================
   ICEBERG DETECTION
========================== */
function createIceberg(){
    const y =
    Math.random() *
    heatmapCanvas.height;
    icebergs.push({
        x:
        heatmapCanvas.width
        - 60,
        y,
        life:400
    });
    icebergCount.textContent =
    icebergs.length;
}
setInterval(()=>{
    const chance =
    Math.random();
    if(chance > .85){
        createIceberg();
    }
},4000);
function drawIcebergs(){
    icebergs.forEach(ic=>{
        overlayCtx.save();
        overlayCtx.translate(
            ic.x,
            ic.y
        );
        overlayCtx.rotate(
            Math.PI/4
        );
        overlayCtx.fillStyle =
        "#5ad7ff";
        overlayCtx.fillRect(
            -8,
            -8,
            16,
            16
        );
        overlayCtx.restore();
        ic.life--;
    });
    icebergs =
    icebergs.filter(
        ic => ic.life > 0
    );
    icebergCount.textContent =
    icebergs.length;
}
/* ==========================
   PRICE LINE
========================== */
function drawPriceLine(){
    const y =
    heatmapCanvas.height / 2;
    overlayCtx.strokeStyle =
    "#ffffff";
    overlayCtx.lineWidth = 2;
    overlayCtx.setLineDash(
        [8,8]
    );
    overlayCtx.beginPath();
    overlayCtx.moveTo(
        0,
        y
    );
    overlayCtx.lineTo(
        heatmapCanvas.width,
        y
    );
    overlayCtx.stroke();
    overlayCtx.setLineDash([]);
}
/* ==========================
   OVERLAY
========================== */
function drawOverlay(){
    overlayCtx.clearRect(
        0,
        0,
        overlayCanvas.width,
        overlayCanvas.height
    );
    drawPriceLine();
    drawBubbles();
   /* ==========================
   INSTITUTIONAL ZONES
========================== */
const zones = [];
function generateZones(){
    zones.length = 0;
    for(let i=0;i<5;i++){
        zones.push({
            y:
            Math.random() *
            heatmapCanvas.height,
            strength:
            20 +
            Math.random()*80
        });
    }
}
generateZones();
function drawZones(){
    zones.forEach(zone=>{
        const alpha =
        zone.strength / 100;
        overlayCtx.fillStyle =
        `rgba(245,197,66,${alpha*0.08})`;
        overlayCtx.fillRect(
            0,
            zone.y - 20,
            heatmapCanvas.width,
            40
        );
        overlayCtx.strokeStyle =
        `rgba(245,197,66,${alpha*0.35})`;
        overlayCtx.beginPath();
        overlayCtx.moveTo(
            0,
            zone.y
        );
        overlayCtx.lineTo(
            heatmapCanvas.width,
            zone.y
        );
        overlayCtx.stroke();
    });
}
/* ==========================
   FPS COUNTER
========================== */
let fps = 0;
let frameCount = 0;
let lastFpsTime =
performance.now();
function updateFPS(){
    frameCount++;
    const now =
    performance.now();
    if(
        now - lastFpsTime
        >= 1000
    ){
        fps = frameCount;
        fpsCounter.textContent =
        fps;
        frameCount = 0;
        lastFpsTime = now;
    }
}
/* ==========================
   ANIMATION LOOP
========================== */
function animate(){
    requestAnimationFrame(
        animate
    );
    generateHeatmapColumn();
    drawHeatmap();
    drawOverlay();
    drawZones();
    updateFPS();
}
/* ==========================
   MARKET MOVEMENT
========================== */
function simulateMovement(){
    const move =
    (Math.random()-0.5)
    * 0.25;
    marketPrice += move;
    livePrice.textContent =
    marketPrice.toFixed(2);
    floatingPrice.textContent =
    marketPrice.toFixed(2);
}
setInterval(
    simulateMovement,
    1000
);
/* ==========================
   TRADE COUNTER
========================== */
let trades = 0;
setInterval(()=>{
    trades +=
    Math.floor(
        Math.random()*5
    );
    document
    .getElementById(
        "tradeCounter"
    )
    .textContent =
    trades;
},1000);
/* ==========================
   STARTUP
========================== */
generateBook();
animate();
console.log(
    "XAUUSD HEATMAP PRO READY"
);
