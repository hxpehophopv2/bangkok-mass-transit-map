let currentRouteData = null;
let optimizeType = "time";

// 1. The Secret Dictionary
const nameToIDMap = {};
const idToNameMap = {};

// 2. Fetch data
const fetchStationData = async () => {
  try {
    const res = await fetch("http://localhost:3000/stations");
    return await res.json();
  } catch (error) {
    console.error("🚨 Failed to fetch station data:", error);
    return [];
  }
};

// 3. Inject options (and build the dictionary!)
const injectStationOptions = (stationData, originList, destList) => {
  stationData.forEach((station) => {
    // Save the translation! (e.g., "Siam" -> "CEN_SIL")
    nameToIDMap[station.en_name] = station.station_id;
    idToNameMap[station.station_id] = station.en_name;

    // We set BOTH the text AND the value to the English name for the datalist
    const originOption = new Option(station.en_name, station.station_id);
    const destOption = new Option(station.en_name, station.station_id);

    originList.appendChild(originOption);
    destList.appendChild(destOption);
  });
};

// 4. Render output

const displayOutputRoute = (route) => {
  const outputPathEl = document.getElementById("outputPath");
  outputPathEl.innerHTML = "";
  const translatedPath = route.path.map((stationID) => idToNameMap[stationID]);
  translatedPath.forEach((station) => {
    const stationLi = document.createElement("LI");
    stationLi.innerText = station;
    outputPathEl.appendChild(stationLi);
  });
};

const displayOutput = (route) => {
  const outputEl = document.getElementById("output");

  if (route.error) {
    outputEl.innerText = `Error: ${route.error}`;
    return;
  }

  outputEl.innerText =
    "Total fare: " +
    route.totalFare +
    " Baht" +
    "\nEstimated time: " +
    route.totalTime +
    " minutes" +
    "\nTotal stations: " +
    route.totalStations +
    "\nTotal transfers: " +
    route.totalTransfers +
    "\n\nYour Route: \n";

  displayOutputRoute(route);
};

// 5. Attach listener
const setupSearchListener = () => {
  const searchBtn = document.getElementById("searchBtn");

  // TRAP DODGED: We grab the INPUT fields here, NOT the datalists!
  const originInput = document.getElementById("originInput");
  const destInput = document.getElementById("destInput");

  searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    // Grab the English names the user typed/selected
    const originID = originInput.value;
    const destID = destInput.value;
    const optimizeFor = "cost";

    if (!originID || !destID) {
      alert("Please select a valid station from the list!");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:3000/route?start=${originID}&end=${destID}`,
      );
      const route = await res.json();
      console.log(route);
      currentRouteData = route;

      const routeToRender =
        optimizeType === "cost"
          ? currentRouteData.costOptimized
          : currentRouteData.timeOptimized;

      displayOutput(routeToRender);
    } catch (error) {
      console.error("🚨 Fetch Error:", error);
    }
  });
};

const setupOptimizeListener = () => {
  const switchEl = document.getElementById("optimizeFor");
  switchEl.addEventListener("change", () => {
    optimizeType = switchEl.checked ? "cost" : "time";
    if (currentRouteData) {
      const routeToRender =
        optimizeType === "cost"
          ? currentRouteData.costOptimized
          : currentRouteData.timeOptimized;
      displayOutput(routeToRender);
    }
  });
};

// 6. Master Boot
const initApp = async () => {
  // Grab the datalists to inject the options into them
  const originList = document.getElementById("originStations");
  const destList = document.getElementById("destStations");
  if (!originList || !destList) return;

  const stationData = await fetchStationData();
  injectStationOptions(stationData, originList, destList);
  setupSearchListener();
  setupOptimizeListener();
};

initApp();
