const START_MONEY = 5000;
let balance = START_MONEY;
let investments = [];
let stockHistory = {};

const balanceEl = document.getElementById("balance");
const stockSelect = document.getElementById("stock-select");
const amountInput = document.getElementById("amount");
const investBtn = document.getElementById("invest-btn");
const investmentList = document.getElementById("investment-list");
const chartCtx = document.getElementById("stock-chart").getContext("2d");
const sellBtn = document.getElementById("sell-btn");
const collectBtn = document.getElementById("collect-btn");
const refreshBtn = document.getElementById("refresh-btn");
const autoRefreshToggle = document.getElementById("auto-refresh-toggle");
const chartTitle = document.getElementById("chart-title");
const refreshSpeed = document.getElementById("refresh-speed");
const trendIndicator = document.getElementById("trend-indicator");
const chartTypeSelect = document.getElementById("chart-type");

// Statistik-Elemente
const statTotalInvested = document.getElementById("stat-total-invested");
const statInvestmentCount = document.getElementById("stat-investment-count");
const statRemaining = document.getElementById("stat-remaining");

const stockNames = {
  "AAPL": "Apple Inc.",
  "MSFT": "Microsoft Corp.",
  "GOOGL": "Alphabet Inc.",
  "AMZN": "Amazon.com Inc.",
  "TSLA": "Tesla Inc.",
  "META": "Meta Platforms",
  "NVDA": "NVIDIA Corp.",
  "SAP": "SAP SE",
  "BMW.DE": "BMW AG",
  "SIE.DE": "Siemens AG",
  "BAS.DE": "BASF SE",
  "VOW3.DE": "Volkswagen AG",
  "DTE.DE": "Deutsche Telekom AG",
  "DBK.DE": "Deutsche Bank AG",
  "ADS.DE": "Adidas AG",
  "ALV.DE": "Allianz SE",
  "RWE.DE": "RWE AG",
  "FRE.DE": "Fresenius SE",
  "MUV2.DE": "Münchener Rück",
  "AIR.PA": "Airbus SE",
  "OR.PA": "L'Oréal SA",
  "MC.PA": "LVMH Moet Hennessy",
  "CSCO": "Cisco Systems",
  "INTC": "Intel Corp.",
  "NFLX": "Netflix Inc.",
  "DIS": "Walt Disney Co.",
  "JNJ": "Johnson & Johnson",
  "PFE": "Pfizer Inc.",
  "KO": "Coca-Cola Co.",
  "NKE": "Nike Inc.",
  "ABI.BR": "Anheuser-Busch InBev",
  "HEIA.AS": "Heineken NV",
  "CARL-B.CO": "Carlsberg A/S",
  "BUD": "Budweiser Brewing Co.",
  "SAM": "Boston Beer Co.",
  "DGE.L": "Diageo PLC",
  "RHM.DE": "Rheinmetall AG"
};

