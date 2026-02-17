/* ────────────────────────────────────────────
   Color system – time-of-day gradient (FIO style)
   Maps the local hour at each timezone to a
   background color. Daytime is warm & light,
   nighttime is deep & dark.
   ──────────────────────────────────────────── */
const TIME_STOPS = [
  { h: 0,  r: 15,  g: 13,  b: 50  },   // midnight – deep indigo
  { h: 3,  r: 15,  g: 28,  b: 58  },   // pre-dawn – dark navy
  { h: 5,  r: 55,  g: 130, b: 125 },   // dawn – muted teal
  { h: 6,  r: 75,  g: 192, b: 182 },   // early morning – teal
  { h: 8,  r: 140, g: 198, b: 158 },   // morning – sage green
  { h: 9,  r: 168, g: 208, b: 168 },   // mid-morning – mint
  { h: 11, r: 212, g: 218, b: 142 },   // late morning – yellow-green
  { h: 13, r: 238, g: 188, b: 68  },   // noon – golden
  { h: 15, r: 232, g: 158, b: 48  },   // afternoon – amber
  { h: 17, r: 212, g: 122, b: 62  },   // late afternoon – orange
  { h: 19, r: 142, g: 92,  b: 142 },   // sunset – mauve
  { h: 20, r: 68,  g: 42,  b: 102 },   // evening – dark purple
  { h: 22, r: 32,  g: 26,  b: 78  },   // night – dark navy
  { h: 24, r: 15,  g: 13,  b: 50  },   // midnight
];

function lerpStops(hour) {
  hour = ((hour % 24) + 24) % 24;
  let i = 0;
  for (; i < TIME_STOPS.length - 1; i++) {
    if (hour < TIME_STOPS[i + 1].h) break;
  }
  const a = TIME_STOPS[i], b = TIME_STOPS[i + 1];
  const t = (hour - a.h) / (b.h - a.h);
  return {
    r: Math.round(a.r + (b.r - a.r) * t),
    g: Math.round(a.g + (b.g - a.g) * t),
    b: Math.round(a.b + (b.b - a.b) * t),
  };
}

function getHourOfDay(tz) {
  const now = getNow();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hour: "numeric", minute: "numeric", hour12: false,
  }).formatToParts(now);
  const h = parseInt(parts.find(p => p.type === "hour").value, 10);
  const m = parseInt(parts.find(p => p.type === "minute").value, 10);
  return (h % 24) + m / 60;
}

function timeOfDayGradient(tz) {
  const hour = getHourOfDay(tz);
  const c = lerpStops(hour);
  const top = { r: Math.min(255, c.r + 12), g: Math.min(255, c.g + 12), b: Math.min(255, c.b + 8) };
  const bot = { r: Math.max(0, c.r - 12), g: Math.max(0, c.g - 12), b: Math.max(0, c.b - 8) };
  return `linear-gradient(180deg, rgb(${top.r},${top.g},${top.b}) 0%, rgb(${c.r},${c.g},${c.b}) 50%, rgb(${bot.r},${bot.g},${bot.b}) 100%)`;
}

function textColorForBg(tz) {
  const c = lerpStops(getHourOfDay(tz));
  const lum = (0.299 * c.r + 0.587 * c.g + 0.114 * c.b) / 255;
  return lum > 0.45 ? "rgba(30, 30, 60, 0.85)" : "rgba(255, 255, 255, 0.92)";
}

/* ────────────────────────────────────────────
   City database
   ──────────────────────────────────────────── */
