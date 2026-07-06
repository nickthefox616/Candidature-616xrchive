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

// Invia il modulo di candidatura
document.getElementById("candidaturaForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const sezione = document.getElementById("sezione").value;
    const esperienza = document.getElementById("esperienza").value;
    const motivazione = document.getElementById("motivazione").value;

    // Controlla se la sezione è aperta
    if (!candidatureStatus[sezione]) {
        document.getElementById("formStatus").textContent = "❌ Le candidature per questa sezione sono CHIUSE.";
        document.getElementById("formStatus").className = "error";
        return;
    }

    // Crea un oggetto con i dati della candidatura
    const candidatura = {
        id: Date.now(),
        nome,
        email: email || "Non fornita",
        sezione,
        esperienza,
        motivazione,
        data: new Date().toISOString(),
    };

    // Aggiungi la candidatura alla lista
    candidatureList.push(candidatura);
    localStorage.setItem("candidatureList", JSON.stringify(candidatureList));

    // Mostra un messaggio di successo
    document.getElementById("formStatus").textContent = "✅ Candidatura inviata con successo!";
    document.getElementById("formStatus").className = "success";
    document.getElementById("candidaturaForm").reset();

    // Aggiorna la lista delle candidature
    displayCandidatureList();
});

// Visualizza la lista delle candidature (solo per admin)
function displayCandidatureList() {
    const listContainer = document.getElementById("candidatureList");
    listContainer.innerHTML = "";

    if (candidatureList.length === 0) {
        listContainer.innerHTML = "<p>❌ Nessuna candidatura ricevuta.</p>";
        return;
    }

    const table = document.createElement("table");
    table.innerHTML = `
        <tr>
            <th>Nome Discord</th>
            <th>Email</th>
            <th>Sezione</th>
            <th>Esperienza</th>
            <th>Motivazione</th>
            <th>Data</th>
        </tr>
    `;

    candidatureList.forEach(candidatura => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${candidatura.nome}</td>
            <td>${candidatura.email}</td>
            <td>${candidatura.sezione}</td>
            <td>${candidatura.esperienza}</td>
            <td>${candidatura.motivazione}</td>
            <td>${new Date(candidatura.data).toLocaleString('it-IT')}</td>
        `;
        table.appendChild(row);
    });

    listContainer.appendChild(table);
}

// Inizializza l'interfaccia
updateStatusUI();
displayCandidatureList();
