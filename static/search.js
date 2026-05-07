(function () {
    var input = document.getElementById("search-input");
    var status = document.getElementById("search-status");
    var resultsEl = document.getElementById("search-results");
    var copyBtn = document.getElementById("search-copy");

    if (!input || !window.elasticlunr || !window.searchIndex) {
        if (status) status.textContent = "Search index failed to load.";
        return;
    }

    var index = elasticlunr.Index.load(window.searchIndex);
    var stemmer = elasticlunr.stemmer;
    var BODY_ROOT = window.searchIndex.index && window.searchIndex.index.body && window.searchIndex.index.body.root;
    var TITLE_ROOT = window.searchIndex.index && window.searchIndex.index.title && window.searchIndex.index.title.root;

    var SNIPPET_LEN = 240;

    function escapeHtml(s) {
        return s.replace(/[&<>"']/g, function (c) {
            return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
        });
    }

    // Descend the trie to the node matching `prefix`; null if no path.
    function descend(root, prefix) {
        var node = root;
        for (var i = 0; i < prefix.length; i++) {
            node = node && node[prefix[i]];
            if (!node) return null;
        }
        return node;
    }

    // Collect every stem (full term path) reachable below this node that has
    // at least one document attached.
    function collectStems(node, prefix, out) {
        if (!node) return;
        if (node.docs && Object.keys(node.docs).length > 0) out[prefix] = true;
        for (var k in node) {
            if (k === "docs" || k === "df") continue;
            collectStems(node[k], prefix + k, out);
        }
    }

    // Resolve the set of stems that elasticlunr would expand the query to,
    // matching its `expand: true` semantics: stem the query token, then walk
    // the title and body tries to find every term sharing that stem prefix.
    function expandedStems(queryTokens) {
        var stems = {};
        queryTokens.forEach(function (t) {
            var stemmed = stemmer(t.toLowerCase());
            if (!stemmed) return;
            [BODY_ROOT, TITLE_ROOT].forEach(function (root) {
                var node = descend(root, stemmed);
                if (node) collectStems(node, stemmed, stems);
            });
        });
        return stems;
    }

    function wordMatches(word, stems, queryTokens) {
        var lower = word.toLowerCase();
        var s = stemmer(lower);
        if (stems[s]) return true;
        for (var i = 0; i < queryTokens.length; i++) {
            var q = queryTokens[i].toLowerCase();
            if (q && lower.indexOf(q) === 0) return true;
        }
        return false;
    }

    function findMatchPos(body, stems, queryTokens) {
        var re = /[A-Za-z][A-Za-z']*/g;
        var m;
        while ((m = re.exec(body)) !== null) {
            if (wordMatches(m[0], stems, queryTokens)) return m.index;
        }
        return -1;
    }

    function highlight(text, stems, queryTokens) {
        return text.replace(/[A-Za-z][A-Za-z']*/g, function (word) {
            return wordMatches(word, stems, queryTokens) ? "<mark>" + word + "</mark>" : word;
        });
    }

    function snippet(body, stems, queryTokens) {
        if (!body) return "";
        var pos = findMatchPos(body, stems, queryTokens);
        if (pos < 0) pos = 0;
        var start = Math.max(0, pos - 60);
        var end = Math.min(body.length, start + SNIPPET_LEN);
        var raw = (start > 0 ? "…" : "") + body.slice(start, end) + (end < body.length ? "…" : "");
        var marked = highlight(raw, stems, queryTokens);
        return escapeOutsideMarks(marked);
    }

    // Escape HTML in `text` but preserve our own <mark>...</mark> wrappers.
    function escapeOutsideMarks(text) {
        var parts = text.split(/(<mark>|<\/mark>)/);
        return parts.map(function (p) {
            if (p === "<mark>" || p === "</mark>") return p;
            return escapeHtml(p);
        }).join("");
    }

    function parseTokens(q) {
        return q.split(/\s+/).filter(Boolean);
    }

    function shareUrl(q) {
        var u = new URL(window.location.href);
        u.search = "?q=" + encodeURIComponent(q);
        u.hash = "";
        return u.toString();
    }

    function render(q) {
        if (!q || q.trim().length < 2) {
            status.textContent = "";
            resultsEl.innerHTML = "";
            if (copyBtn) copyBtn.hidden = true;
            return;
        }
        if (copyBtn) copyBtn.hidden = false;
        var hits = index.search(q, {
            fields: { title: { boost: 2 }, body: { boost: 1 } },
            bool: "AND",
            expand: true,
        });

        if (hits.length === 0) {
            status.textContent = "No results for “" + q + "”.";
            resultsEl.innerHTML = "";
            return;
        }

        status.textContent = hits.length + " result" + (hits.length === 1 ? "" : "s") + ".";

        var queryTokens = parseTokens(q);
        var stems = expandedStems(queryTokens);
        var html = hits.map(function (h) {
            var doc = index.documentStore.getDoc(h.ref) || {};
            var href = h.ref;
            return (
                '<article class="search-result">' +
                '<h3><a href="' + escapeHtml(href) + '">' + escapeHtml(doc.title || href) + "</a></h3>" +
                '<p class="search-snippet">' + snippet(doc.body || "", stems, queryTokens) + "</p>" +
                "</article>"
            );
        }).join("");
        resultsEl.innerHTML = html;
    }

    var debounceTimer = null;
    input.addEventListener("input", function (e) {
        clearTimeout(debounceTimer);
        var q = e.target.value;
        debounceTimer = setTimeout(function () { render(q); }, 120);
    });

    if (copyBtn) {
        var copyResetTimer = null;
        copyBtn.addEventListener("click", function () {
            var q = input.value.trim();
            if (!q) return;
            var url = shareUrl(q);
            var done = function () {
                var original = "Copy link";
                copyBtn.textContent = "Copied!";
                clearTimeout(copyResetTimer);
                copyResetTimer = setTimeout(function () { copyBtn.textContent = original; }, 1500);
            };
            var fail = function () {
                copyBtn.textContent = "Copy failed";
                clearTimeout(copyResetTimer);
                copyResetTimer = setTimeout(function () { copyBtn.textContent = "Copy link"; }, 1500);
            };
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url).then(done, fail);
            } else {
                // Fallback for older / non-secure contexts.
                var ta = document.createElement("textarea");
                ta.value = url;
                ta.setAttribute("readonly", "");
                ta.style.position = "absolute";
                ta.style.left = "-9999px";
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand("copy") ? done() : fail(); }
                catch (e) { fail(); }
                document.body.removeChild(ta);
            }
        });
    }

    var initial = new URLSearchParams(window.location.search).get("q");
    if (initial) {
        input.value = initial;
        render(initial);
    }
})();
