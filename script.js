// Stato delle candidature (aperte/chiuse per ogni sezione)
let candidatureStatus = {
    staff: false,
    gaming: false,
    creative: false,
};

// Salva le candidature in un array
let candidatureList = [];

// Carica lo stato e le candidature salvate dal localStorage (se esistono)
if (localStorage.getItem("candidatureStatus")) {
    candidatureStatus = JSON.parse(localStorage.getItem("candidatureStatus"));
}

if (localStorage.getItem("candidatureList")) {
    candidatureList = JSON.parse(localStorage.getItem("candidatureList"));
}

// Aggiorna l'interfaccia in base allo stato delle candidature
function updateStatusUI() {
    document.getElementById("staff-status").textContent = candidatureStatus.staff ? "🟢 Aperto" : "🔴 Chiuso";
    document.getElementById("gaming-status").textContent = candidatureStatus.gaming ? "🟢 Aperto" : "🔴 Chiuso";
    document.getElementById("creative-status").textContent = candidatureStatus.creative ? "🟢 Aperto" : "🔴 Chiuso";

    // Mostra/nascondi la scritta "Candidature chiuse" e disattiva il pulsante
    const sezione = document.getElementById("sezione").value;
    const domandaRuoloContainer = document.getElementById("domanda-ruolo-container");
    const submitBtn = document.getElementById("submitBtn");

    if (sezione) {
        const isClosed = !candidatureStatus[sezione];
        domandaRuoloContainer.style.display = isClosed ? "none" : "block";
        submitBtn.disabled = isClosed;
        submitBtn.style.opacity = isClosed ? "0.5" : "1";
        submitBtn.style.cursor = isClosed ? "not-allowed" : "pointer";

        // Mostra la scritta "Candidature chiuse" se la sezione è chiusa
        const formStatus = document.getElementById("formStatus");
        if (isClosed) {
            formStatus.innerHTML = "<p style='color: red; font-weight: bold;'>⚠️ Al momento le candidature per questa sezione sono chiuse.</p>";
        } else {
            formStatus.innerHTML = "";
        }
    }
}

// Toggle per aprire/chiudere le candidature
function toggleSection(section) {
    candidatureStatus[section] = !candidatureStatus[section];
    localStorage.setItem("candidatureStatus", JSON.stringify(candidatureStatus));
    updateStatusUI();
    alert(`✅ Le candidature per "${section}" sono ora ${candidatureStatus[section] ? "APERTE" : "CHIUSE"}!`);
}

// Scarica le candidature in formato JSON
function downloadCandidature() {
    const data = JSON.stringify(candidatureList, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "candidature.json";
    a.click();
    alert("✅ File JSON scaricato con successo!");
}

// Aggiorna la domanda 8 in base al ruolo scelto
document.getElementById("sezione").addEventListener("change", function() {
    const ruoloLabel = document.getElementById("ruolo-label");
    const ruoloSelezionato = this.value;

    // Aggiorna il testo della domanda 8 in base al ruolo
    if (ruoloSelezionato === "staff") {
        ruoloLabel.textContent = "Admin";
    } else if (ruoloSelezionato === "gaming") {
        ruoloLabel.textContent = "Moderatore";
    } else if (ruoloSelezionato === "creative") {
        ruoloLabel.textContent = "Helper";
    }
});

// Invia il modulo di candidatura
document.getElementById("candidaturaForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const telegram = document.getElementById("telegram").value;
    const eta = document.getElementById("eta").value;
    const tempoServer = document.getElementById("tempo-server").value;
    const esperienza = document.getElementById("esperienza").value;
    const percheStaff = document.getElementById("perche-staff").value;
    const percheQui = document.getElementById("perche-qui").value;
    const tempoDedicare = document.getElementById("tempo-dedicare").value;
    const caratteristicheRuolo = document.getElementById("caratteristiche-ruolo").value;
    const situazione9 = document.getElementById("situazione-9").value;
    const situazione10 = document.getElementById("situazione-10").value;
    const sezione = document.getElementById("sezione").value;

    if (!candidatureStatus[sezione]) {
        alert("⚠️ Le candidature per questa sezione sono chiuse. Non puoi inviare la candidatura.");
        return;
    }

    const candidatura = {
        nome,
        telegram,
        eta,
        tempoServer,
        esperienza,
        percheStaff,
        percheQui,
        tempoDedicare,
        caratteristicheRuolo,
        situazione9,
        situazione10,
        sezione,
        data: new Date().toISOString()
    };

    candidatureList.push(candidatura);
    localStorage.setItem("candidatureList", JSON.stringify(candidatureList));
    localStorage.setItem("candidatureStatus", JSON.stringify(candidatureStatus));

    alert("✅ Candidatura inviata con successo!");
    document.getElementById("candidaturaForm").reset();
    updateStatusUI();
});

// Carica le candidature nell'interfaccia admin
function loadCandidatureList() {
    const candidatureListElement = document.getElementById("candidatureList");
    if (candidatureList.length === 0) {
        candidatureListElement.innerHTML = "<p>Nessuna candidatura ricevuta.</p>";
        return;
    }

    let html = "<table><tr><th>Nome</th><th>Telegram</th><th>Età</th><th>Sezione</th><th>Data</th></tr>";
    candidatureList.forEach(candidatura => {
        html += `<tr>
            <td>${candidatura.nome}</td>
            <td>${candidatura.telegram}</td>
            <td>${candidatura.eta}</td>
            <td>${candidatura.sezione === "staff" ? "Admin" : candidatura.sezione === "gaming" ? "Moderatore" : "Helper"}</td>
            <td>${new Date(candidatura.data).toLocaleString()}</td>
        </tr>`;
    });
    html += "</table>";
    candidatureListElement.innerHTML = html;
}

// Carica le candidature quando la pagina viene aperta
window.addEventListener("load", function() {
    updateStatusUI();
    loadCandidatureList();
});