const CITIES = [
  { name: "New York", tz: "America/New_York", country: "US", admin1: "NY" },
  { name: "Los Angeles", tz: "America/Los_Angeles", country: "US", admin1: "CA" },
  { name: "Chicago", tz: "America/Chicago", country: "US", admin1: "IL" },
  { name: "Denver", tz: "America/Denver", country: "US", admin1: "CO" },
  { name: "Anchorage", tz: "America/Anchorage", country: "US", admin1: "AK" },
  { name: "Honolulu", tz: "Pacific/Honolulu", country: "US", admin1: "HI" },
  { name: "Phoenix", tz: "America/Phoenix", country: "US", admin1: "AZ" },
  { name: "Miami", tz: "America/New_York", country: "US", admin1: "FL" },
  { name: "Seattle", tz: "America/Los_Angeles", country: "US", admin1: "WA" },
  { name: "San Francisco", tz: "America/Los_Angeles", country: "US", admin1: "CA" },
  { name: "Austin", tz: "America/Chicago", country: "US", admin1: "TX" },
  { name: "Boston", tz: "America/New_York", country: "US", admin1: "MA" },
  { name: "Washington D.C.", tz: "America/New_York", country: "US", admin1: "DC" },
  { name: "Atlanta", tz: "America/New_York", country: "US", admin1: "GA" },
  { name: "Dallas", tz: "America/Chicago", country: "US", admin1: "TX" },
  { name: "Houston", tz: "America/Chicago", country: "US", admin1: "TX" },
  { name: "Minneapolis", tz: "America/Chicago", country: "US", admin1: "MN" },
  { name: "Detroit", tz: "America/Detroit", country: "US", admin1: "MI" },
  { name: "Philadelphia", tz: "America/New_York", country: "US", admin1: "PA" },
  { name: "Nashville", tz: "America/Chicago", country: "US", admin1: "TN" },
  { name: "Portland", tz: "America/Los_Angeles", country: "US", admin1: "OR" },
  { name: "Las Vegas", tz: "America/Los_Angeles", country: "US", admin1: "NV" },
  { name: "Toronto", tz: "America/Toronto", country: "CA", admin1: "ON" },
  { name: "Vancouver", tz: "America/Vancouver", country: "CA", admin1: "BC" },
  { name: "Montreal", tz: "America/Montreal", country: "CA", admin1: "QC" },
  { name: "Calgary", tz: "America/Edmonton", country: "CA", admin1: "AB" },
  { name: "Edmonton", tz: "America/Edmonton", country: "CA", admin1: "AB" },
  { name: "Ottawa", tz: "America/Toronto", country: "CA", admin1: "ON" },
  { name: "Mexico City", tz: "America/Mexico_City", country: "MX" },
  { name: "Guadalajara", tz: "America/Mexico_City", country: "MX" },
  { name: "Cancun", tz: "America/Cancun", country: "MX" },
  { name: "London", tz: "Europe/London", country: "UK" },
  { name: "Edinburgh", tz: "Europe/London", country: "UK" },
  { name: "Manchester", tz: "Europe/London", country: "UK" },
  { name: "Paris", tz: "Europe/Paris", country: "FR" },
  { name: "Lyon", tz: "Europe/Paris", country: "FR" },
  { name: "Berlin", tz: "Europe/Berlin", country: "DE" },
  { name: "Munich", tz: "Europe/Berlin", country: "DE" },
  { name: "Frankfurt", tz: "Europe/Berlin", country: "DE" },
  { name: "Hamburg", tz: "Europe/Berlin", country: "DE" },
  { name: "Madrid", tz: "Europe/Madrid", country: "ES" },
  { name: "Barcelona", tz: "Europe/Madrid", country: "ES" },
  { name: "Rome", tz: "Europe/Rome", country: "IT" },
  { name: "Milan", tz: "Europe/Rome", country: "IT" },
  { name: "Amsterdam", tz: "Europe/Amsterdam", country: "NL" },
  { name: "Brussels", tz: "Europe/Brussels", country: "BE" },
  { name: "Zurich", tz: "Europe/Zurich", country: "CH" },
  { name: "Geneva", tz: "Europe/Zurich", country: "CH" },
  { name: "Vienna", tz: "Europe/Vienna", country: "AT" },
  { name: "Stockholm", tz: "Europe/Stockholm", country: "SE" },
  { name: "Copenhagen", tz: "Europe/Copenhagen", country: "DK" },
  { name: "Oslo", tz: "Europe/Oslo", country: "NO" },
  { name: "Helsinki", tz: "Europe/Helsinki", country: "FI" },
  { name: "Dublin", tz: "Europe/Dublin", country: "IE" },
  { name: "Lisbon", tz: "Europe/Lisbon", country: "PT" },
  { name: "Warsaw", tz: "Europe/Warsaw", country: "PL" },
  { name: "Prague", tz: "Europe/Prague", country: "CZ" },
  { name: "Budapest", tz: "Europe/Budapest", country: "HU" },
  { name: "Athens", tz: "Europe/Athens", country: "GR" },
  { name: "Bucharest", tz: "Europe/Bucharest", country: "RO" },
  { name: "Istanbul", tz: "Europe/Istanbul", country: "TR" },
  { name: "Moscow", tz: "Europe/Moscow", country: "RU" },
  { name: "St. Petersburg", tz: "Europe/Moscow", country: "RU" },
  { name: "Kyiv", tz: "Europe/Kyiv", country: "UA" },
  { name: "Tokyo", tz: "Asia/Tokyo", country: "JP" },
  { name: "Osaka", tz: "Asia/Tokyo", country: "JP" },
  { name: "Seoul", tz: "Asia/Seoul", country: "KR" },
  { name: "Shanghai", tz: "Asia/Shanghai", country: "CN" },
  { name: "Beijing", tz: "Asia/Shanghai", country: "CN" },
  { name: "Shenzhen", tz: "Asia/Shanghai", country: "CN" },
  { name: "Hong Kong", tz: "Asia/Hong_Kong", country: "HK" },
  { name: "Taipei", tz: "Asia/Taipei", country: "TW" },
  { name: "Singapore", tz: "Asia/Singapore", country: "SG" },
  { name: "Bangkok", tz: "Asia/Bangkok", country: "TH" },
  { name: "Ho Chi Minh City", tz: "Asia/Ho_Chi_Minh", country: "VN" },
  { name: "Hanoi", tz: "Asia/Ho_Chi_Minh", country: "VN" },
  { name: "Jakarta", tz: "Asia/Jakarta", country: "ID" },
  { name: "Bali", tz: "Asia/Makassar", country: "ID" },
  { name: "Kuala Lumpur", tz: "Asia/Kuala_Lumpur", country: "MY" },
  { name: "Manila", tz: "Asia/Manila", country: "PH" },
  { name: "Mumbai", tz: "Asia/Kolkata", country: "IN" },
  { name: "Delhi", tz: "Asia/Kolkata", country: "IN" },
  { name: "Bangalore", tz: "Asia/Kolkata", country: "IN" },
  { name: "Kolkata", tz: "Asia/Kolkata", country: "IN" },
  { name: "Chennai", tz: "Asia/Kolkata", country: "IN" },
  { name: "Hyderabad", tz: "Asia/Kolkata", country: "IN" },
  { name: "Dubai", tz: "Asia/Dubai", country: "AE" },
  { name: "Abu Dhabi", tz: "Asia/Dubai", country: "AE" },
  { name: "Riyadh", tz: "Asia/Riyadh", country: "SA" },
  { name: "Doha", tz: "Asia/Qatar", country: "QA" },
  { name: "Tel Aviv", tz: "Asia/Jerusalem", country: "IL" },
  { name: "Jerusalem", tz: "Asia/Jerusalem", country: "IL" },
  { name: "Beirut", tz: "Asia/Beirut", country: "LB" },
  { name: "Karachi", tz: "Asia/Karachi", country: "PK" },
  { name: "Dhaka", tz: "Asia/Dhaka", country: "BD" },
  { name: "Colombo", tz: "Asia/Colombo", country: "LK" },
  { name: "Kathmandu", tz: "Asia/Kathmandu", country: "NP" },
  { name: "Sydney", tz: "Australia/Sydney", country: "AU" },
  { name: "Melbourne", tz: "Australia/Melbourne", country: "AU" },
  { name: "Brisbane", tz: "Australia/Brisbane", country: "AU" },
  { name: "Perth", tz: "Australia/Perth", country: "AU" },
  { name: "Adelaide", tz: "Australia/Adelaide", country: "AU" },
  { name: "Auckland", tz: "Pacific/Auckland", country: "NZ" },
  { name: "Wellington", tz: "Pacific/Auckland", country: "NZ" },
  { name: "Fiji", tz: "Pacific/Fiji", country: "FJ" },
  { name: "Cairo", tz: "Africa/Cairo", country: "EG" },
  { name: "Lagos", tz: "Africa/Lagos", country: "NG" },
  { name: "Nairobi", tz: "Africa/Nairobi", country: "KE" },
  { name: "Johannesburg", tz: "Africa/Johannesburg", country: "ZA" },
  { name: "Cape Town", tz: "Africa/Johannesburg", country: "ZA" },
  { name: "Casablanca", tz: "Africa/Casablanca", country: "MA" },
  { name: "Accra", tz: "Africa/Accra", country: "GH" },
  { name: "Addis Ababa", tz: "Africa/Addis_Ababa", country: "ET" },
  { name: "Buenos Aires", tz: "America/Argentina/Buenos_Aires", country: "AR" },
  { name: "Santiago", tz: "America/Santiago", country: "CL" },
  { name: "Lima", tz: "America/Lima", country: "PE" },
  { name: "Bogota", tz: "America/Bogota", country: "CO" },
  { name: "Sao Paulo", tz: "America/Sao_Paulo", country: "BR" },
  { name: "Rio de Janeiro", tz: "America/Sao_Paulo", country: "BR" },
  { name: "Havana", tz: "America/Havana", country: "CU" },
  { name: "Reykjavik", tz: "Atlantic/Reykjavik", country: "IS" },
];