const stockInfos = {
  "AAPL": "Apple Inc. ist ein US-amerikanischer Technologiekonzern, bekannt für iPhone, iPad und Mac.",
  "MSFT": "Microsoft Corp. ist ein weltweit führender Softwarehersteller, bekannt für Windows und Office.",
  "GOOGL": "Alphabet Inc. ist die Muttergesellschaft von Google, aktiv in Internetdiensten und Werbung.",
  "AMZN": "Amazon.com Inc. ist ein globaler Online-Versandhändler und Cloud-Computing-Anbieter.",
  "TSLA": "Tesla Inc. produziert Elektroautos und erneuerbare Energielösungen.",
  "META": "Meta Platforms ist das Unternehmen hinter Facebook, Instagram und WhatsApp.",
  "NVDA": "NVIDIA Corp. entwickelt Grafikprozessoren und KI-Hardware.",
  "SAP": "SAP SE ist ein deutscher Softwarekonzern für Unternehmensanwendungen.",
  "BMW.DE": "BMW AG ist ein deutscher Hersteller von Automobilen und Motorrädern.",
  "SIE.DE": "Siemens AG ist ein deutsches Unternehmen für Elektronik und Elektrotechnik.",
  "BAS.DE": "BASF SE ist das weltweit größte Chemieunternehmen.",
  "VOW3.DE": "Volkswagen AG ist einer der größten Automobilhersteller der Welt.",
  "DTE.DE": "Deutsche Telekom AG ist ein führender Telekommunikationsanbieter.",
  "DBK.DE": "Deutsche Bank AG ist eine der größten Banken Deutschlands.",
  "ADS.DE": "Adidas AG ist ein weltweit führender Sportartikelhersteller.",
  "ALV.DE": "Allianz SE ist ein internationaler Versicherungskonzern.",
  "RWE.DE": "RWE AG ist ein großer Energieversorger mit Fokus auf erneuerbare Energien.",
  "FRE.DE": "Fresenius SE ist ein Gesundheitskonzern mit Schwerpunkt Medizintechnik.",
  "MUV2.DE": "Münchener Rück ist einer der größten Rückversicherer weltweit.",
  "AIR.PA": "Airbus SE ist ein führender Flugzeughersteller.",
  "OR.PA": "L'Oréal SA ist der weltweit größte Kosmetikhersteller.",
  "MC.PA": "LVMH Moet Hennessy ist ein Luxusgüterkonzern.",
  "CSCO": "Cisco Systems ist ein führender Anbieter von Netzwerktechnik.",
  "INTC": "Intel Corp. ist ein führender Hersteller von Halbleitern.",
  "NFLX": "Netflix Inc. ist ein Streamingdienst für Filme und Serien.",
  "DIS": "Walt Disney Co. ist ein Medien- und Unterhaltungskonzern.",
  "JNJ": "Johnson & Johnson ist ein weltweit tätiges Pharma- und Konsumgüterunternehmen.",
  "PFE": "Pfizer Inc. ist ein globales Pharmaunternehmen.",
  "KO": "Coca-Cola Co. ist der größte Getränkehersteller der Welt.",
  "NKE": "Nike Inc. ist ein führender Sportartikelhersteller.",
  "ABI.BR": "Anheuser-Busch InBev ist der größte Brauereikonzern der Welt.",
  "HEIA.AS": "Heineken NV ist eine der größten Brauereigruppen weltweit.",
  "CARL-B.CO": "Carlsberg A/S ist ein internationaler Brauereikonzern.",
  "BUD": "Budweiser Brewing Co. ist ein globaler Bierhersteller.",
  "SAM": "Boston Beer Co. ist bekannt für die Marke Samuel Adams.",
  "DGE.L": "Diageo PLC ist ein weltweit führender Spirituosenhersteller.",
  "RHM.DE": "Rheinmetall AG ist ein deutscher Rüstungskonzern (Waffenindustrie). <span style='color:red;font-weight:bold;'>Es ist asozial, in Waffenindustrie zu investieren.</span>"
};

let chart;
let autoRefresh = true;
let autoRefreshInterval = null;
let refreshIntervalMs = parseInt(refreshSpeed.value, 10);

function updateBalance() {
  balanceEl.textContent = `Verfügbar: ${balance.toFixed(2)} MONETEN`;
  localStorage.setItem("sim_balance", balance);
  updateStats();
}

function updateStats() {
  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  statTotalInvested.textContent = `Gesamt investiert: ${totalInvested.toFixed(2)} MONETEN`;
  statInvestmentCount.textContent = `Anzahl Investments: ${investments.length}`;
  statRemaining.textContent = `Verbleibendes Geld: ${balance.toFixed(2)} MONETEN`;
}

function loadInvestments() {
  const data = localStorage.getItem("sim_investments");
  if (data) {
    investments = JSON.parse(data);
    investmentList.innerHTML = "";
    investments.forEach((inv, idx) => addInvestmentToList(inv, idx));
  }
  updateStats();
}

