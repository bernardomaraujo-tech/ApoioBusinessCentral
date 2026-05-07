const STORAGE_KEY = "ApoioBusinessCentral.simple.kb.v1";
const CONFIG_PASSWORD = "ApoioBC2026";
const SUPPORT_EMAIL = "suporteit@quilaban.pt";

function getKb() {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) return parsed;
      if (Array.isArray(parsed.articles)) return parsed.articles;
    } catch {}
  }
  return Array.isArray(window.ABC_KB) ? window.ABC_KB : [];
}

function saveKb(articles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles, null, 2));
}

function resetKb() {
  localStorage.removeItem(STORAGE_KEY);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalize(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function tokenize(text) {
  const stop = new Set(["para","com","sem","uma","uns","das","dos","que","por","como","sobre","este","esta","isto","mais","menos","não","nao","erro","problema","tenho","preciso","conseguir","no","na","nos","nas","de","da","do","e","o","a","os","as","ao","em","um"]);
  return normalize(text)
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length > 2 && !stop.has(t));
}

function articleText(article) {
  return [
    article.id,
    article.title,
    article.category,
    article.problem,
    article.diagnosis,
    article.cause,
    article.solution,
    article.steps,
    article.validation,
    article.notes
  ].join(" ");
}

function searchArticles(query, role) {
  const kb = getKb();
  const tokens = tokenize(query);
  if (!tokens.length) return [];

  return kb
    .filter(a => role === "agent" ? a.agent : a.user)
    .map(article => {
      const title = normalize(article.title);
      const category = normalize(article.category);
      const problem = normalize(article.problem);
      const solution = normalize(article.solution);
      const body = normalize(articleText(article));
      let score = 0;

      for (const token of tokens) {
        if (title.includes(token)) score += 7;
        if (category.includes(token)) score += 4;
        if (problem.includes(token)) score += 5;
        if (solution.includes(token)) score += 5;
        if (body.includes(token)) score += 1;
      }

      const confidence = Math.min(100, Math.round((score / Math.max(8, tokens.length * 7)) * 100));
      return { article, score, confidence };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score || b.confidence - a.confidence)
    .slice(0, 8);
}

function markdownToHtml(md) {
  if (!md) return "";
  const lines = String(md).split("\n");
  let html = "";
  let inList = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      if (inList) { html += "</ol>"; inList = false; }
      continue;
    }

    const ordered = line.match(/^\d+\.\s+(.+)/);
    if (ordered) {
      if (!inList) { html += "<ol>"; inList = true; }
      html += `<li>${escapeHtml(ordered[1])}</li>`;
      continue;
    }

    const bullet = line.match(/^-\s+(.+)/);
    if (bullet) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li>${escapeHtml(bullet[1])}</li>`;
      continue;
    }

    if (inList) { html += "</ol>"; inList = false; }

    if (line.startsWith("### ")) {
      html += `<h4>${escapeHtml(line.replace("### ", ""))}</h4>`;
    } else {
      html += `<p>${escapeHtml(line)}</p>`;
    }
  }

  if (inList) html += "</ol>";
  return html;
}

function roleLabel(role) {
  return role === "agent" ? "Agente" : "Utilizador";
}

function roleFromStorage() {
  return localStorage.getItem("ApoioBusinessCentral.role") || "user";
}

function setRole(role) {
  localStorage.setItem("ApoioBusinessCentral.role", role);
  renderMain();
}

function currentQuery() {
  const input = document.getElementById("searchInput");
  return input ? input.value.trim() : "";
}

function buildMailto() {
  const query = currentQuery();
  const subject = encodeURIComponent("Pedido de apoio Business Central");
  const body = encodeURIComponent(
`Olá,

Preciso de apoio com o seguinte tema no Business Central:

${query || "[descrever problema]"}

Tentei pesquisar na ApoioBusinessCentral mas não consegui resolver.

Obrigado.`
  );
  return `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;
}

function renderMain() {
  const root = document.getElementById("app");
  if (!root) return;

  const role = roleFromStorage();
  const kb = getKb();
  const visibleCount = kb.filter(a => role === "agent" ? a.agent : a.user).length;

  root.innerHTML = `
    <div class="hero">
      <div class="card">
        <h2>Como queres aceder?</h2>
        <p class="muted">A informação apresentada depende do perfil selecionado.</p>

        <div class="role-selector">
          <button class="${role === "user" ? "active" : "secondary"}" onclick="setRole('user')">Sou utilizador</button>
          <button class="${role === "agent" ? "active" : "secondary"}" onclick="setRole('agent')">Sou agente</button>
        </div>

        <div class="meta-row">
          <span class="pill ${role === "agent" ? "agent" : "user"}">Perfil: ${roleLabel(role)}</span>
          <span class="pill gray">${visibleCount} artigos disponíveis para este perfil</span>
        </div>
      </div>

      <div class="grid two">
        <div>
          <div class="search-wrap">
            <input id="searchInput" class="search-input" autocomplete="off" placeholder="Escreve aqui o problema que queres resolver..." oninput="handleSearch()">
          </div>

          <div id="results" class="results">
            <div class="empty">Começa a escrever para ver sugestões da base de conhecimento.</div>
          </div>

          <div class="card" style="margin-top:18px">
            <h3>Não encontraste solução?</h3>
            <p class="muted">Comunica o problema ao suporte. Podes também adicionar uma imagem para depois anexar ao email.</p>

            <label>Adicionar imagem do erro</label>
            <input type="file" id="errorImage" accept="image/*" onchange="previewImage(event)">
            <img id="imagePreview" class="image-preview" alt="Pré-visualização da imagem">

            <div class="notice warn">
              Por limitação do browser, o botão de email não anexa automaticamente a imagem. Depois de abrir o email, anexa manualmente a imagem selecionada.
            </div>

            <div class="actions">
              <a id="supportMail" class="btn warn" href="${buildMailto()}">Enviar email para suporte</a>
            </div>
          </div>
        </div>

        <div id="articlePanel" class="card article-view">
          <div class="empty">Seleciona uma sugestão para ler a solução.</div>
        </div>
      </div>
    </div>
  `;
}

function handleSearch() {
  const role = roleFromStorage();
  const query = currentQuery();
  const resultsEl = document.getElementById("results");
  const mail = document.getElementById("supportMail");
  if (mail) mail.href = buildMailto();

  if (!query || query.length < 2) {
    resultsEl.innerHTML = `<div class="empty">Começa a escrever para ver sugestões da base de conhecimento.</div>`;
    return;
  }

  const results = searchArticles(query, role);

  if (!results.length) {
    resultsEl.innerHTML = `
      <div class="notice warn">
        Não encontrei uma solução próxima na base de conhecimento para o perfil <strong>${roleLabel(role)}</strong>.
        Usa o botão de email para encaminhar o tema para o suporte.
      </div>
    `;
    return;
  }

  resultsEl.innerHTML = results.map((r, idx) => `
    <div class="result-card" onclick="showArticle('${r.article.id}')">
      <h3>${escapeHtml(r.article.title)}</h3>
      <div class="meta-row">
        <span class="pill">${escapeHtml(r.article.category)}</span>
        <span class="pill gray">${escapeHtml(r.article.id)}</span>
        <span class="pill ${role === "agent" ? "agent" : "user"}">${roleLabel(role)}</span>
      </div>
      <p>${escapeHtml(r.article.problem || r.article.solution || "")}</p>
      <div class="confidence"><div style="width:${r.confidence}%"></div></div>
      <p class="muted">Proximidade estimada: ${r.confidence}%</p>
    </div>
  `).join("");

  if (results[0]) showArticle(results[0].article.id, false);
}

function showArticle(id, scroll = true) {
  const role = roleFromStorage();
  const article = getKb().find(a => a.id === id);
  if (!article) return;

  const panel = document.getElementById("articlePanel");
  panel.innerHTML = `
    <h2>${escapeHtml(article.title)}</h2>
    <div class="meta-row">
      <span class="pill gray">${escapeHtml(article.id)}</span>
      <span class="pill">${escapeHtml(article.category || "Sem categoria")}</span>
      ${article.user ? `<span class="pill user">Utilizador</span>` : ""}
      ${article.agent ? `<span class="pill agent">Agente</span>` : ""}
    </div>

    ${sectionHtml("Problema", article.problem)}
    ${sectionHtml("Diagnóstico", article.diagnosis)}
    ${role === "agent" ? sectionHtml("Causa provável", article.cause) : ""}
    ${sectionHtml("Solução", article.solution)}
    ${sectionHtml("Como proceder", article.steps)}
    ${sectionHtml("Validação final", article.validation)}
    ${role === "agent" ? sectionHtml("Notas", article.notes) : ""}

    <div class="actions">
      <a class="btn secondary" href="${buildMailto()}">Ainda preciso de apoio</a>
    </div>
  `;

  if (scroll) panel.scrollIntoView({ behavior: "smooth", block: "start" });
}

function sectionHtml(title, content) {
  if (!content) return "";
  return `
    <div class="article-section">
      <h3>${escapeHtml(title)}</h3>
      <div>${markdownToHtml(content)}</div>
    </div>
  `;
}

function previewImage(event) {
  const file = event.target.files && event.target.files[0];
  const img = document.getElementById("imagePreview");
  if (!file || !img) return;

  const reader = new FileReader();
  reader.onload = () => {
    img.src = reader.result;
    img.style.display = "block";
  };
  reader.readAsDataURL(file);
}

function configLogin() {
  const password = document.getElementById("configPassword").value;
  if (password !== CONFIG_PASSWORD) {
    alert("Password incorreta.");
    return;
  }
  sessionStorage.setItem("ApoioBusinessCentral.configUnlocked", "true");
  renderConfig();
}

function renderConfig() {
  const root = document.getElementById("configApp");
  if (!root) return;

  const unlocked = sessionStorage.getItem("ApoioBusinessCentral.configUnlocked") === "true";
  if (!unlocked) {
    root.innerHTML = `
      <div class="config-box card">
        <h2>Configuração</h2>
        <p class="muted">Página protegida por password para importar/exportar a base de conhecimento.</p>

        <label>Password</label>
        <input type="password" id="configPassword" placeholder="Introduz a password" onkeydown="if(event.key==='Enter') configLogin()">

        <div class="actions">
          <button onclick="configLogin()">Entrar</button>
          <a class="btn secondary" href="index.html">Voltar</a>
        </div>

        <div class="notice warn">
          Esta password é apenas uma proteção simples de interface. Em GitHub Pages não existe autenticação real.
        </div>
      </div>
    `;
    return;
  }

  const kb = getKb();
  const userCount = kb.filter(a => a.user).length;
  const agentCount = kb.filter(a => a.agent).length;

  root.innerHTML = `
    <div class="config-box">
      <div class="card">
        <h2>Configuração da base de conhecimento</h2>
        <p class="muted">Importa ou exporta a base de conhecimento em JSON.</p>

        <div class="stats">
          <div class="stat"><strong>${kb.length}</strong><span>Artigos totais</span></div>
          <div class="stat"><strong>${userCount}</strong><span>Visíveis a utilizador</span></div>
          <div class="stat"><strong>${agentCount}</strong><span>Visíveis a agente</span></div>
        </div>

        <div class="actions">
          <button onclick="exportKb()">Exportar JSON</button>
          <button class="secondary" onclick="downloadMarkdown()">Exportar Markdown</button>
          <button class="danger" onclick="resetKbConfirm()">Repor base original</button>
          <a class="btn secondary" href="index.html">Voltar à pesquisa</a>
        </div>
      </div>

      <div class="card" style="margin-top:18px">
        <h3>Importar JSON</h3>
        <p class="muted">A importação substitui a base local guardada neste browser.</p>
        <input type="file" accept="application/json,.json" onchange="importKbFile(this.files[0])">
      </div>

      <div class="card" style="margin-top:18px">
        <h3>Editar JSON manualmente</h3>
        <p class="muted">Área avançada. Usa apenas para ajustes rápidos.</p>
        <textarea id="kbJson">${escapeHtml(JSON.stringify(kb, null, 2))}</textarea>
        <div class="actions">
          <button class="ok" onclick="saveManualJson()">Guardar JSON</button>
        </div>
      </div>
    </div>
  `;
}

function exportKb() {
  const payload = {
    exportedAt: new Date().toISOString(),
    articles: getKb()
  };
  downloadFile("apoio-business-central-kb.json", JSON.stringify(payload, null, 2), "application/json");
}

function downloadMarkdown() {
  const md = getKb().map(articleToMarkdown).join("\n\n---\n\n");
  downloadFile("apoio-business-central-kb.md", md, "text/markdown");
}

function importKbFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      const articles = Array.isArray(parsed) ? parsed : parsed.articles;
      if (!Array.isArray(articles)) throw new Error("O ficheiro não contém uma lista de artigos.");
      if (!confirm("Importar esta base vai substituir a base local deste browser. Continuar?")) return;
      saveKb(articles);
      alert("Base importada com sucesso.");
      renderConfig();
    } catch (err) {
      alert("Erro ao importar: " + err.message);
    }
  };
  reader.readAsText(file);
}

function saveManualJson() {
  try {
    const articles = JSON.parse(document.getElementById("kbJson").value);
    if (!Array.isArray(articles)) throw new Error("O JSON tem de ser uma lista de artigos.");
    saveKb(articles);
    alert("Base guardada.");
    renderConfig();
  } catch (err) {
    alert("Erro no JSON: " + err.message);
  }
}

function resetKbConfirm() {
  if (!confirm("Repor a base original incorporada na aplicação?")) return;
  resetKb();
  renderConfig();
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function articleToMarkdown(article) {
  return `## ${article.id} — ${article.title}
**Categoria:** ${article.category}
**Disponível para Utilizador:** ${article.user ? "Sim" : "Não"}
**Disponível para Agente:** ${article.agent ? "Sim" : "Não"}

**Problema**
${article.problem || ""}

**Diagnóstico**
${article.diagnosis || ""}

**Causa provável**
${article.cause || ""}

**Solução**
${article.solution || ""}

**Como proceder**
${article.steps || ""}

**Validação final**
${article.validation || ""}

**Notas**
${article.notes || ""}
`;
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("app")) renderMain();
  if (document.getElementById("configApp")) renderConfig();
});
