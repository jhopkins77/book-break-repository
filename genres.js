(function () {
  const chart = document.getElementById("chart");

  const counts = {};
  BOOKS.forEach((book) => {
    const recCount = book.entries.length; // number of times a person recommended this title
    counts[book.genre] = counts[book.genre] || { recommendations: 0, titles: 0 };
    counts[book.genre].recommendations += recCount;
    counts[book.genre].titles += 1;
  });

  const rows = Object.entries(counts)
    .map(([genre, v]) => ({ genre, ...v }))
    .sort((a, b) => b.recommendations - a.recommendations);

  const max = Math.max(...rows.map((r) => r.recommendations));

  rows.forEach((r) => {
    const row = document.createElement("div");
    row.className = "bar-row";

    const label = document.createElement("div");
    label.className = "label";
    label.textContent = r.genre;

    const track = document.createElement("div");
    track.className = "bar-track";
    const fill = document.createElement("div");
    fill.className = "bar-fill";
    fill.style.width = "0%";
    track.appendChild(fill);

    const value = document.createElement("div");
    value.className = "value";
    value.textContent = r.recommendations;
    value.title = `${r.titles} title${r.titles === 1 ? "" : "s"}`;

    row.appendChild(label);
    row.appendChild(track);
    row.appendChild(value);
    chart.appendChild(row);

    requestAnimationFrame(() => {
      fill.style.width = `${(r.recommendations / max) * 100}%`;
    });
  });
})();
