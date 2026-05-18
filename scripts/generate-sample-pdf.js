/**
 * Generates a travel package PDF in plain-text format
 * that pdf-parse + Gemini can reliably extract.
 *
 * Run:  node scripts/generate-sample-pdf.js
 * Output: public/sample-package.pdf
 */

const PDFDocument = require("pdfkit");
const fs   = require("fs");
const path = require("path");

// ─── Colours ─────────────────────────────────────────────────────────────────
const RED   = "#BF1A1A";
const DARK  = "#1a1a2e";
const MUTED = "#5f5f5f";
const WHITE = "#ffffff";

// ─── Package Data ─────────────────────────────────────────────────────────────
const pkg = {
  title:    "B2B Leh Ladakh Package - 5 Nights / 6 Days",
  subtitle: "Rates: April to October",
  company:  "World Tour Trip | worldtourtrip.com | info@worldtourtrip.com | +91 12345 67890",

  hotelOptions: [
    {
      optionName:   "Option 1",
      starCategory: "2 Star Deluxe",
      hotels: [
        { location: "Leh",     nights: 3, name: "SHANTI HOME / Nima's Villa / Hotel Shaolin Ladakh / Similar" },
        { location: "Nubra",   nights: 1, name: "Guest House / Camp / Similar" },
        { location: "Pangong", nights: 1, name: "Guest House / Cottage / Similar" },
      ],
      prices: [
        { pax: 12, price: 9999  },
        { pax: 10, price: 10799 },
        { pax:  8, price: 11699 },
        { pax:  6, price: 11299 },
        { pax:  4, price: 13499 },
        { pax:  2, price: 19999 },
      ],
      extraBed: 5999, childNoBed: 3999,
    },
    {
      optionName:   "Option 2",
      starCategory: "3 Star",
      hotels: [
        { location: "Leh",     nights: 3, name: "Hotel Sindhu Residency / Hotel Holiday Ladakh / Welkin High / The Nangsay Hotel / Similar" },
        { location: "Nubra",   nights: 1, name: "The Latsas / Ldazes Camp / Hotel Thachung / Ladakh Heaven Hills / Paradise North / Similar" },
        { location: "Pangong", nights: 1, name: "Mystic Mountain Cottage / The Golden Cottage / LakeTso House Pangong / Similar" },
      ],
      prices: [
        { pax: 12, price: 11399 },
        { pax: 10, price: 11999 },
        { pax:  8, price: 12999 },
        { pax:  6, price: 12499 },
        { pax:  4, price: 14699 },
        { pax:  2, price: 21199 },
      ],
      extraBed: 6999, childNoBed: 4599,
    },
    {
      optionName:   "Option 3",
      starCategory: "3 Star Deluxe",
      hotels: [
        { location: "Leh",     nights: 3, name: "Crown Himalaya / Hotel Trikaya Ladakh / Karma Residency / The Maitreya Ladakh / Similar" },
        { location: "Nubra",   nights: 1, name: "Organic Boutique / Paradise Retreat Resort / Olthang / Highland Desert / Hotel Onpo / Similar" },
        { location: "Pangong", nights: 1, name: "Aspire Ladakh Cottage / The Horizon / Skylake Cottages / Ripple Cottage / Similar" },
      ],
      prices: [
        { pax: 12, price: 13599 },
        { pax: 10, price: 14199 },
        { pax:  8, price: 15199 },
        { pax:  6, price: 14699 },
        { pax:  4, price: 16899 },
        { pax:  2, price: 23399 },
      ],
      extraBed: 8999, childNoBed: 5499,
    },
    {
      optionName:   "Option 4",
      starCategory: "3 Star Premium",
      hotels: [
        { location: "Leh",     nights: 3, name: "Hotel Mountain Vibes / The Highland Ladakh / CHARMWOOD HOTEL / Similar" },
        { location: "Nubra",   nights: 1, name: "Pebbles Swiss Tent Resort / Himalayan Eco Resort / Similar" },
        { location: "Pangong", nights: 1, name: "Polaris Cottage / Falcon's Cottages / Similar" },
      ],
      prices: [
        { pax: 12, price: 17499 },
        { pax: 10, price: 18099 },
        { pax:  8, price: 19099 },
        { pax:  6, price: 18599 },
        { pax:  4, price: 20699 },
        { pax:  2, price: 27199 },
      ],
      extraBed: 11999, childNoBed: 7499,
    },
    {
      optionName:   "Option 5",
      starCategory: "4 Star",
      hotels: [
        { location: "Leh",     nights: 3, name: "Grand Himalaya / Hotel Gyalpo Residency / Padma Ladakh / The Gawaling Ladakh / Similar" },
        { location: "Nubra",   nights: 1, name: "The Unalome Resort / Hotel Kaldan Palace / Hotel Karma Inn / Similar" },
        { location: "Pangong", nights: 1, name: "Grand Retreat Pangong / Mystic Pangong Spangmik / DE REEVA PANGONG / Pangong Nest" },
      ],
      prices: [
        { pax: 12, price: 21199 },
        { pax: 10, price: 21899 },
        { pax:  8, price: 22899 },
        { pax:  6, price: 22399 },
        { pax:  4, price: 24599 },
        { pax:  2, price: 30999 },
      ],
      extraBed: 14999, childNoBed: 8999,
    },
  ],

  inclusions: [
    "Leh Airport Pickup and Drop.",
    "Welcome Drink on Arrival.",
    "3 Nights Accommodation in Leh on double occupancy.",
    "1 Night Accommodation in Nubra on double occupancy.",
    "1 Night Accommodation in Pangong on double occupancy.",
    "5 Daily Breakfast and Dinner (Buffet).",
    "Inner Line Permit.",
    "Non-AC Innova / Scorpio / Xylo / Aria / Tempo Traveller as per the itinerary.",
  ],

  exclusions: [
    "Airfare / train fares etc.",
    "5% GST Extra.",
    "Oxygen cylinder.",
    "Entrance Fees for visiting Monuments, Monasteries and Museums.",
    "Guide Fee, Camera Fee, if any.",
    "Rafting / Camel Safari Charges, if any.",
    "Any kind of drinks (Alcoholic, Mineral, Aerated).",
    "Any expense of personal nature such as tips, laundry, telephone calls, fax etc.",
    "Costs incidental to any change in the itinerary.",
    "Any expense incurred due to bad weather, natural calamities, flight delays or cancellations.",
    "Anything not specifically mentioned under Package Cost Inclusions.",
    "Any expenses incurred on extra transport service.",
    "Room service and additional meals, if any.",
    "Medical and Travel insurance.",
  ],

  itinerary: [
    {
      day: 1,
      title: "Arrival in Leh",
      description: "After arrival at Leh Airport, you would be transferred to hotel for check-in. Today you are free for leisure and acclimatization. Evening visit to Leh Market, Leh Palace and Shanti Stupa. Overnight at the Hotel.",
      activities: ["Airport pickup and hotel check-in", "Leh Market visit", "Leh Palace sightseeing", "Shanti Stupa visit"],
    },
    {
      day: 2,
      title: "Leh Local Sightseeing",
      description: "Today after breakfast leave for half day excursion to Hall of Fame, Gurudwara Pathar Sahib, Magnetic Hill, Spituk Monastery and Sangam View where Indus and Zanskar River meet. Afternoon you would be driven back to hotel. Night stay at hotel in Leh.",
      activities: ["Hall of Fame", "Gurudwara Pathar Sahib", "Magnetic Hill", "Spituk Monastery", "Sangam Point"],
    },
    {
      day: 3,
      title: "Leh - Khardung La Top - Nubra Valley",
      description: "Today after an early breakfast you would be driven to Nubra Valley. En route visit Khardung-La Pass, the highest motorable road in the world at 18,380 ft. Nubra Valley is popularly known as Ldorma or the valley of flowers. Arrive at Hunder and check in at Hotel/Camps. Later visit Diskit Village and enjoy the Camel ride on sand dunes. Dinner and overnight stay at Hotel/Camp.",
      activities: ["Khardung La Pass visit (18,380 ft)", "Drive to Nubra Valley", "Hotel check-in at Hunder", "Diskit Village visit", "Camel ride on sand dunes"],
    },
    {
      day: 4,
      title: "Nubra Valley - Pangong Lake",
      description: "Today after breakfast, we shall drive to Pangong Lake via Shyok, Durbuk and Tangste villages. Pangong Lake is in the east of Leh in the Changthang region of Ladakh and perhaps one of the most amazing lakes in Asia which changes its colour 4-5 times a day. At evening enjoy the breathtaking view of Pangong Lake. Overnight at the Camp at Pangong Lake.",
      activities: ["Drive via Shyok, Durbuk and Tangste", "Pangong Lake visit", "Lake sunset views", "Overnight at camp by Pangong Lake"],
    },
    {
      day: 5,
      title: "Pangong Lake - Leh",
      description: "Today after breakfast, check out from the Camp and drive to Leh via Changla Pass (17,500 ft). On the way visit Rancho School, Sindhu Ghat, Shey and Thiksey monasteries. Evening free for leisure and own activities. Overnight at the Hotel.",
      activities: ["Changla Pass (17,500 ft)", "Rancho School", "Sindhu Ghat", "Shey Palace", "Thiksey Monastery"],
    },
    {
      day: 6,
      title: "Departure from Leh",
      description: "After Breakfast, check out from the Hotel and you would be transferred to Leh Airport. Your memorable tour to beautiful Ladakh concludes here.",
      activities: ["Breakfast and hotel check-out", "Transfer to Leh Airport", "Tour concludes"],
    },
  ],
};