/* ────────────────────────────────────────────
   Country code → full name
   ──────────────────────────────────────────── */
const COUNTRY_NAMES = {
  US: "United States", CA: "Canada", MX: "Mexico",
  UK: "United Kingdom", FR: "France", DE: "Germany", ES: "Spain", IT: "Italy",
  NL: "Netherlands", BE: "Belgium", CH: "Switzerland", AT: "Austria",
  SE: "Sweden", DK: "Denmark", NO: "Norway", FI: "Finland",
  IE: "Ireland", PT: "Portugal", PL: "Poland", CZ: "Czech Republic",
  HU: "Hungary", GR: "Greece", RO: "Romania", TR: "Turkey",
  RU: "Russia", UA: "Ukraine",
  JP: "Japan", KR: "South Korea", CN: "China", HK: "Hong Kong", TW: "Taiwan",
  SG: "Singapore", TH: "Thailand", VN: "Vietnam", ID: "Indonesia",
  MY: "Malaysia", PH: "Philippines",
  IN: "India", AE: "United Arab Emirates", SA: "Saudi Arabia", QA: "Qatar",
  IL: "Israel", LB: "Lebanon", PK: "Pakistan", BD: "Bangladesh",
  LK: "Sri Lanka", NP: "Nepal",
  AU: "Australia", NZ: "New Zealand", FJ: "Fiji",
  EG: "Egypt", NG: "Nigeria", KE: "Kenya", ZA: "South Africa",
  MA: "Morocco", GH: "Ghana", ET: "Ethiopia",
  AR: "Argentina", CL: "Chile", PE: "Peru", CO: "Colombia",
  BR: "Brazil", CU: "Cuba", IS: "Iceland",
};

