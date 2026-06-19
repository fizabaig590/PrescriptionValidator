import { useEffect, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const initialForm = {
  prescriptionText: "Paracetamol 500mg twice daily\nIbuprofen 400mg after meals",
  allergies: ""
};

function scoreTone(score) {
  if (score >= 85) return "strong";
  if (score >= 60) return "watch";
  return "risk";
}

function confidenceLabel(confidence) {
  if (confidence === undefined || confidence === null) return null;
  if (confidence >= 75) return "High confidence";
  if (confidence >= 55) return "Needs review";
  return "Poor image quality";
}

function formatDosage(medicine) {
  return medicine.minDosageValue !== null &&
    medicine.minDosageValue !== undefined &&
    medicine.maxDosageValue !== null &&
    medicine.maxDosageValue !== undefined &&
    medicine.dosageUnit
    ? `${medicine.minDosageValue}-${medicine.maxDosageValue}${medicine.dosageUnit}`
    : "Not configured";
}

function downloadReport(result) {
  if (!result) return;

  const warningList = result.warnings?.length
    ? result.warnings.map((warning) => `<li>${warning.severity ?? "info"}: ${warning.message}</li>`).join("")
    : "<li>No warnings detected.</li>";

  const medicineRows = result.medicines?.length
    ? result.medicines
        .map(
          (medicine) => `
            <tr>
              <td>${medicine.name}</td>
              <td>${medicine.genericName ?? "Not available"}</td>
              <td>${medicine.category ?? "General"}</td>
              <td>${medicine.dosage ?? "No dosage found"}</td>
              <td>${medicine.dosageRange ?? "Not configured"}</td>
            </tr>`
        )
        .join("")
    : `<tr><td colspan="5">No recognized medicines.</td></tr>`;

  const reportWindow = window.open("", "_blank", "width=900,height=700");
  if (!reportWindow) return;

  reportWindow.document.write(`
    <html>
      <head>
        <title>Prescription Safety Report</title>
        <style>
          body { font-family: Arial, sans-serif; color: #1f2937; padding: 32px; }
          h1 { color: #115e59; margin-bottom: 4px; }
          .score { display: inline-block; padding: 10px 14px; border-radius: 10px; background: #e6fffb; color: #115e59; font-weight: 700; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { border: 1px solid #d1d5db; padding: 8px; text-align: left; vertical-align: top; }
          th { background: #f3f4f6; }
          pre { white-space: pre-wrap; background: #f9fafb; border: 1px solid #d1d5db; padding: 12px; }
        </style>
      </head>
      <body>
        <h1>Prescription Safety Report</h1>
        <p class="score">Safety Score: ${result.safetyScore}/100</p>
        <h2>Summary</h2>
        <p>${result.summary}</p>
        <h2>Medicines</h2>
        <table>
          <thead>
            <tr><th>Name</th><th>Generic</th><th>Category</th><th>Found Dosage</th><th>Configured Range</th></tr>
          </thead>
          <tbody>${medicineRows}</tbody>
        </table>
        <h2>Warnings</h2>
        <ul>${warningList}</ul>
        <h2>Extracted Text</h2>
        <pre>${result.extractedText ?? ""}</pre>
      </body>
    </html>
  `);
  reportWindow.document.close();
  reportWindow.focus();
  reportWindow.print();
}

function App() {
  const [view, setView] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") ?? "light");

  const [form, setForm] = useState(initialForm);
  const [image, setImage] = useState(null);

  const [result, setResult] = useState(null);
  const [comboResult, setComboResult] = useState(null);
  const [error, setError] = useState("");

  const [catalog, setCatalog] = useState([]);
  const [catalogQuery, setCatalogQuery] = useState("");
  const [catalogCategory, setCatalogCategory] = useState("All");
  const [catalogAllergy, setCatalogAllergy] = useState("All");
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewingText, setReviewingText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [catalogLoading, setCatalogLoading] = useState(true);

  const categoryOptions = ["All", ...new Set(catalog.map((medicine) => medicine.category ?? "General"))].sort();
  const allergyOptions = [
    "All",
    ...new Set(catalog.flatMap((medicine) => medicine.allergyTags ?? []))
  ].sort();
  const interactionRuleCount = 209;
  const warningCount = result?.warnings?.length ?? 0;

  const filteredCatalog = catalog.filter((medicine) => {
    const query = catalogQuery.trim().toLowerCase();
    const matchesCategory = catalogCategory === "All" || (medicine.category ?? "General") === catalogCategory;
    const matchesAllergy =
      catalogAllergy === "All" || medicine.allergyTags?.includes(catalogAllergy);

    if (!matchesCategory || !matchesAllergy) return false;
    if (!query) return true;

    return (
      medicine.name.toLowerCase().includes(query) ||
      (medicine.genericName ?? "").toLowerCase().includes(query) ||
      (medicine.notes ?? "").toLowerCase().includes(query) ||
      (medicine.category ?? "").toLowerCase().includes(query)
    );
  });

  const loadHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/validate/history`);
      if (!response.ok) throw new Error("History request failed.");
      const data = await response.json();
      setHistory(data);
    } catch {
      setHistory([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadCatalog = async () => {
    setCatalogLoading(true);
    try {
      const response = await fetch(`${apiUrl}/api/medicines`);
      if (!response.ok) throw new Error("Medicine catalog request failed.");
      const data = await response.json();
      setCatalog(data);
    } catch {
      setCatalog([]);
    } finally {
      setCatalogLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    loadCatalog();
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
    localStorage.setItem("theme", theme);
  }, [theme]);

  const submitImage = async (event) => {
    event.preventDefault();
    setUploading(true);
    setError("");
    setResult(null);
    setComboResult(null);

    try {
      if (!image) throw new Error("Select an image before uploading.");

      const payload = new FormData();
      payload.append("prescriptionImage", image);

      const response = await fetch(`${apiUrl}/api/validate/image`, {
        method: "POST",
        body: payload
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Image upload failed.");

      setResult(data);
      setReviewText(data.extractedText ?? "");
      loadHistory();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setUploading(false);
    }
  };

  const submitReviewedText = async () => {
    const text = reviewText.trim();

    if (!text) {
      setError("Add extracted text before re-running validation.");
      return;
    }

    setReviewingText(true);
    setError("");

    try {
      const allergies = String(form.allergies ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);

      const response = await fetch(`${apiUrl}/api/validate/text`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prescriptionText: text,
          allergies
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Validation request failed.");

      setResult({
        ...data,
        sourceLabel: "Reviewed OCR text"
      });
      setReviewText(data.extractedText ?? text);
      loadHistory();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setReviewingText(false);
    }
  };

  const submitCombination = async () => {
    const m1 = String(form.comboMed1 ?? "").trim();
    const m2 = String(form.comboMed2 ?? "").trim();

    if (!m1 || !m2) {
      setError("Please enter both medicine names.");
      setComboResult(null);
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setComboResult(null);

    try {
      const syntheticText = `${m1}\n${m2}`;
      const allergies = String(form.allergies ?? "")
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);

      const response = await fetch(`${apiUrl}/api/combination/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          medicine1: m1,
          medicine2: m2
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Validation request failed.");

      setComboResult(data);
      loadHistory();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <button
        type="button"
        className="theme-toggle"
        aria-label="Change mode"
        aria-pressed={theme === "dark"}
        title="Change mode"
        onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
      >
        <span aria-hidden="true">{theme === "dark" ? "☀" : "☾"}</span>
      </button>
      <datalist id="medicine-names">
        {catalog.map((medicine) => (
          <option key={`${medicine.id}-${medicine.name}`} value={medicine.name} />
        ))}
      </datalist>
      <div className="dashboard">
        <aside className="sidebar">
          <div className="sidebar-card brand-card">
            <img className="site-logo" src="/img4.webp" alt="Prescription Validator logo" />
            <p className="eyebrow">Medical Prescription Validator</p>
            <h2>Smart Prescription Analysis</h2>
            <p>
              Detect dosage errors and allergy risks with a clear, review-ready output.
            </p>
          </div>

          <nav className="sidebar-card">
            <h3>Navigate</h3>
            <a href="#" onClick={(e) => (e.preventDefault(), setView("catalog"))}>
              Medicines DB
            </a>
            <a href="#" onClick={(e) => (e.preventDefault(), setView("combination"))}>
              Check Combination
            </a>
            <a href="#" onClick={(e) => (e.preventDefault(), setView("scanner"))}>
              Scanner
            </a>
          </nav>

          <section className="sidebar-card">
            <h3>Search Tips</h3>
            <ul className="plain-list">
              <li>Use bright, straight prescription images.</li>
              <li>Printed text performs better than handwriting.</li>
              <li>Search the catalog to confirm the medicine exists in your DB.</li>
            </ul>
          </section>

        </aside>

        <div className="content">
          <section className="hero" id="workspace">
            <p className="eyebrow">Dashboard</p>
            <h1>Smart prescription analysis with dosage and allergy risk checks.</h1>
            <p className="hero-copy">Choose a section below to work without confusion.</p>

            <div className="dashboard-buttons" role="tablist" aria-label="Dashboard sections">
              <button
                type="button"
                className={`dashboard-tab ${view === "catalog" ? "active" : ""}`}
                onClick={() => setView("catalog")}
              >
                Medicines DB
              </button>
              <button
                type="button"
                className={`dashboard-tab ${view === "combination" ? "active" : ""}`}
                onClick={() => setView("combination")}
              >
                Check Combination
              </button>
              <button
                type="button"
                className={`dashboard-tab ${view === "scanner" ? "active" : ""}`}
                onClick={() => setView("scanner")}
              >
                Scanner
              </button>
            </div>

            {view === "catalog" ? (
              <div style={{ marginTop: "0.75rem" }}>
                <span
                  className="pill"
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                >
                  <strong>Total medicines:</strong>{" "}
                  {catalogLoading ? "Loading..." : catalog.length}
                </span>
              </div>
            ) : null}

            {!view ? (
              <div className="welcome-panel">
                <div className="welcome-copy">
                  <span className="welcome-kicker">Ready when you are</span>
                  <h2>Start with the medicine list, compare two drugs, or scan a prescription image.</h2>
                  <p>
                    Your workspace is connected to the catalog, validation history, interaction checks,
                    and OCR scanner so each result feels easy to review.
                  </p>
                </div>

                <div className="welcome-stats" aria-label="Dashboard readiness">
                  <div>
                    <strong>{catalogLoading ? "..." : catalog.length}</strong>
                    <span>medicines loaded</span>
                  </div>
                  <div>
                    <strong>{interactionRuleCount}</strong>
                    <span>interaction rules</span>
                  </div>
                  <div>
                    <strong>{historyLoading ? "..." : history.length}</strong>
                    <span>saved scans</span>
                  </div>
                  <div>
                    <strong>{warningCount}</strong>
                    <span>active warnings</span>
                  </div>
                </div>

                <div className="quick-paths">
                  <button type="button" className="quick-path" onClick={() => setView("catalog")}>
                    <span>01</span>
                    <strong>Explore medicines</strong>
                    <small>Search brand, generic name, dosage range, and allergy tags.</small>
                  </button>
                  <button type="button" className="quick-path" onClick={() => setView("combination")}>
                    <span>02</span>
                    <strong>Check pair safety</strong>
                    <small>Compare two medicines for known compatibility warnings.</small>
                  </button>
                  <button type="button" className="quick-path" onClick={() => setView("scanner")}>
                    <span>03</span>
                    <strong>Scan prescription</strong>
                    <small>Upload an image and review recognized medicines with warnings.</small>
                  </button>
                </div>
              </div>
            ) : null}
          </section>

          <main className="grid">
            {view === "catalog" ? (
              <section className="panel catalog-panel" id="catalog">
                <div className="panel-heading">
                  <h2>Medicine Search</h2>
                  <p>Search and filter the catalog by brand, generic name, category, allergy tag, or notes.</p>
                </div>

                <div className="catalog-tools">
                  <label>
                    Search Catalog
                    <input
                      type="text"
                      value={catalogQuery}
                      onChange={(event) => setCatalogQuery(event.target.value)}
                      placeholder="Search medicine name or generic name"
                      list="medicine-names"
                    />
                  </label>
                  <label>
                    Category
                    <select
                      value={catalogCategory}
                      onChange={(event) => setCatalogCategory(event.target.value)}
                    >
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Allergy Tag
                    <select
                      value={catalogAllergy}
                      onChange={(event) => setCatalogAllergy(event.target.value)}
                    >
                      {allergyOptions.map((allergy) => (
                        <option key={allergy} value={allergy}>
                          {allergy}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {catalogLoading ? (
                  <p className="notice">Loading medicine catalog...</p>
                ) : filteredCatalog.length ? (
                  <div className="catalog-list">
                    {filteredCatalog.map((medicine) => (
                      <article className="catalog-card" key={medicine.id}>
                        <div className="catalog-header">
                          <div>
                            <h3>{medicine.name}</h3>
                            <p>{medicine.genericName ?? "Generic name not available"}</p>
                          </div>
                          <button
                            type="button"
                            className="ghost-button"
                            onClick={() => setSelectedMedicine(medicine)}
                          >
                            Details
                          </button>
                        </div>
                        <p>{medicine.notes ?? "No medicine description available."}</p>
                        <div className="catalog-meta">
                          <span>Category: {medicine.category ?? "General"}</span>
                          <span>
                            Dosage: {formatDosage(medicine)}
                          </span>
                          <span>
                            Allergy tags:{" "}
                            {medicine.allergyTags?.length
                              ? medicine.allergyTags.join(", ")
                              : "None"}
                          </span>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <p className="notice">No medicine matched the current search.</p>
                )}
              </section>
            ) : null}

            {view === "combination" ? (
              <section className="panel combo-panel" id="combo">
                <div className="panel-heading">
                  <h2>Check Medicine Combination</h2>
                  <p>Type two medicine names and get compatibility warnings.</p>
                </div>

                <div className="combo-layout">
                  <div className="form-stack">
                    <label>
                      Medicine 1
                      <input
                        type="text"
                        value={form.comboMed1 ?? ""}
                        onChange={(e) =>
                          setForm((current) => ({ ...current, comboMed1: e.target.value }))
                        }
                        placeholder="e.g. Ibuprofen"
                        list="medicine-names"
                      />
                    </label>

                    <label>
                      Medicine 2
                      <input
                        type="text"
                        value={form.comboMed2 ?? ""}
                        onChange={(e) =>
                          setForm((current) => ({ ...current, comboMed2: e.target.value }))
                        }
                        placeholder="e.g. Warfarin"
                        list="medicine-names"
                      />
                    </label>

                    <button type="button" className="secondary-button" disabled={loading} onClick={submitCombination}>
                      {loading ? "Checking..." : "Check Combination"}
                    </button>
                  </div>

                  {comboResult ? (
                    <div className="combo-warnings">
                      <h3>Combination Result</h3>

                      {comboResult.found ? (
                        <div>
                          <p>
                            <strong>Type:</strong> {comboResult.combination.type}
                          </p>
                          <p>
                            <strong>Severity:</strong> {comboResult.combination.severity}
                          </p>
                          <p>{comboResult.combination.notes}</p>
                        </div>
                      ) : (
                        <p className="notice">No matching combination found in the dataset.</p>
                      )}
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            {view === "scanner" ? (
              <>
                <section className="panel" id="image">
                  <div className="panel-heading">
                    <h2>Scan Prescription Image</h2>
                    <p>Upload a prescription photo to extract text and compare it against the DB.</p>
                  </div>

                  <form onSubmit={submitImage} className="form-stack">
                    <label className="upload-box">
                      <span>Prescription Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => setImage(event.target.files?.[0] ?? null)}
                      />
                    </label>
                    <button type="submit" disabled={uploading}>
                      {uploading ? "Scanning..." : "Upload Image"}
                    </button>
                  </form>
                </section>

                <section className="panel result-panel" id="results">
                  <div className="panel-heading">
                    <h2>Validation Result</h2>
                    <p>Review extracted text, matched medicines, warnings, and previous validation runs.</p>
                  </div>

                  {error ? <p className="error">{error}</p> : null}

                  {!result ? (
                    <div className="empty-state">
                      <p>No validation result yet. Submit a prescription to inspect it.</p>
                    </div>
                  ) : (
                    <div className="result-stack scanner-result-card">
                      <div className={`score-card ${scoreTone(result.safetyScore)}`}>
                        <span>Safety Score</span>
                        <strong>{result.safetyScore}/100</strong>
                      </div>

                      <div className="summary">
                        <h3>Summary</h3>
                        <p>{result.summary}</p>
                        {result.ocrConfidence ? (
                          <p className={`confidence ${scoreTone(result.ocrConfidence)}`}>
                            OCR confidence: {result.ocrConfidence}% - {confidenceLabel(result.ocrConfidence)}
                          </p>
                        ) : null}
                        {result.scanMetadata?.lowConfidence ? (
                          <p className="error">
                            OCR confidence is low. Handwritten or blurry prescriptions may not be read correctly.
                          </p>
                        ) : null}
                        {result.sourceLabel ? (
                          <p className="notice">Scanned file: {result.sourceLabel}</p>
                        ) : null}
                        <div className="result-actions">
                          <button type="button" className="secondary-button" onClick={() => downloadReport(result)}>
                            Print / Save PDF
                          </button>
                          <button type="button" className="ghost-button" onClick={() => setView("catalog")}>
                            Open Catalog
                          </button>
                        </div>
                      </div>

                      <div className="result-grid">
                        <article>
                          <h3>Review Extracted Text</h3>
                          <textarea
                            className="review-textarea"
                            value={reviewText}
                            onChange={(event) => setReviewText(event.target.value)}
                            rows={8}
                          />
                          <button
                            type="button"
                            className="secondary-button"
                            disabled={reviewingText}
                            onClick={submitReviewedText}
                          >
                            {reviewingText ? "Re-checking..." : "Re-run Validation"}
                          </button>
                        </article>

                        <article>
                          <h3>Medicine Details</h3>
                          {result.medicines.length ? (
                            result.medicines.map((medicine) => (
                              <div className="medicine-card" key={`${medicine.name}-${medicine.dosage}`}>
                                <div className="medicine-head">
                                  <strong>{medicine.name}</strong>
                                  <span className={medicine.recognized ? "tag ok" : "tag muted"}>
                                    {medicine.recognized ? "recognized" : "unknown"}
                                  </span>
                                </div>
                                <p>Dosage: {medicine.dosage ?? "No dosage found"}</p>
                                <p>Generic: {medicine.genericName ?? "Not available"}</p>
                                <p>Category: {medicine.category ?? "General"}</p>
                                <p>Description: {medicine.description ?? "Not available"}</p>
                                <p>Dosage range: {medicine.dosageRange ?? "Not configured"}</p>
                                <p>
                                  Allergy tags:{" "}
                                  {medicine.allergyTags?.length
                                    ? medicine.allergyTags.join(", ")
                                    : "None"}
                                </p>
                              </div>
                            ))
                          ) : (
                            <p className="notice">No medicine entries were extracted.</p>
                          )}
                        </article>

                        <article>
                          <h3>Warnings</h3>
                          <ul>
                            {result.warnings.length ? (
                              result.warnings.map((warning, index) => (
                                <li key={`${warning.type}-${index}`}>{warning.message}</li>
                              ))
                            ) : (
                              <li>No warnings detected.</li>
                            )}
                          </ul>
                        </article>
                      </div>
                    </div>
                  )}
                </section>
              </>
            ) : null}
          </main>
        </div>
      </div>

      {selectedMedicine ? (
        <div className="modal-backdrop" role="presentation" onClick={() => setSelectedMedicine(null)}>
          <section
            className="medicine-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="medicine-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="catalog-header">
              <div>
                <p className="eyebrow">{selectedMedicine.category ?? "General"}</p>
                <h2 id="medicine-detail-title">{selectedMedicine.name}</h2>
                <p>{selectedMedicine.genericName ?? "Generic name not available"}</p>
              </div>
              <button type="button" className="ghost-button" onClick={() => setSelectedMedicine(null)}>
                Close
              </button>
            </div>
            <div className="detail-grid">
              <div>
                <strong>Dosage Range</strong>
                <span>{formatDosage(selectedMedicine)}</span>
              </div>
              <div>
                <strong>Allergy Tags</strong>
                <span>
                  {selectedMedicine.allergyTags?.length
                    ? selectedMedicine.allergyTags.join(", ")
                    : "None configured"}
                </span>
              </div>
            </div>
            <p>{selectedMedicine.notes ?? "No description available."}</p>
            <p className="medical-note">
              This project supports review and education only. Patients should follow a qualified clinician's advice.
            </p>
          </section>
        </div>
      ) : null}
    </div>
  );
}

export default App;
