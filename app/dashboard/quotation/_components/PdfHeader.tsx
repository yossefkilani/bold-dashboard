export default function PdfHeader() {
  return (
    <div
      className="flex justify-between items-start mb-[42mm]"
      style={{
        pageBreakInside: "avoid",
        breakInside: "avoid",
      }}
    >
      {/* Company block */}
      <div
        style={{
          maxWidth: "180px",
          width: "100%",
          height: "auto",
          textAlign: "left",
        }}
      >
        <div
          className="ar font-bold"
          style={{
            width: "100%",
            height: "auto",
            whiteSpace: "nowrap",
            direction: "rtl",
            marginBottom: "6px",
          }}
        >
          شركة بولد للدعاية والتسويق
        </div>

        <div
          className="en"
          style={{
            width: "100%",
            height: "auto",
            whiteSpace: "nowrap",
            fontWeight: 500,
          }}
        >
          Bold Advertising and Marketing
        </div>
      </div>

      {/* Logo */}
      <img
        src="/bold.svg"
        alt="BOLD Logo"
        style={{
          width: "42px",
          height: "auto",
        }}
      />
    </div>
  );
}