function saveInvestments() {
  localStorage.setItem("sim_investments", JSON.stringify(investments));
}

function addInvestmentToList(inv, idx) {
  // Gewinn/Verlust seit Investition (EUR und %)
  const currentPrice = getCurrentPrice(inv.symbol);
  const diff = currentPrice - (inv.buyPrice || currentPrice);
  const diffPct = inv.buyPrice ? (diff / inv.buyPrice) * 100 : 0;
  const profitClass = diff > 0 ? "trend-up" : (diff < 0 ? "trend-down" : "trend-neutral");
  const profitStr = `${diff >= 0 ? "+" : ""}${diff.toFixed(2)} (${diffPct >= 0 ? "+" : ""}${diffPct.toFixed(2)}%)`;

  // Wertänderung seit Investition (aktueller Wert - investierter Betrag)
  const currentValue = inv.amount * (currentPrice / (inv.buyPrice || currentPrice));
  const valueChange = currentValue - inv.amount;
  const valueChangePct = (valueChange / inv.amount) * 100;
  const valueClass = valueChange > 0 ? "trend-up" : (valueChange < 0 ? "trend-down" : "trend-neutral");
  const valueStr = `${valueChange >= 0 ? "+" : ""}${valueChange.toFixed(2)} (${valueChangePct >= 0 ? "+" : ""}${valueChangePct.toFixed(2)}%)`;

  // Tabellarische Darstellung
  const li = document.createElement("li");
  li.innerHTML = `
    <span class="investment-date">${inv.date}</span>
    <span class="investment-symbol">${inv.symbol}</span>
    <span class="investment-amount">${inv.amount.toFixed(2)} MONETEN</span>
    <span class="investment-profit ${profitClass}">Kursdiff: ${profitStr}</span>
    <span class="investment-value ${valueClass}">Wert: ${valueStr}</span>
    <span class="investment-actions">
      <button class="sell-single-btn" data-idx="${idx}" style="padding:2px 10px;font-size:0.95em;">Zurückgeben</button>
      ${inv.collected ? '<span style="margin-left:8px;opacity:0.7;">(Gewinn eingesammelt)</span>' : ''}
    </span>
  `;
  if (inv.collected) {
    li.style.opacity = "0.6";
    li.title = "Gewinn bereits eingesammelt";
  }
  investmentList.appendChild(li);
}

function generateStockHistory(symbol) {
  const basePrices = {
    "AAPL": 180, "MSFT": 320, "GOOGL": 130, "AMZN": 120, "TSLA": 250,
    "META": 270, "NVDA": 400, "SAP": 130, "BMW.DE": 100, "SIE.DE": 150
  };
  const base = basePrices[symbol] || 100;
  const prices = [];
  let price = base;
  for (let i = 29; i >= 0; i--) {
    price += (Math.random() - 0.48) * base * 0.02;
    price = Math.max(1, price);
    prices.push({
      x: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
      y: price
    });
  }
  return prices;
}

// OHLC-Daten für Candlestick generieren (simuliert)
function generateStockHistoryOHLC(symbol) {
  const basePrices = {
    "AAPL": 180, "MSFT": 320, "GOOGL": 130, "AMZN": 120, "TSLA": 250,
    "META": 270, "NVDA": 400, "SAP": 130, "BMW.DE": 100, "SIE.DE": 150
  };
  const base = basePrices[symbol] || 100;
  const prices = [];
  let price = base;
  for (let i = 29; i >= 0; i--) {
    // Simuliere Open, High, Low, Close
    const open = price;
    let close = open + (Math.random() - 0.48) * base * 0.02;
    close = Math.max(1, close);
    const high = Math.max(open, close) + Math.random() * base * 0.01;
    const low = Math.min(open, close) - Math.random() * base * 0.01;
    prices.push({
      x: new Date(Date.now() - i * 24 * 60 * 60 * 1000).getTime(), // <-- Zeitstempel!
      o: open,
      h: Math.max(open, close, high),
      l: Math.max(1, Math.min(open, close, low)),
      c: close
    });
    price = close;
  }
  return prices;
}