function countryFullName(code) {
  return COUNTRY_NAMES[code] || code;
}

// Countries large enough to show admin1 (state/province) in display
const SHOW_ADMIN1 = new Set(["US", "CA", "AU", "BR", "RU"]);

// Map full US state names → abbreviations (for API results)
const US_STATE_ABBR = {
  "Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA",
  "Colorado":"CO","Connecticut":"CT","Delaware":"DE","Florida":"FL","Georgia":"GA",
  "Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA","Kansas":"KS",
  "Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD","Massachusetts":"MA",
  "Michigan":"MI","Minnesota":"MN","Mississippi":"MS","Missouri":"MO","Montana":"MT",
  "Nebraska":"NE","Nevada":"NV","New Hampshire":"NH","New Jersey":"NJ","New Mexico":"NM",
  "New York":"NY","North Carolina":"NC","North Dakota":"ND","Ohio":"OH","Oklahoma":"OK",
  "Oregon":"OR","Pennsylvania":"PA","Rhode Island":"RI","South Carolina":"SC",
  "South Dakota":"SD","Tennessee":"TN","Texas":"TX","Utah":"UT","Vermont":"VT",
  "Virginia":"VA","Washington":"WA","West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY",
  "District of Columbia":"DC",
};
const CA_PROV_ABBR = {
  "Alberta":"AB","British Columbia":"BC","Manitoba":"MB","New Brunswick":"NB",
  "Newfoundland and Labrador":"NL","Nova Scotia":"NS","Northwest Territories":"NT",
  "Nunavut":"NU","Ontario":"ON","Prince Edward Island":"PE","Quebec":"QC",
  "Saskatchewan":"SK","Yukon":"YT",
};

function abbreviateAdmin1(admin1, country) {
  if (!admin1) return "";
  if (country === "US") return US_STATE_ABBR[admin1] || admin1;
  if (country === "CA") return CA_PROV_ABBR[admin1] || admin1;
  return admin1;
}

