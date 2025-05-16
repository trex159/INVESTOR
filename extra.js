function populateStockSelect() {
  // Aktienliste: Nur echte, börsennotierte Unternehmen (keine fiktiven/lokalen Firmen, keine rein regionalen Brauereien)
  const stocks = [
    // Internationale Tech & Konsum
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "MSFT", name: "Microsoft Corp." },
    { symbol: "GOOGL", name: "Alphabet Inc." },
    { symbol: "AMZN", name: "Amazon.com Inc." },
    { symbol: "TSLA", name: "Tesla Inc." },
    { symbol: "META", name: "Meta Platforms" },
    { symbol: "NVDA", name: "NVIDIA Corp." },
    { symbol: "CSCO", name: "Cisco Systems" },
    { symbol: "INTC", name: "Intel Corp." },
    { symbol: "NFLX", name: "Netflix Inc." },
    { symbol: "DIS", name: "Walt Disney Co." },
    { symbol: "JNJ", name: "Johnson & Johnson" },
    { symbol: "PFE", name: "Pfizer Inc." },
    { symbol: "KO", name: "Coca-Cola Co." },
    { symbol: "NKE", name: "Nike Inc." },
    // Deutsche/DAX-Unternehmen
    { symbol: "SAP", name: "SAP SE" },
    { symbol: "BMW.DE", name: "BMW AG" },
    { symbol: "SIE.DE", name: "Siemens AG" },
    { symbol: "BAS.DE", name: "BASF SE" },
    { symbol: "VOW3.DE", name: "Volkswagen AG" },
    { symbol: "DTE.DE", name: "Deutsche Telekom AG" },
    { symbol: "DBK.DE", name: "Deutsche Bank AG" },
    { symbol: "ADS.DE", name: "Adidas AG" },
    { symbol: "ALV.DE", name: "Allianz SE" },
    { symbol: "RWE.DE", name: "RWE AG" },
    { symbol: "FRE.DE", name: "Fresenius SE" },
    { symbol: "MUV2.DE", name: "Münchener Rück" },
    { symbol: "RHM.DE", name: "Rheinmetall AG" },
    // Internationale Konsum & Luxus
    { symbol: "AIR.PA", name: "Airbus SE" },
    { symbol: "OR.PA", name: "L'Oréal SA" },
    { symbol: "MC.PA", name: "LVMH Moet Hennessy" },
    // Brauereien (nur international börsennotierte)
    { symbol: "ABI.BR", name: "AB InBev (Anheuser-Busch InBev)" },
    { symbol: "HEIA.AS", name: "Heineken N.V." },
    { symbol: "CARL-B.CO", name: "Carlsberg A/S" },
    { symbol: "BUD", name: "Budweiser Brewing Co." },
    { symbol: "SAM", name: "Boston Beer Company" },
    { symbol: "DGE.L", name: "Diageo (Guinness)" }
  ];
  for (const stock of stocks) {
    const opt = document.createElement("option");
    opt.value = stock.symbol;
    opt.textContent = `${stock.name} (${stock.symbol})`;
    stockSelect.appendChild(opt);
  }
  renderChart(stocks[0].symbol);
}
