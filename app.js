(function () {
  const gallery = document.getElementById("gallery");
  const searchInput = document.getElementById("search");
  const genreChips = document.getElementById("genreChips");
  const countLine = document.getElementById("countLine");
  const emptyState = document.getElementById("emptyState");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalBody = document.getElementById("modalBody");

  const genres = Array.from(new Set(BOOKS.map((b) => b.genre))).sort();
  let activeGenre = null;
  let query = "";

  function initials(title) {
    return title
      .split(/\s+/)
      .slice(0, 6)
      .join(" ");
  }

  function coverEl(book) {
    if (book.cover) {
      const img = document.createElement("img");
      img.src = book.cover;
      img.alt = `Cover of ${book.title}`;
      img.loading = "lazy";
      img.onerror = () => {
        img.replaceWith(fallbackEl(book));
      };
      return img;
    }
    return fallbackEl(book);
  }

  function fallbackEl(book) {
    const div = document.createElement("div");
    div.className = "cover-fallback";
    div.textContent = initials(book.title);
    return div;
  }

  function renderChips() {
    genreChips.innerHTML = "";
    const allChip = document.createElement("button");
    allChip.className = "chip" + (activeGenre === null ? " active" : "");
    allChip.textContent = "All genres";
    allChip.onclick = () => {
      activeGenre = null;
      render();
    };
    genreChips.appendChild(allChip);

    genres.forEach((g) => {
      const chip = document.createElement("button");
      chip.className = "chip" + (activeGenre === g ? " active" : "");
      chip.textContent = g;
      chip.onclick = () => {
        activeGenre = activeGenre === g ? null : g;
        render();
      };
      genreChips.appendChild(chip);
    });
  }

  function matches(book) {
    const q = query.trim().toLowerCase();
    const genreOk = !activeGenre || book.genre === activeGenre;
    if (!genreOk) return false;
    if (!q) return true;
    return (
      book.title.toLowerCase().includes(q) ||
      (book.author && book.author.toLowerCase().includes(q))
    );
  }

  function render() {
    renderChips();
    const filtered = BOOKS.filter(matches);
    gallery.innerHTML = "";
    filtered.forEach((book) => {
      const card = document.createElement("button");
      card.className = "card";
      card.setAttribute("aria-label", `Open ${book.title}`);

      const coverWrap = document.createElement("div");
      coverWrap.className = "cover-wrap";
      coverWrap.appendChild(coverEl(book));

      const totalMentions = book.entries.reduce(
        (sum, e) => sum + e.comments.length,
        0
      );
      if (totalMentions > 1) {
        const badge = document.createElement("span");
        badge.className = "mentions-badge";
        badge.textContent = `${totalMentions}×`;
        coverWrap.appendChild(badge);
      }

      const title = document.createElement("div");
      title.className = "title";
      title.textContent = book.title;

      const author = document.createElement("div");
      author.className = "author";
      author.textContent = book.author || "";

      const genreTag = document.createElement("div");
      genreTag.className = "genre-tag";
      genreTag.textContent = book.genre;

      card.appendChild(coverWrap);
      card.appendChild(title);
      if (book.author) card.appendChild(author);
      card.appendChild(genreTag);

      card.onclick = () => openModal(book);
      gallery.appendChild(card);
    });

    emptyState.style.display = filtered.length ? "none" : "block";
    countLine.textContent = `${filtered.length} of ${BOOKS.length} books`;
  }

  function openModal(book) {
    modalBody.innerHTML = "";

    const closeBtn = document.createElement("button");
    closeBtn.className = "modal-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "✕";
    closeBtn.onclick = closeModal;

    const coverCol = document.createElement("div");
    coverCol.className = "cover-col";
    coverCol.appendChild(coverEl(book));

    const infoCol = document.createElement("div");

    const h2 = document.createElement("h2");
    h2.textContent = book.title;

    const meta = document.createElement("p");
    meta.className = "meta-author";
    meta.textContent = [book.author, book.year].filter(Boolean).join(" · ");

    const metaRow = document.createElement("div");
    metaRow.className = "meta-row";
    const genrePill = document.createElement("span");
    genrePill.className = "tag-pill";
    genrePill.textContent = book.genre;
    metaRow.appendChild(genrePill);

    infoCol.appendChild(h2);
    if (meta.textContent) infoCol.appendChild(meta);
    infoCol.appendChild(metaRow);

    if (book.buyLink) {
      const buy = document.createElement("a");
      buy.className = "buy-link";
      buy.href = book.buyLink;
      buy.target = "_blank";
      buy.rel = "noopener noreferrer";
      buy.textContent = "Where to buy →";
      infoCol.appendChild(buy);
    }

    const commentsHeading = document.createElement("p");
    commentsHeading.className = "comments-heading";
    commentsHeading.textContent = "What people said";
    infoCol.appendChild(commentsHeading);

    book.entries.forEach((entry) => {
      const block = document.createElement("div");
      block.className = "comment-block";
      const who = document.createElement("div");
      who.className = "who";
      who.textContent = entry.recommender;
      block.appendChild(who);
      entry.comments.forEach((c) => {
        const p = document.createElement("p");
        p.textContent = c;
        block.appendChild(p);
      });
      infoCol.appendChild(block);
    });

    modalBody.appendChild(closeBtn);
    modalBody.appendChild(coverCol);
    modalBody.appendChild(infoCol);

    modalBackdrop.classList.remove("hidden");
  }

  function closeModal() {
    modalBackdrop.classList.add("hidden");
  }

  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  searchInput.addEventListener("input", (e) => {
    query = e.target.value;
    render();
  });

  render();
})();