// FIO-style display: "City, ST, Country" for US/CA; "City, Country" for others
function formatCityDisplay(city) {
  const parts = [city.name];
  if (city.admin1 && SHOW_ADMIN1.has(city.country)) {
    parts.push(abbreviateAdmin1(city.admin1, city.country));
  }
  parts.push(countryFullName(city.country));
  return parts.join(", ");
}

/* ────────────────────────────────────────────
   State
   ──────────────────────────────────────────── */
// Each saved location: { name, tz, country }
// Columns are grouped by timezone offset (auto-grouped)
let savedLocations = [];
let use24h = false;
let timeOffsetHours = 0;

function getNow() {
  const d = new Date();
  if (timeOffsetHours !== 0) {
    d.setTime(d.getTime() + timeOffsetHours * 3600000);
  }
  return d;
}

/* ────────────────────────────────────────────
   Persistence
   ──────────────────────────────────────────── */
function loadState(cb) {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.sync.get(["fio_locations", "fio_24h"], (data) => {
      savedLocations = data.fio_locations || [];
      use24h = data.fio_24h || false;
      cb();
    });
  } else {
    try {
      savedLocations = JSON.parse(localStorage.getItem("fio_locations")) || [];
      use24h = JSON.parse(localStorage.getItem("fio_24h")) || false;
    } catch(e) {}
    cb();
  }
}

function saveState() {
  if (typeof chrome !== "undefined" && chrome.storage) {
    chrome.storage.sync.set({ fio_locations: savedLocations, fio_24h: use24h });
  } else {
    localStorage.setItem("fio_locations", JSON.stringify(savedLocations));
    localStorage.setItem("fio_24h", JSON.stringify(use24h));
  }
}

/* ────────────────────────────────────────────
   Grouping: cities sharing the same UTC offset
   get placed into the same column (max 3 per column).
   ──────────────────────────────────────────── */
function getOffsetMinutes(tz) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "shortOffset",
  }).formatToParts(now);
  const offsetStr = parts.find(p => p.type === "timeZoneName")?.value || "GMT";
  // Parse "GMT+5:30" or "GMT-4" etc
  const match = offsetStr.match(/GMT([+-]?)(\d+)?(?::(\d+))?/);
  if (!match) return 0;
  const sign = match[1] === "-" ? -1 : 1;
  const hours = parseInt(match[2] || "0", 10);
  const mins = parseInt(match[3] || "0", 10);
  return sign * (hours * 60 + mins);
}

function groupLocations() {
  // Group by offset, maintain order of first appearance
  const groups = [];
  const offsetMap = new Map();

  savedLocations.forEach(loc => {
    const offset = getOffsetMinutes(loc.tz);
    if (offsetMap.has(offset)) {
      const group = offsetMap.get(offset);
      if (group.cities.length < 3) {
        group.cities.push(loc);
      }
    } else {
      const group = { offset, tz: loc.tz, cities: [loc] };
      groups.push(group);
      offsetMap.set(offset, group);
    }
  });

  // Sort groups by offset (west to east)
  groups.sort((a, b) => a.offset - b.offset);
  return groups;
}

/* ────────────────────────────────────────────
   Formatting
   ──────────────────────────────────────────── */
function formatTimeParts(tz) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: !use24h,
  }).formatToParts(getNow());
  let hours = "", minutes = "", ampm = "";
  parts.forEach(p => {
    if (p.type === "hour") hours = p.value;
    if (p.type === "minute") minutes = p.value;
    if (p.type === "dayPeriod") ampm = p.value;
  });
  return { hours, minutes, ampm };
}

function ordinalDay(n) {
  const s = ["th","st","nd","rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function formatDate(tz) {
  const now = getNow();
  const weekday = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(now);
  const day = parseInt(new Intl.DateTimeFormat("en-US", { timeZone: tz, day: "numeric" }).format(now), 10);
  return `${weekday}. ${ordinalDay(day)}`;
}

function getOffsetLabel(tz) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    timeZoneName: "shortOffset",
  }).formatToParts(getNow());
  return parts.find(p => p.type === "timeZoneName")?.value || "";
}

/* ────────────────────────────────────────────
   Rendering
   ──────────────────────────────────────────── */
const wrapper = document.getElementById("columnsWrapper");
const emptyState = document.getElementById("emptyState");