function getCurrentPrice(symbol) {
  const history = stockHistory[symbol];
  if (!history) return 100;
  return history[history.length - 1].y;
}

function updateAllStockHistories() {
  // Update line chart data
  Object.keys(stockHistory).forEach(symbol => {
    if (symbol.endsWith("_ohlc")) return;
    const history = stockHistory[symbol];
    let last = history[history.length - 1].y;
    last += (Math.random() - 0.48) * last * 0.02;
    last = Math.max(1, last);
    history.push({
      x: new Date().toLocaleDateString(),
      y: last
    });
    if (history.length > 30) history.shift();
  });
  // Update OHLC data for candlestick
  Object.keys(stockHistory).forEach(symbol => {
    if (!symbol.endsWith("_ohlc")) return;
    const ohlc = stockHistory[symbol];
    const prev = ohlc[ohlc.length - 1];
    const open = prev.c;
    let close = open + (Math.random() - 0.48) * open * 0.02;
    close = Math.max(1, close);
    const high = Math.max(open, close) + Math.random() * open * 0.01;
    const low = Math.max(1, Math.min(open, close) - Math.random() * open * 0.01);
    ohlc.push({
      x: new Date().getTime(),
      o: open,
      h: Math.max(open, close, high),
      l: low,
      c: close
    });
    if (ohlc.length > 30) ohlc.shift();
  });
}

function getNowTimeString() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getTrendClass(change) {
  if (change > 0) return "trend-up";
  if (change < 0) return "trend-down";
  return "trend-neutral";
}

function getTrendArrow(change) {
  if (change > 0) return "▲";
  if (change < 0) return "▼";
  return "▬";
}

function renderChart(symbol) {
  const chartType = chartTypeSelect.value;
  const name = stockNames[symbol] || symbol;
  const nowTime = getNowTimeString();
  chartTitle.textContent = `Kursdiagramm: ${name} (${symbol}) – Stand: ${nowTime}`;

  if (chart) chart.destroy();

  if (chartType === "candlestick") {
    let ohlc = stockHistory[symbol + "_ohlc"];
    if (!ohlc) {
      ohlc = generateStockHistoryOHLC(symbol);
      stockHistory[symbol + "_ohlc"] = ohlc;
    }
    // Trend-Indikator auf Basis der letzten Kerze
    const last = ohlc[ohlc.length - 1]?.c || 0;
    const prev = ohlc[ohlc.length - 2]?.c || last;
    const change = last - prev;
    const changePct = prev ? (change / prev * 100) : 0;
    trendIndicator.innerHTML = `
      <span class="${getTrendClass(change)}">
        ${getTrendArrow(change)} ${last.toFixed(2)} EUR (${change >= 0 ? "+" : ""}${change.toFixed(2)}, ${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%)
      </span>
    `;

    // Candlestick-Chart mit farbigen Kerzen je nach Bewegung
    chart = new Chart(chartCtx, {
      type: 'candlestick',
      data: {
        datasets: [{
          label: `${name} (${symbol})`,
          data: ohlc.map((d, i) => ({
            x: d.x,
            o: d.o,
            h: d.h,
            l: d.l,
            c: d.c,
            // Chart.js Financial: color je nach Bewegung
            borderColor: d.c > d.o ? "#1f8c43" : "#e03a3a",
            backgroundColor: d.c > d.o ? "#1f8c43" : "#e03a3a"
          }))
        }]
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              tooltipFormat: 'dd.MM.yyyy',
              displayFormats: { day: 'dd.MM.yyyy' }
            },
            adapters: {
              date: luxon
            },
            ticks: { color: "#bfc9db" },
            title: { display: true, text: 'Datum' }
          },
          y: {
            title: { display: true, text: 'Kurs in EUR' },
            ticks: { color: "#bfc9db" }
          }
        }
      }
    });
  } else {
    // Liniendiagramm
    const prices = stockHistory[symbol] || generateStockHistory(symbol);
    // Trend-Indikator
    const last = prices[prices.length - 1]?.y || 0;
    const prev = prices[prices.length - 2]?.y || last;
    const change = last - prev;
    const changePct = prev ? (change / prev * 100) : 0;
    trendIndicator.innerHTML = `
      <span class="${getTrendClass(change)}">
        ${getTrendArrow(change)} ${last.toFixed(2)} EUR (${change >= 0 ? "+" : ""}${change.toFixed(2)}, ${changePct >= 0 ? "+" : ""}${changePct.toFixed(2)}%)
      </span>
    `;
    const borderColor = change > 0 ? "#1f8c43" : (change < 0 ? "#e03a3a" : "#bfc9db");
    const bgColor = change > 0
      ? "rgba(31,140,67,0.18)"
      : (change < 0 ? "rgba(224,58,58,0.13)" : "rgba(191,201,219,0.10)");
    chart = new Chart(chartCtx, {
      type: 'line',
      data: {
        labels: prices.map(p => p.x + " " + nowTime),
        datasets: [{
          label: `${name} (${symbol})`,
          data: prices.map(p => p.y),
          borderColor,
          backgroundColor: bgColor,
          tension: 0.3,
          pointRadius: 2,
          fill: true,
        }],
      },
      options: {
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { title: { display: true, text: 'Datum & Uhrzeit' }, ticks: { color: "#bfc9db" } },
          y: { title: { display: true, text: 'Kurs in EUR' }, ticks: { color: "#bfc9db" } }
        }
      }
    });
  }
}

