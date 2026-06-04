const API_URL = "https://coffee-rag-28vj.onrender.com/ask";

const form        = document.getElementById("chatForm");
const input       = document.getElementById("chatInput");
const sendBtn     = document.getElementById("chatSend");
const messages    = document.getElementById("chatMessages");
const suggestions = document.getElementById("chatSuggestions");

const history = [];

// ── helpers ───────────────────────────────────

function scrollToBottom() {
  messages.scrollTop = messages.scrollHeight;
}

function addUserBubble(text) {
  const div = document.createElement("div");
  div.className = "chat-bubble chat-bubble--user";
  div.innerHTML = `<p>${escapeHtml(text)}</p>`;
  messages.appendChild(div);
  scrollToBottom();
}

function addTypingIndicator() {
  const div = document.createElement("div");
  div.className = "chat-bubble chat-bubble--bot chat-bubble--typing";
  div.id = "typingIndicator";
  div.innerHTML = `<p>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
    <span class="typing-dot"></span>
  </p>`;
  messages.appendChild(div);
  scrollToBottom();
  return div;
}

function removeTypingIndicator() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

function addBotBubble(answer, source) {
  const div = document.createElement("div");
  div.className = "chat-bubble chat-bubble--bot";
  div.innerHTML = `
    <p>${escapeHtml(answer)}</p>
    <span class="chat-source">${escapeHtml(source)}</span>
  `;
  messages.appendChild(div);
  scrollToBottom();
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function setLoading(isLoading) {
  sendBtn.disabled = isLoading;
  input.disabled   = isLoading;
}

// ── send message ──────────────────────────────

async function sendMessage(question) {
  if (!question.trim()) return;

  suggestions.style.display = "none";
  input.value = "";
  setLoading(true);

  addUserBubble(question);
  const typing = addTypingIndicator();

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history }),
    });

    if (!res.ok) throw new Error(`API error: ${res.status}`);

    const data = await res.json();

    history.push({ role: "user",      content: question    });
    history.push({ role: "assistant", content: data.answer });

    removeTypingIndicator();
    addBotBubble(data.answer, data.source);

  } catch (err) {
    removeTypingIndicator();
    addBotBubble("Hmm, something went wrong on my end. Try again in a moment.", "");
    console.error(err);
  } finally {
    setLoading(false);
    input.focus();
  }
}

// ── events ────────────────────────────────────

form.addEventListener("submit", (e) => {
  e.preventDefault();
  sendMessage(input.value);
});

document.querySelectorAll(".suggestion").forEach((btn) => {
  btn.addEventListener("click", () => sendMessage(btn.dataset.q));
});
