(function () {
  const chart = document.getElementById("chart");
  const chips = document.getElementById("modeChips");
  const note = document.getElementById("note");

  const dated = BOOKS.filter((b) => b.year);
  const unknown = BOOKS.length - dated.length;
  let mode = "year";

  function tally(keyFn) {
    const m = new Map();
    dated.forEach((b) => m.set(keyFn(b.year), (m.get(keyFn(b.year)) || 0) + 1));
    return [...m.entries()].sort((a, b) => a[0] - b[0]);
  }

  function render() {
    chips.innerHTML = "";
    [["year", "By year"], ["decade", "By decade"]].forEach(([k, label]) => {
      const c = document.createElement("button");
      c.className = "chip" + (mode === k ? " active" : "");
      c.textContent = label;
      c.onclick = () => { mode = k; render(); };
      chips.appendChild(c);
    });

    const rows = mode === "year" ? tally((y) => y) : tally((y) => Math.floor(y / 10) * 10);
    const max = Math.max(...rows.map((r) => r[1]));
    chart.innerHTML = "";
    rows.forEach(([key, n]) => {
      const row = document.createElement("div");
      row.className = "bar-row";
      row.style.gridTemplateColumns = "70px 1fr 40px";
      row.innerHTML = `<div class="label">${mode === "decade" ? key + "s" : key}</div>
        <div class="bar-track"><div class="bar-fill" style="width:0%"></div></div>
        <div class="value">${n}</div>`;
      chart.appendChild(row);
      const fill = row.querySelector(".bar-fill");
      requestAnimationFrame(() => (fill.style.width = `${(n / max) * 100}%`));
    });

    note.textContent =
      `Year of first publication (series use their first book). Only years with at least one book are shown. ` +
      `${dated.length} of ${BOOKS.length} titles are charted; ${unknown} have no reliable year on record.`;
  }
  render();
})();