function invest() {
  const amount = parseFloat(amountInput.value);
  const symbol = stockSelect.value;
  if (isNaN(amount) || amount <= 0 || amount > balance) return;

  const inv = {
    symbol,
    amount,
    date: new Date().toLocaleDateString(),
    buyPrice: getCurrentPrice(symbol),
    collected: false
  };
  investments.push(inv);
  addInvestmentToList(inv, investments.length - 1);
  balance -= amount;
  updateBalance();
  saveInvestments();
  updateStats();
}

function collectGains() {
  let totalGain = 0;
  investments.forEach(inv => {
    if (!inv.collected) {
      const currentPrice = getCurrentPrice(inv.symbol);
      const gain = Math.max(0, (currentPrice - inv.buyPrice) / inv.buyPrice * inv.amount);
      if (gain > 0) {
        totalGain += gain;
        inv.collected = true;
      }
    }
  });
  if (totalGain > 0) {
    balance += totalGain;
    updateBalance();
    saveInvestments();
    updateStats();
    investmentList.innerHTML = "";
    investments.forEach((inv, idx) => addInvestmentToList(inv, idx));
    alert(`Du hast ${totalGain.toFixed(2)} MONETEN Gewinn eingesammelt (nur auf gestiegene Investments)!`);
  } else {
    alert("Keine Gewinne zum Einsammeln vorhanden.");
  }
}

function refreshAll() {
  updateAllStockHistories();
  renderChart(stockSelect.value);
  updateBalance();
  // Investment-Liste neu rendern, damit Gewinne/Verluste aktuell sind
  investmentList.innerHTML = "";
  investments.forEach((inv, idx) => addInvestmentToList(inv, idx));
}

function setupAutoRefresh() {
  if (autoRefreshInterval) clearInterval(autoRefreshInterval);
  if (autoRefresh) {
    autoRefreshInterval = setInterval(() => {
      refreshAll();
    }, refreshIntervalMs);
  }
}

