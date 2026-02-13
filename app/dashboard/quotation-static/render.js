const params = new URLSearchParams(window.location.search);

const client   = params.get("client") || "";
const project  = params.get("project") || "";
const rawDate  = params.get("date") || "";
const total    = params.get("total") || "";
const currency = params.get("currency") || "";
const terms    = params.get("terms") || "";
const showBank = params.get("bank") === "1";

const ROWS_PER_PAGE = 3;
const root = document.getElementById("pdf-root");

/* ======================
   HELPERS
====================== */

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function generateQuotationId(dateStr) {
  const year = dateStr
    ? new Date(dateStr).getFullYear()
    : new Date().getFullYear();

  let counter = localStorage.getItem("quotation-counter");
  counter = counter ? Number(counter) + 1 : 1;
  localStorage.setItem("quotation-counter", counter);

  return `Q-${year}-${String(counter).padStart(3, "0")}`;
}

function chunk(array, size) {
  const pages = [];
  for (let i = 0; i < array.length; i += size) {
    pages.push(array.slice(i, i + size));
  }
  return pages;
}

/* ======================
   READ PHASES
====================== */

let phases = [];
try {
  phases = JSON.parse(params.get("phases") || "[]");
} catch {
  phases = [];
}

const pages = chunk(phases, ROWS_PER_PAGE);
const quotationId = generateQuotationId(rawDate);

/* ======================
   BUILD PAGE
====================== */

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
      <div class="logo">
        <img src="/bold.svg" />
      </div>
    </header>

    ${
      pageIndex === 0
        ? `
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
      `
        : `
      <section class="title">
        
      </section>
      `
    }

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

    row.innerHTML = `
      <div>${p.title || ""}</div>
      <div>${(p.desc || "").replace(/\n/g, "<br>")}</div>
      <div style="text-align:right">
        ${days > 0 ? `${days} ${days === 1 ? "Day" : "Days"}` : ""}
      </div>
    `;

    table.appendChild(row);
  });

  /* TOTAL + TERMS فقط في آخر صفحة */
  if (isLast) {
    const totalEl = document.createElement("section");
    totalEl.className = "total";
    totalEl.innerHTML = `
      <div>Total Cost</div>
      <div style="text-align:right">${total} ${currency}</div>
    `;

    const footer = document.createElement("footer");
    footer.className = "footer";
    footer.innerHTML = `
      <strong>PAYMENT TERMS</strong><br><br>
      ${terms.replace(/\n/g, "<br>")}
    `;

    content.insertBefore(totalEl, content.querySelector(".safe-area"));
    content.insertBefore(footer, content.querySelector(".safe-area"));
  }

  page.appendChild(content);
  return page;
}

/* ======================
   RENDER ALL
====================== */

pages.forEach((pagePhases, i) => {
  root.appendChild(
    createPage(pagePhases, i, i === pages.length - 1)
  );
});

/* ======================
   BANK PAGE
====================== */

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
        <div class="logo">
          <img src="/bold.svg" />
        </div>
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

/* ======================
   AUTO PRINT
====================== */

if (params.get("pdf") === "1") {
  window.onload = () => {
    setTimeout(() => window.print(), 300);
  };
}