/* ==========================
   XAUUSD HEATMAP PRO
========================== */
const API_KEY = "YOUR_TWELVEDATA_API_KEY";
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