// ─── PDF setup ────────────────────────────────────────────────────────────────
const doc = new PDFDocument({ margin: 50, size: "A4", compress: true });
const out = path.join(__dirname, "../public/sample-package.pdf");
doc.pipe(fs.createWriteStream(out));

const W    = doc.page.width;   // 595
const BODY = W - 100;          // usable width between left=50 and right=50
let y = 50;

// ── helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n).toLocaleString("en-IN");

function nl(lines = 1) { y += 14 * lines; }

function checkPage(needed = 60) {
  if (y + needed > doc.page.height - 50) {
    doc.addPage();
    y = 50;
  }
}

// Write a single line of plain text and advance cursor
function line(text, opts = {}) {
  const {
    font    = "Helvetica",
    size    = 10,
    color   = DARK,
    indent  = 0,
    gap     = 2,     // extra gap after line
    width   = BODY - indent,
  } = opts;

  const h = doc.heightOfString(text, { font, fontSize: size, width }) + gap;
  checkPage(h);

  doc.font(font).fontSize(size).fillColor(color)
     .text(text, 50 + indent, y, { width, lineGap: 2 });

  y += h;
}

// Section heading band (coloured rectangle + white bold text)
function sectionHead(text, color = DARK) {
  checkPage(36);
  doc.rect(50, y, BODY, 26).fill(color);
  doc.font("Helvetica-Bold").fontSize(11).fillColor(WHITE)
     .text(text, 58, y + 7, { width: BODY - 16 });
  y += 34;
}