function renderColumns() {
  // Clear all columns but keep empty state
  wrapper.querySelectorAll(".tz-column").forEach(el => el.remove());

  const groups = groupLocations();
  emptyState.style.display = groups.length === 0 ? "flex" : "none";

  groups.forEach((group, idx) => {
    const col = document.createElement("div");
    col.className = "tz-column";
    col.dataset.tz = group.tz;
    col.dataset.idx = idx;

    col.style.background = timeOfDayGradient(group.tz);
    col.style.color = textColorForBg(group.tz);

    // Stacked time (hours over minutes)
    const tp = formatTimeParts(group.tz);
    const ampmHTML = tp.ampm ? `<span class="ampm">${tp.ampm}</span>` : "";

    // City names: FIO-style (City, ST, Country) or (City, Country)
    const citiesHTML = group.cities.map(c =>
      `<div class="col-city-name">${formatCityDisplay(c)}</div>`
    ).join("");

    col.innerHTML = `
      <div class="col-time">
        <span class="col-hours">${tp.hours}</span>
        <span class="col-minutes">${tp.minutes}${ampmHTML}</span>
      </div>
      <div class="col-date">${formatDate(group.tz)}</div>
      <hr class="col-divider">
      <div class="col-cities">${citiesHTML}</div>
      <button class="remove-col-btn" data-idx="${idx}" title="Remove this column">&times;</button>
    `;

    wrapper.appendChild(col);
  });
}

function updateColumns() {
  const groups = groupLocations();
  const cols = wrapper.querySelectorAll(".tz-column");

  cols.forEach((col, idx) => {
    const group = groups[idx];
    if (!group) return;

    col.style.background = timeOfDayGradient(group.tz);
    col.style.color = textColorForBg(group.tz);

    const tp = formatTimeParts(group.tz);
    const ampmHTML = tp.ampm ? `<span class="ampm">${tp.ampm}</span>` : "";
    col.querySelector(".col-time").innerHTML =
      `<span class="col-hours">${tp.hours}</span>` +
      `<span class="col-minutes">${tp.minutes}${ampmHTML}</span>`;

    col.querySelector(".col-date").textContent = formatDate(group.tz);
  });
}

/* ────────────────────────────────────────────
   Events
   ──────────────────────────────────────────── */

// Remove column → removes all cities in that group
wrapper.addEventListener("click", (e) => {
  const btn = e.target.closest(".remove-col-btn");
  if (!btn) return;

  const idx = parseInt(btn.dataset.idx, 10);
  const groups = groupLocations();
  const group = groups[idx];
  if (!group) return;

  // Remove all cities that belong to this group's offset
  const offsetToRemove = group.offset;
  savedLocations = savedLocations.filter(loc => getOffsetMinutes(loc.tz) !== offsetToRemove);
  saveState();
  renderColumns();
});

// 12h / 24h segmented toggle
const btn12h = document.getElementById("btn12h");
const btn24h = document.getElementById("btn24h");

function updateToggleLabel() {
  btn12h.classList.toggle("active", !use24h);
  btn24h.classList.toggle("active", use24h);
}

btn12h.addEventListener("click", () => {
  if (use24h) { use24h = false; saveState(); updateToggleLabel(); renderColumns(); }
});

btn24h.addEventListener("click", () => {
  if (!use24h) { use24h = true; saveState(); updateToggleLabel(); renderColumns(); }
});

// Add panel
const addOverlay = document.getElementById("addOverlay");
const addBtn = document.getElementById("addBtn");
const closePanelBtn = document.getElementById("closePanelBtn");
const searchInput = document.getElementById("searchInput");
const suggestionsEl = document.getElementById("suggestions");

addBtn.addEventListener("click", () => {
  // Check max 10 timezone groups
  if (groupLocations().length >= 10) {
    alert("Maximum of 10 timezone columns reached!");
    return;
  }
  addOverlay.classList.add("visible");
  setTimeout(() => searchInput.focus(), 100);
});

function closePanel() {
  addOverlay.classList.remove("visible");
  searchInput.value = "";
  suggestionsEl.innerHTML = "";
  clearTimeout(searchTimer);
  lastQuery = "";
}

closePanelBtn.addEventListener("click", closePanel);

addOverlay.addEventListener("click", (e) => {
  if (e.target === addOverlay) closePanel();
});

// Search – local first, then geocoding API fallback
let searchTimer = null;
let lastQuery = "";