investmentList.addEventListener("click", function (e) {
  if (e.target.classList.contains("sell-single-btn")) {
    const idx = parseInt(e.target.getAttribute("data-idx"), 10);
    if (isNaN(idx) || !investments[idx]) return;
    const inv = investments[idx];
    const currentPrice = getCurrentPrice(inv.symbol);
    // Wertänderung seit Investition (aktueller Wert)
    const payout = inv.amount * (currentPrice / (inv.buyPrice || currentPrice));
    investments.splice(idx, 1);
    balance += payout;
    updateBalance();
    saveInvestments();
    updateStats();
    investmentList.innerHTML = "";
    investments.forEach((inv, idx) => addInvestmentToList(inv, idx));
    alert(`Du hast dieses Investment für ${payout.toFixed(2)} MONETEN zurückgegeben (Wertänderung seit Investition)!`);
  }
});

investBtn.addEventListener("click", invest);
chartTypeSelect.addEventListener("change", () => renderChart(stockSelect.value));
stockSelect.addEventListener("change", () => {
  renderChart(stockSelect.value);
  updateStockInfo(stockSelect.value);
});
collectBtn.addEventListener("click", collectGains);
refreshBtn.addEventListener("click", refreshAll);
refreshSpeed.addEventListener("change", () => {
  refreshIntervalMs = parseInt(refreshSpeed.value, 10);
  setupAutoRefresh();
});
autoRefreshToggle.addEventListener("change", () => {
  autoRefresh = autoRefreshToggle.checked;
  setupAutoRefresh();
});

// Infotext-Element unterhalb des Dropdowns einfügen
const stockInfoBox = document.createElement("div");
stockInfoBox.id = "stock-info-box";
stockInfoBox.style.margin = "12px 0 18px 0";
stockInfoBox.style.padding = "10px";
stockInfoBox.style.background = "#232b3b";
stockInfoBox.style.borderRadius = "7px";
stockInfoBox.style.color = "#e0e6f0";
stockInfoBox.style.fontSize = "1em";
stockSelect.parentNode.insertBefore(stockInfoBox, stockSelect.nextSibling);

// Newsticker am unteren Bildschirmrand
const newsTicker = document.createElement("div");
newsTicker.id = "news-ticker";
newsTicker.style.position = "fixed";
newsTicker.style.left = "0";
newsTicker.style.right = "0";
newsTicker.style.bottom = "0";
newsTicker.style.height = "38px";
newsTicker.style.background = "#1a2233";
newsTicker.style.color = "#fff";
newsTicker.style.fontSize = "1.1em";
newsTicker.style.fontWeight = "bold";
newsTicker.style.zIndex = "9999";
newsTicker.style.overflow = "hidden";
newsTicker.style.borderTop = "2px solid #2c3957";
newsTicker.style.display = "flex";
newsTicker.style.alignItems = "center";
newsTicker.style.paddingLeft = "0";
newsTicker.style.transition = "opacity 0.5s";
newsTicker.innerHTML = `
  <div id="news-ticker-inner" style="white-space:nowrap;display:inline-block;position:relative;will-change:transform;"></div>
  <input id="news-ticker-speed" type="range" min="20" max="200" value="60" style="margin-left:auto;margin-right:18px;width:120px;vertical-align:middle;">
`;
document.body.appendChild(newsTicker);

let tickerAnimationId = null;
let tickerSpeed = 60; // px/s

const newsTickerSpeedInput = document.getElementById("news-ticker-speed");
newsTickerSpeedInput.title = "Ticker-Geschwindigkeit";
newsTickerSpeedInput.addEventListener("input", function () {
  tickerSpeed = parseInt(this.value, 10);
  updateNewsTicker(stockSelect.value, true);
});

