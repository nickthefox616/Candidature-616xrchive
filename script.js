// Funzione per validare l'email
function validaEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Funzione per controllare se l'email è già registrata
function emailEsistente(email) {
  const data = JSON.parse(localStorage.getItem('candidature')) || { candidature: [], email_registrate: [] };
  return data.email_registrate.includes(email);
}

// Funzione per salvare una candidatura
function salvaCandidatura(candidatura) {
  const data = JSON.parse(localStorage.getItem('candidature')) || { candidature: [], email_registrate: [] };

  // Validazione email
  if (!validaEmail(candidatura.email)) {
    alert("Email non valida! Inserisci un indirizzo email corretto (es. esempio@gmail.com).");
    return false;
  }

  // Controllo email duplicata
  if (emailEsistente(candidatura.email)) {
    alert("Hai già inviato una candidatura con questa email!");
    return false;
  }

  // Aggiungi la candidatura
  candidatura.stato = "🔅 In attesa di revisione";
  data.candidature.push(candidatura);
  data.email_registrate.push(candidatura.email);

  // Salva nel localStorage
  localStorage.setItem('candidature', JSON.stringify(data));
  return true;
}

// Funzione per approvare una candidatura
function approvaCandidatura(indice) {
  const data = JSON.parse(localStorage.getItem('candidature')) || { candidature: [], email_registrate: [] };
  if (indice >= 0 && indice < data.candidature.length) {
    data.candidature[indice].stato = "✅ Approvata";
    localStorage.setItem('candidature', JSON.stringify(data));
    aggiornaInterfaccia();
  }
}

// Funzione per rifiutare una candidatura
function rifiutaCandidatura(indice) {
  const data = JSON.parse(localStorage.getItem('candidature')) || { candidature: [], email_registrate: [] };
  if (indice >= 0 && indice < data.candidature.length) {
    data.candidature.splice(indice, 1);
    data.email_registrate.splice(indice, 1);
    localStorage.setItem('candidature', JSON.stringify(data));
    aggiornaInterfaccia();
  }
}

// Funzione per aggiornare l'interfaccia admin
function aggiornaInterfaccia() {
  const data = JSON.parse(localStorage.getItem('candidature')) || { candidature: [], email_registrate: [] };
  const candidatureContainer = document.getElementById('candidature-container');
  candidatureContainer.innerHTML = '';

  // Sezioni separate per "Approvate" e "In attesa"
  const approvate = data.candidature.filter(c => c.stato === "✅ Approvata");
  const inAttesa = data.candidature.filter(c => c.stato === "🔅 In attesa di revisione");

  // Sezione "Approvate"
  if (approvate.length > 0) {
    const sezioneApprovate = document.createElement('div');
    sezioneApprovate.innerHTML = `<h2>✅ Candidature Approvate</h2>`;
    approvate.forEach((candidatura, indice) => {
      const candidaturaElement = document.createElement('div');
      candidaturaElement.className = 'candidatura approvata';
      candidaturaElement.innerHTML = `
        <p><strong>Nome:</strong> ${candidatura.nome}</p>
        <p><strong>Ruolo:</strong> ${candidatura.ruolo}</p>
        <p><strong>Email:</strong> ${candidatura.email}</p>
        <p><strong>Stato:</strong> ${candidatura.stato}</p>
      `;
      sezioneApprovate.appendChild(candidaturaElement);
    });
    candidatureContainer.appendChild(sezioneApprovate);
  }

  // Sezione "In attesa"
  if (inAttesa.length > 0) {
    const sezioneInAttesa = document.createElement('div');
    sezioneInAttesa.innerHTML = `<h2>🔅 Candidature in Attesa di Revisione</h2>`;
    inAttesa.forEach((candidatura, indice) => {
      const candidaturaElement = document.createElement('div');
      candidaturaElement.className = 'candidatura in-attesa';
      candidaturaElement.innerHTML = `
        <p><strong>Nome:</strong> ${candidatura.nome}</p>
        <p><strong>Ruolo:</strong> ${candidatura.ruolo}</p>
        <p><strong>Email:</strong> ${candidatura.email}</p>
        <p><strong>Stato:</strong> ${candidatura.stato}</p>
        <button onclick="approvaCandidatura(${data.candidature.indexOf(candidatura)})">Approva</button>
        <button onclick="rifiutaCandidatura(${data.candidature.indexOf(candidatura)})">Rifiuta</button>
      `;
      sezioneInAttesa.appendChild(candidaturaElement);
    });
    candidatureContainer.appendChild(sezioneInAttesa);
  }
}

// Funzione per gestire l'invio del modulo
document.getElementById('candidatura-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const candidatura = {
    nome: document.getElementById('nome').value,
    ruolo: document.getElementById('ruolo').value,
    email: document.getElementById('email').value,
    risposta1: document.getElementById('risposta1').value,
    risposta2: document.getElementById('risposta2').value,
    risposta3: document.getElementById('risposta3').value,
    risposta4: document.getElementById('risposta4').value,
    risposta5: document.getElementById('risposta5').value,
    risposta6: document.getElementById('risposta6').value,
    risposta7: document.getElementById('risposta7').value,
    risposta8: document.getElementById('risposta8').value,
    risposta9: document.getElementById('risposta9').value,
    risposta10: document.getElementById('risposta10').value,
  };

  if (salvaCandidatura(candidatura)) {
    alert("Candidatura inviata con successo! Grazie per aver applicato.");
    this.reset();
  }
});

// Carica l'interfaccia admin quando la pagina viene caricata
if (document.getElementById('candidature-container')) {
  aggiornaInterfaccia();
}