function addCity(city) {
  // Check column count
  const testLocations = [...savedLocations, city];
  const testGroups = new Set();
  testLocations.forEach(loc => testGroups.add(getOffsetMinutes(loc.tz)));
  if (testGroups.size > 10) {
    alert("Maximum of 10 timezone columns reached!");
    return;
  }
  // Check max 3 cities per group
  const offset = getOffsetMinutes(city.tz);
  const existingInGroup = savedLocations.filter(l => getOffsetMinutes(l.tz) === offset);
  if (existingInGroup.length >= 3) {
    alert("Maximum of 3 locations per timezone column!");
    return;
  }
  savedLocations.push({ name: city.name, tz: city.tz, country: city.country, admin1: city.admin1 || "" });
  saveState();
  renderColumns();
  closePanel();
}

function renderSuggestions(matches) {
  if (matches.length === 0) {
    suggestionsEl.innerHTML = `<div style="padding: 10px 14px; font-size: 13px; color: rgba(255,255,255,0.3);">No results</div>`;
    return;
  }
  suggestionsEl.innerHTML = matches.map((c, i) =>
    `<div class="suggestion-item" data-i="${i}">
      <span>${formatCityDisplay(c)}</span>
      <span class="tz-label">${c.tz.replace(/_/g, " ")}</span>
    </div>`
  ).join("");

  suggestionsEl.querySelectorAll(".suggestion-item").forEach((el, i) => {
    el.addEventListener("click", () => addCity(matches[i]));
  });
}

function showLoading(localMatches) {
  const localHTML = localMatches.map((c, i) =>
    `<div class="suggestion-item" data-i="${i}">
      <span>${formatCityDisplay(c)}</span>
      <span class="tz-label">${c.tz.replace(/_/g, " ")}</span>
    </div>`
  ).join("");
  const loadingHTML = `<div style="padding: 10px 14px; font-size: 12px; color: rgba(255,255,255,0.3); letter-spacing: 0.5px;">Searching worldwide...</div>`;
  suggestionsEl.innerHTML = localHTML + loadingHTML;

  suggestionsEl.querySelectorAll(".suggestion-item").forEach((el, i) => {
    el.addEventListener("click", () => addCity(localMatches[i]));
  });
}

