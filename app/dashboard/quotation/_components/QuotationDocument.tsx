type Phase = {
  title: string;
  desc: string;
  timeline: string;
};

type Props = {
  client: string;
  project: string;
  date: string;
  total: string;
  currency: string;
  terms: string;
  phases: Phase[];
  showBank: boolean;
};

export default function QuotationDocument({
  client,
  project,
  date,
  total,
  currency,
  terms,
  phases,
  showBank,
}: Props) {
  return (
    <>
      {/* ===== PAGE 1 ===== */}
      <div
        className="pdf-root"
        style={{
          width: "210mm",
          minHeight: "297mm",
          padding: "17mm",
          fontFamily: "Arial, sans-serif",
          color: "#000",
          breakAfter: "page",
          pageBreakAfter: "always",
        }}
      >
        {/* HEADER */}
        <div style={{ marginBottom: "35mm" }}>
          <div style={{ fontWeight: "bold" }}>
            شركة بولد للدعاية والتسويق
          </div>
          <div>Bold Advertising and Marketing</div>
        </div>

        {/* TITLE */}
        <h1 style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
          QUOTATION
        </h1>

        <div style={{ fontSize: 12, marginBottom: 20 }}>
          <div>Client: {client}</div>
          <div>Project: {project}</div>
          <div>Date: {date}</div>
        </div>

        {/* TABLE */}
        <table
          width="100%"
          cellSpacing={0}
          style={{
            borderCollapse: "collapse",
            fontSize: 11,
          }}
        >
          <tbody>
            {phases.map((p, i) => {
              const days = Number(p.timeline || 0);
              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: "1px solid #ddd",
                    pageBreakInside: "avoid",
                    breakInside: "avoid",
                  }}
                >
                  <td width="25%" style={{ padding: "8px 4px" }}>
                    <strong>{p.title}</strong>
                  </td>

                  <td width="55%" style={{ padding: "8px 4px" }}>
                    {p.desc.split("\n").map((line, idx) => (
                      <div key={idx}>{line}</div>
                    ))}
                  </td>

                  <td
                    width="20%"
                    style={{
                      padding: "8px 4px",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.timeline &&
                      `${days} ${days === 1 ? "Day" : "Days"}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* TOTAL */}
        <div
          style={{
            marginTop: "35mm",
            borderTop: "1px solid #000",
            borderBottom: "1px solid #000",
            padding: "12px 0",
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "bold",
          }}
        >
          <div>Total Cost</div>
          <div>
            {total} {currency}
          </div>
        </div>

        {/* PAYMENT TERMS */}
        <div style={{ marginTop: "25mm", fontSize: 11 }}>
          <strong>PAYMENT TERMS</strong>
          <div style={{ marginTop: 8 }}>
            {terms.split("\n").map((line, i) => (
              <div key={i}>• {line}</div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== PAGE 2 : BANK ===== */}
      {showBank && (
        <div
          style={{
            width: "210mm",
            minHeight: "297mm",
            padding: "17mm",
            fontFamily: "Arial, sans-serif",
            color: "#000",
          }}
        >
          {/* HEADER */}
          <div style={{ marginBottom: "35mm" }}>
            <div style={{ fontWeight: "bold" }}>
              شركة بولد للدعاية والتسويق
            </div>
            <div>Bold Advertising and Marketing</div>
          </div>

          <h2 style={{ marginBottom: 20 }}>
            Bank Information
          </h2>

          <div>Bank: National Bank of Kuwait</div>
          <div>IBAN: KW25NBOK0000000000002025653527</div>
        </div>
      )}
    </>
  );
}