function updateNewsTicker(symbol, immediate = false) {
  const text = stockInfos[symbol] || "Keine Informationen zu diesem Unternehmen verfügbar.";
  const cleanText = text.replace(/<[^>]+>/g, ""); // HTML-Tags entfernen
  const tickerText = `+++ ${cleanText} +++`;

  const inner = document.getElementById("news-ticker-inner");
  // Für Loop: Text doppelt mit Abstand
  inner.textContent = "";
  const span1 = document.createElement("span");
  span1.textContent = tickerText + "   ";
  const span2 = document.createElement("span");
  span2.textContent = tickerText + "   ";
  inner.appendChild(span1);
  inner.appendChild(span2);

  // Animation ggf. abbrechen
  if (tickerAnimationId) {
    cancelAnimationFrame(tickerAnimationId);
    tickerAnimationId = null;
  }

  // Für sanften Übergang bei Wechsel
  if (!immediate) {
    newsTicker.style.opacity = "0";
    setTimeout(() => {
      startTickerLoop(inner, span1, span2);
      newsTicker.style.opacity = "1";
    }, 350);
  } else {
    startTickerLoop(inner, span1, span2);
    newsTicker.style.opacity = "1";
  }
}

function startTickerLoop(inner, span1, span2) {
  // Setze beide Spans nebeneinander
  const textWidth = span1.offsetWidth;
  let pos = 0;
  function loop() {
    pos -= tickerSpeed / 60; // px pro Frame (bei 60fps)
    if (Math.abs(pos) >= textWidth) {
      pos += textWidth;
    }
    inner.style.transform = `translateX(${pos}px)`;
    tickerAnimationId = requestAnimationFrame(loop);
  }
  // Reset
  inner.style.transition = "none";
  inner.style.transform = "translateX(0px)";
  pos = 0;
  tickerAnimationId = requestAnimationFrame(loop);
}

function updateStockInfo(symbol) {
  stockInfoBox.innerHTML = stockInfos[symbol] || "Keine Informationen zu diesem Unternehmen verfügbar.";
  updateNewsTicker(symbol);
}

function populateStockSelect() {
  stockSelect.innerHTML = "";
  Object.keys(stockNames).forEach(symbol => {
    const opt = document.createElement("option");
    opt.value = symbol;
    opt.textContent = `${symbol} – ${stockNames[symbol]}`;
    stockSelect.appendChild(opt);
  });
  updateStockInfo(stockSelect.value);
}

window.onload = () => {
  const stocks = [
    // Internationale Tech & Konsum
    "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA",
    "META", "NVDA", "CSCO", "INTC", "NFLX", "DIS", "JNJ", "PFE", "KO", "NKE",
    // Deutsche/DAX-Unternehmen
    "SAP", "BMW.DE", "SIE.DE", "BAS.DE", "VOW3.DE", "DTE.DE", "DBK.DE",
    "ADS.DE", "ALV.DE", "RWE.DE", "FRE.DE", "MUV2.DE", "RHM.DE",
    // Internationale Konsum & Luxus
    "AIR.PA", "OR.PA", "MC.PA",
    // Internationale Brauereien
    "ABI.BR", "HEIA.AS", "CARL-B.CO", "BUD", "SAM", "DGE.L"
  ];
  stocks.forEach(symbol => {
    stockHistory[symbol] = generateStockHistory(symbol);
    stockHistory[symbol + "_ohlc"] = generateStockHistoryOHLC(symbol);
  });
  balance = parseFloat(localStorage.getItem("sim_balance")) || START_MONEY;
  updateBalance();
  loadInvestments();
  populateStockSelect();
  updateStockInfo(stockSelect.value);
  setTimeout(() => renderChart(stockSelect.value), 100);
  refreshIntervalMs = parseInt(refreshSpeed.value, 10);
  autoRefresh = autoRefreshToggle.checked;
  setupAutoRefresh();
  // Newsticker initialisieren
  tickerSpeed = parseInt(newsTickerSpeedInput.value, 10);
  updateNewsTicker(stockSelect.value, true);
};