async function searchGeoAPI(q) {
  try {
    const resp = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=30&language=en`);
    if (!resp.ok) return [];
    const data = await resp.json();
    if (!data.results) return [];

    // Tiered filter: capitals & admin1 seats always pass; smaller codes need bigger population
    const filtered = data.results
      .filter(r => {
        if (!r.timezone || !r.feature_code || !r.feature_code.startsWith("PPL")) return false;
        const pop = r.population || 0;
        const fc = r.feature_code;
        if (fc === "PPLC") return true;              // national capitals: always
        if (fc === "PPLA") return pop >= 5000;        // admin1 seats (prefecture/state capitals)
        if (fc === "PPLA2") return pop >= 50000;      // admin2 seats: need 50k
        return pop >= 100000;                         // everything else: need 100k
      })
      .sort((a, b) => (b.population || 0) - (a.population || 0));

    // Deduplicate by name + country (keep highest population)
    const seen = new Set();
    const deduped = [];
    for (const r of filtered) {
      const key = `${r.name}|${r.country_code}`;
      if (seen.has(key)) continue;
      seen.add(key);
      deduped.push({
        name: r.name,
        tz: r.timezone,
        country: r.country_code || "",
        admin1: abbreviateAdmin1(r.admin1, r.country_code),
      });
    }
    return deduped;
  } catch(e) {
    return [];
  }
}

searchInput.addEventListener("input", () => {
  const q = searchInput.value.trim().toLowerCase();
  lastQuery = q;
  clearTimeout(searchTimer);

  if (q.length < 1) {
    suggestionsEl.innerHTML = "";
    return;
  }

  const alreadyAdded = new Set(savedLocations.map(l => l.name));
  const localMatches = CITIES.filter(c =>
    (c.name.toLowerCase().includes(q) || c.country.toLowerCase().includes(q) || countryFullName(c.country).toLowerCase().includes(q)) &&
    !alreadyAdded.has(c.name)
  ).slice(0, 8);

  // Show local results immediately
  if (localMatches.length >= 4) {
    renderSuggestions(localMatches);
    return;
  }

  // Show local results + loading, then fetch API
  if (localMatches.length > 0) {
    showLoading(localMatches);
  } else {
    suggestionsEl.innerHTML = `<div style="padding: 10px 14px; font-size: 12px; color: rgba(255,255,255,0.3); letter-spacing: 0.5px;">Searching worldwide...</div>`;
  }

  searchTimer = setTimeout(async () => {
    if (q.length < 2) return;
    const apiResults = await searchGeoAPI(q);
    // Only update if query hasn't changed
    if (lastQuery !== q) return;

    // Deduplicate: skip API results already in local matches or already added
    const localNames = new Set(localMatches.map(c => c.name.toLowerCase()));
    const apiFiltered = apiResults
      .filter(r => !localNames.has(r.name.toLowerCase()) && !alreadyAdded.has(r.name))
      .slice(0, 8 - localMatches.length);

    const combined = [...localMatches, ...apiFiltered];
    renderSuggestions(combined);
  }, 300);
});

// Keyboard navigation
searchInput.addEventListener("keydown", (e) => {
  const items = suggestionsEl.querySelectorAll(".suggestion-item");
  if (!items.length && e.key !== "Escape") return;

  if (e.key === "Escape") {
    closePanel();
    return;
  }

  const current = suggestionsEl.querySelector(".suggestion-item.focused");
  let idx = Array.from(items).indexOf(current);

  if (e.key === "ArrowDown") {
    e.preventDefault();
    items.forEach(i => i.classList.remove("focused"));
    idx = (idx + 1) % items.length;
    items[idx].classList.add("focused");
    items[idx].scrollIntoView({ block: "nearest" });
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    items.forEach(i => i.classList.remove("focused"));
    idx = idx <= 0 ? items.length - 1 : idx - 1;
    items[idx].classList.add("focused");
    items[idx].scrollIntoView({ block: "nearest" });
  } else if (e.key === "Enter") {
    e.preventDefault();
    const focused = suggestionsEl.querySelector(".suggestion-item.focused");
    if (focused) focused.click();
    else if (items.length) items[0].click();
  }
});

// ESC to close overlay
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && addOverlay.classList.contains("visible")) {
    closePanel();
  }
});

/* ────────────────────────────────────────────
   Time-travel (scroll)
   ──────────────────────────────────────────── */
const timeTravelBar = document.getElementById("timeTravelBar");
const ttOffsetEl = document.getElementById("ttOffset");
const ttReset = document.getElementById("ttReset");
let scrollAccum = 0;
let resetTimer = null;

function updateTimeTravelUI() {
  if (timeOffsetHours === 0) {
    timeTravelBar.classList.remove("visible");
    return;
  }
  timeTravelBar.classList.add("visible");
  const sign = timeOffsetHours > 0 ? "+" : "";
  const abs = Math.abs(timeOffsetHours);
  if (abs < 24) {
    ttOffsetEl.textContent = `${sign}${timeOffsetHours}h`;
  } else {
    const days = Math.floor(abs / 24);
    const hrs = abs % 24;
    ttOffsetEl.textContent = `${sign}${days}d ${hrs}h`;
  }
}

wrapper.addEventListener("wheel", (e) => {
  // Don't time-travel when modal is open
  if (addOverlay.classList.contains("visible")) return;
  e.preventDefault();

  // Accumulate small scroll deltas, snap at threshold
  scrollAccum += e.deltaY;
  const threshold = 50;

  if (Math.abs(scrollAccum) >= threshold) {
    const direction = scrollAccum > 0 ? -1 : 1; // scroll down = past, scroll up = future
    timeOffsetHours += direction;
    // Clamp to +/- 7 days
    timeOffsetHours = Math.max(-168, Math.min(168, timeOffsetHours));
    scrollAccum = 0;

    updateTimeTravelUI();
    updateColumns();

    // Auto-reset after 5s of no scrolling
    clearTimeout(resetTimer);
    resetTimer = setTimeout(resetTimeTravel, 5000);
  }
}, { passive: false });

function resetTimeTravel() {
  timeOffsetHours = 0;
  scrollAccum = 0;
  clearTimeout(resetTimer);
  updateTimeTravelUI();
  updateColumns();
}

ttReset.addEventListener("click", resetTimeTravel);

// Double-click anywhere to reset
wrapper.addEventListener("dblclick", resetTimeTravel);

/* ────────────────────────────────────────────
   Init
   ──────────────────────────────────────────── */
loadState(() => {
  updateToggleLabel();
  renderColumns();
  setInterval(updateColumns, 1000);
});
