let historico = [];
let baseOlimpiadas = [];

fetch('olimpiadas.json')
  .then(res => res.json())
  .then(data => {
    baseOlimpiadas = data;
  });

function buscarNaBase(perguntaUsuario) {
  if (!baseOlimpiadas.length) return null;
  return baseOlimpiadas.find(item =>
    item.pergunta && perguntaUsuario.toLowerCase().includes(item.pergunta.toLowerCase())
  );
}

function mostrarNoChat(texto, role = "bot") {
  const historicoDiv = document.getElementById("historico-mensagens");
  const alignClass = role === "user" ? "msg-user" : "msg-bot";
  const nome = role === "user" ? "Você" : "Gemini";

  let html = texto.replace(
    /(https?:\/\/[^\s<]+)/g,
    match => `<a href="${match}" target="_blank" style="color:#1976d2;text-decoration:underline;">${match}</a>`
  );

  if (role === "bot" && texto.includes("- ")) {
    html = "<ul style='padding-left:18px; margin:0'>";
    texto.split("\n").forEach(linha => {
      if (linha.trim().startsWith("- ")) {
        html += `<li>${linha.replace("- ", "")}</li>`;
      }
    });
    html += "</ul>";
  }

  historicoDiv.innerHTML += `<div class="${alignClass}"><b>${nome}:</b> ${html}</div>`;
  historicoDiv.scrollTop = historicoDiv.scrollHeight;
}

async function enviarPergunta() {
  const userText = document.getElementById("userInput").value.trim();
  if (!userText) return;

  historico.push({ role: "user", text: userText });
  mostrarNoChat(userText, "user");
  document.getElementById("userInput").value = "";
  document.getElementById("resposta").innerText = "Carregando...";

  const respostaBase = buscarNaBase(userText);
  if (respostaBase) {
    historico.push({ role: "bot", text: respostaBase.resposta });
    mostrarNoChat(respostaBase.resposta, "bot");
    document.getElementById("resposta").innerText = "";
    return;
  }

  const apiKey = "AIzaSyBTfhxXptQLh0fipjEFhQQcY-OaNHpxEt8";
  const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

  const contexto = "Responda como um assistente educacional, de forma clara, natural e organizada em tópicos começando com '-', se possível. Se houver links, formate como <a href=\"URL\" target=\"_blank\">texto</a>,sendo que você de mostrar o link grifado sem estar na cor azul. Evite usar negrito ou itálico. Considere que todas as siglas como OBM, OBMEP, OBA, OBF, etc. são olimpíadas científicas brasileiras.";

  const body = {
    contents: [
      {
        parts: [
          { text: contexto },
          ...historico.map(msg => ({ text: (msg.role === "user" ? "Usuário: " : "Gemini: ") + msg.text }))
        ]
      }
    ]
  };

  try {
    const response = await fetch(url + "?key=" + apiKey, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    const respostaText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Sem resposta.";
    historico.push({ role: "bot", text: respostaText });
    mostrarNoChat(respostaText, "bot");
    document.getElementById("resposta").innerText = "";
  } catch (error) {
    document.getElementById("resposta").innerText = "Erro ao conectar à API: " + error.message;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const input = document.getElementById("userInput");
  input.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      enviarPergunta();
    }
  });

  const fab = document.getElementById('chat-fab');
  const popup = document.getElementById('chat-popup');
  if (fab && popup) {
    fab.addEventListener('click', () => {
      popup.classList.toggle('active');
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === "Escape") popup.classList.remove('active');
    });
  }
});
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

async function atualizarLinks() {
  let rawData = fs.readFileSync('olimpiadas.json', 'utf-8');
  let data = JSON.parse(rawData);

  for (const olimp of data.olimpiadas) {
    const site = olimp.links.site_oficial;
    console.log(`Verificando ${olimp.sigla}: ${site}`);

    try {
      const res = await axios.get(site);
      const $ = cheerio.load(res.data);
      const link = $('a[href*="prova"]').attr('href');

      if (link) {
        olimp.links.provas_anteriores = link.startsWith('http') ? link : site + link;
        console.log(`✅ Atualizado: ${olimp.links.provas_anteriores}`);
      } else {
        console.log("❌ Não encontrou link de provas.");
      }
    } catch (e) {
      console.log(`⚠️ Erro ao acessar ${site}: ${e.message}`);
    }
  }

  fs.writeFileSync('olimpiadas_atualizado.json', JSON.stringify(data, null, 2), 'utf-8');
  console.log('\n✅ Arquivo atualizado salvo como olimpiadas_atualizado.json');
}

atualizarLinks();