// Horizontal rule
function rule() {
  checkPage(12);
  doc.moveTo(50, y).lineTo(W - 50, y).lineWidth(0.5).stroke("#e0e0e0");
  y += 8;
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
doc.rect(0, 0, W, 80).fill(DARK);
doc.font("Helvetica-Bold").fontSize(18).fillColor(WHITE)
   .text("World Tour Trip", 50, 16, { align: "center", width: BODY });
doc.font("Helvetica").fontSize(8.5).fillColor("#aaaaaa")
   .text(pkg.company, 50, 42, { align: "center", width: BODY });
y = 98;

// ─── TITLE BOX ────────────────────────────────────────────────────────────────
doc.rect(50, y, BODY, 48).fill(RED);
doc.font("Helvetica-Bold").fontSize(14).fillColor(WHITE)
   .text(pkg.title, 60, y + 8, { align: "center", width: BODY - 20 });
doc.font("Helvetica").fontSize(10).fillColor(WHITE)
   .text(pkg.subtitle, 60, y + 30, { align: "center", width: BODY - 20 });
y += 60;

// ─── HOTEL OPTIONS ────────────────────────────────────────────────────────────
for (const opt of pkg.hotelOptions) {
  checkPage(180);

  // Option heading — bold coloured line (plain text, no table)
  sectionHead(`${opt.optionName} - Hotel Details (${opt.starCategory})`, RED);

  // Hotels — each on its own clearly labelled line
  for (const h of opt.hotels) {
    line(`Location: ${h.location} - ${h.nights} Night${h.nights > 1 ? "s" : ""}`,
         { font: "Helvetica-Bold", size: 9.5, indent: 8 });
    line(`Hotel: ${h.name}`,
         { font: "Helvetica", size: 9, color: MUTED, indent: 16, gap: 6 });
  }

  nl(0.5);

  // Prices — each price on its own separate line
  line("Pricing (Per Person):", { font: "Helvetica-Bold", size: 9.5, indent: 8 });
  for (const p of opt.prices) {
    line(`@ ${fmt(p.price)}/- Per Person (${p.pax} Pax Travelling Together)`,
         { size: 9.5, indent: 16 });
  }

  nl(0.5);
  line(`Extra Bed: Rs.${fmt(opt.extraBed)}/-`,
       { size: 9, color: MUTED, indent: 16 });
  line(`Child without Bed: Rs.${fmt(opt.childNoBed)}/-`,
       { size: 9, color: MUTED, indent: 16 });

  nl(1);
  rule();
}

// ─── PACKAGE INCLUSIONS ───────────────────────────────────────────────────────
sectionHead("Package Inclusions", DARK);
for (const item of pkg.inclusions) {
  line(`[+] ${item}`, { size: 9.5, indent: 8 });
}
nl(0.5);

// ─── PACKAGE COST EXCLUSIONS ──────────────────────────────────────────────────
sectionHead("Package Cost Exclusions", DARK);
for (const item of pkg.exclusions) {
  line(`[-] ${item}`, { size: 9.5, indent: 8 });
}
nl(0.5);

// ─── TOUR ITINERARY OVERVIEW ──────────────────────────────────────────────────
sectionHead("Tour Itinerary Overview", DARK);
for (const d of pkg.itinerary) {
  line(`Day 0${d.day}: ${d.title}`, { font: "Helvetica-Bold", size: 9.5, indent: 8 });
}
nl(0.5);

// ─── DAY-WISE TOUR ITINERARY (DETAILED) ───────────────────────────────────────
sectionHead("Day-Wise Tour Itinerary (Detailed)", DARK);

for (const d of pkg.itinerary) {
  checkPage(100);

  // Day heading
  line(`Day 0${d.day}: ${d.title}`,
       { font: "Helvetica-Bold", size: 11, color: RED });

  // Full description paragraph
  line(d.description,
       { font: "Helvetica", size: 9.5, color: MUTED, indent: 8 });

  // Activities list
  line("Activities:", { font: "Helvetica-Bold", size: 9, indent: 8 });
  for (const act of d.activities) {
    line(`- ${act}`, { size: 9, indent: 20, color: MUTED });
  }

  nl(1);
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
checkPage(28);
doc.moveTo(50, y).lineTo(W - 50, y).lineWidth(0.5).stroke("#e0e0e0");
y += 8;
doc.font("Helvetica").fontSize(8).fillColor(MUTED)
   .text("World Tour Trip  |  info@worldtourtrip.com  |  +91 12345 67890  |  worldtourtrip.com",
         50, y, { align: "center", width: BODY });

doc.end();
console.log(`\n✅  PDF generated -> ${out}\n`);
