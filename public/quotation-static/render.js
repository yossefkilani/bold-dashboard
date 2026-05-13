/* ── Read data from sessionStorage (preferred) or URL params (fallback) ── */

let client, project, rawDate, total, currency, terms, showBank, phases;

const stored = sessionStorage.getItem("bold_quotation");
if (stored) {
  try {
    const d = JSON.parse(stored);
    client   = d.client   || "";
    project  = d.project  || "";
    rawDate  = d.date     || "";
    total    = d.total    || "";
    currency = d.currency || "";
    terms    = d.terms    || "";
    showBank = d.bank === "1" || d.bank === true;
    phases   = Array.isArray(d.phases) ? d.phases : [];
  } catch { phases = []; }
} else {
  // fallback: URL params
  const params = new URLSearchParams(window.location.search);
  client   = params.get("client")   || "";
  project  = params.get("project")  || "";
  rawDate  = params.get("date")     || "";
  total    = params.get("total")    || "";
  currency = params.get("currency") || "";
  terms    = params.get("terms")    || "";
  showBank = params.get("bank") === "1";
  try { phases = JSON.parse(params.get("phases") || "[]"); } catch { phases = []; }
}

const ROWS_PER_PAGE = 3;
const root = document.getElementById("pdf-root");

/* ── Helpers ── */

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function generateQuotationId(dateStr) {
  const year = dateStr ? new Date(dateStr).getFullYear() : new Date().getFullYear();
  let counter = localStorage.getItem("quotation-counter");
  counter = counter ? Number(counter) + 1 : 1;
  localStorage.setItem("quotation-counter", counter);
  return `Q-${year}-${String(counter).padStart(3, "0")}`;
}

function chunk(array, size) {
  const pages = [];
  for (let i = 0; i < array.length; i += size) pages.push(array.slice(i, i + size));
  return pages;
}

/* ── Build pages ── */

const pages = chunk(phases, ROWS_PER_PAGE);
const quotationId = generateQuotationId(rawDate);

function createPage(pagePhases, pageIndex, isLast) {
  const page = document.createElement("div");
  page.className = "a4-page";

  const content = document.createElement("div");
  content.className = "a4-content";

  content.innerHTML = `
    <header class="header">
      <div>
        <div class="ar">شـركــــة بولـــــد للدعايـــــة والتسويــــق</div>
        <div class="en">Bold Advertising and Marketing</div>
      </div>
      <div class="logo"><img src="/quotation-static/bold.svg" /></div>
    </header>

    ${pageIndex === 0 ? `
      <section class="title">
        <h1 class="quotation-title">QUOTATION</h1>
        <div class="meta-row">
          <div class="meta-left">
            <div><strong>Client:</strong> ${client}</div>
            <div><strong>Project:</strong> ${project}</div>
            <div><strong>Date:</strong> ${formatDate(rawDate)}</div>
          </div>
          <div class="meta-right">
            <div><strong>ID:</strong> ${quotationId}</div>
          </div>
        </div>
      </section>
    ` : `<section class="title"></section>`}

    <section class="table">
      <div class="table-header">
        <div>Scope</div>
        <div>Description</div>
        <div>Timeline</div>
      </div>
    </section>

    <div class="safe-area"></div>
  `;

  const table = content.querySelector(".table");

  pagePhases.forEach((p) => {
    const row = document.createElement("div");
    row.className = "table-row";
    const days = Number(p.timeline);

    // Build numbered list from desc lines
    const lines = (p.desc || "").split("\n").map(l => l.trim()).filter(Boolean);
    const listItems = lines.map((line, idx) => {
      // Strip existing leading number prefix (e.g. "1-", "1.", "1)")
      const clean = line.replace(/^[\d]+\s*[-.)]\s*/, "");
      return `<li><span style="margin-right:5px;font-weight:600">${idx + 1}.</span>${clean}</li>`;
    }).join("");

    row.innerHTML = `
      <div class="phase-scope">${p.title || ""}</div>
      <div><ul class="desc-list">${listItems}</ul></div>
      <div style="text-align:right">${days > 0 ? `${days} ${days === 1 ? "Day" : "Days"}` : ""}</div>
    `;
    table.appendChild(row);
  });

  if (isLast) {
    const totalEl = document.createElement("section");
    totalEl.className = "total";
    totalEl.innerHTML = `
      <div>Total Cost</div>
      <div style="text-align:right">${total} ${currency}</div>
    `;

    const isArabic = /[؀-ۿ]/.test(terms);
    const termLines = terms.split("\n").map(l => l.trim()).filter(Boolean);

    const footer = document.createElement("footer");
    footer.className = isArabic ? "footer-ar" : "footer";

    if (isArabic) {
      const items = termLines.map(l => `<li>${l.replace(/^[\d]+\s*[-.)]\s*/, "")}</li>`).join("");
      footer.innerHTML = `
        <span class="footer-title">الشروط والأحكام:</span>
        <ul class="terms-list">${items}</ul>
      `;
    } else {
      const items = termLines.map(l => `<li>${l.replace(/^[\d]+\s*[-.)]\s*/, "")}</li>`).join("");
      footer.innerHTML = `
        <span class="footer-title">PAYMENT TERMS</span>
        <ol class="terms-list-en">${items}</ol>
      `;
    }

    content.insertBefore(totalEl, content.querySelector(".safe-area"));
    content.insertBefore(footer, content.querySelector(".safe-area"));
  }

  page.appendChild(content);
  return page;
}

pages.forEach((pagePhases, i) => {
  root.appendChild(createPage(pagePhases, i, i === pages.length - 1));
});

/* ── Bank page ── */

if (showBank) {
  const bankPage = document.createElement("div");
  bankPage.className = "a4-page";
  bankPage.innerHTML = `
    <div class="a4-content">
      <header class="header">
        <div>
          <div class="ar">شـركــــة بولـــــد للدعايـــــة والتسويــــق</div>
          <div class="en">Bold Advertising and Marketing</div>
        </div>
        <div class="logo"><img src="/quotation-static/bold.svg" /></div>
      </header>
      <h2 class="bank-title">Bank Information</h2>
      <div class="bank-divider"></div>
      <div class="bank-details">
        <div class="bank-item">
          <span class="label">Bank</span>
          <span class="value">National Bank of Kuwait (NBK)</span>
        </div>
        <div class="bank-item">
          <span class="label">Official Company Name</span>
          <span class="value">BOLD FOR ADVERTISING AND MARKETING CO</span>
        </div>
        <div class="bank-item">
          <span class="label">Account Number</span>
          <span class="value">2025653527</span>
        </div>
        <div class="bank-item">
          <span class="label">IBAN</span>
          <span class="value">KW25NBOK0000000000002025653527</span>
        </div>
        <div class="bank-item">
          <span class="label">Swift Code</span>
          <span class="value">NBOKKWKW</span>
        </div>
      </div>
    </div>
  `;
  root.appendChild(bankPage);
}
