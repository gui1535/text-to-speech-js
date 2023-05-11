const textarea = document.querySelector("textarea");
const listaVoz = document.querySelector("select");
const audioBtn = document.querySelector("button");
const btnCancelarAudio = document.getElementById("cancelar-audio");
let sintetizador = speechSynthesis; // Variavel do SpeechSynthesis
let estaFalando = true;

voices();

function voices() {
    for (let voice of sintetizador.getVoices()) {
        let selected = voice.name === "Google português do Brasil" ? "selected" : "";
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        listaVoz.insertAdjacentHTML("beforeend", option);
    }
}

sintetizador.addEventListener("voiceschanged", voices);

function textToSpeech(text) {
    let speechSynthesisUtterance = new SpeechSynthesisUtterance(text);
    for (let voice of sintetizador.getVoices()) {
        if (voice.name === listaVoz.value) {
            speechSynthesisUtterance.voice = voice;
        }
    }

    speechSynthesisUtterance.onend = function () {
        btnCancelarAudio.classList.add('d-none')
    };

    sintetizador.speak(speechSynthesisUtterance);
}

audioBtn.addEventListener("click", e => {
    e.preventDefault();
    if (textarea.value !== "") {
        // Verifica se não está falando
        if (!sintetizador.speaking) {
            textToSpeech(textarea.value);
        }
        btnCancelarAudio.classList.remove('d-none')
        // sE O TEXTO FOR GRANDE, OPÇÃO PARA PAUSAR
        if (textarea.value.length > 80) {
            setInterval(() => {
                if (!sintetizador.speaking && !estaFalando) {
                    estaFalando = true;
                    audioBtn.innerText = "Converter em Áudio";
                    sintetizador.cancel();
                } else { }
            }, 500);
            if (estaFalando) {
                sintetizador.resume();
                estaFalando = false;
                audioBtn.innerText = "Pausar Áudio";
            } else {
                sintetizador.pause();
                estaFalando = true;
                audioBtn.innerText = "Retomar Áudio";
            }
        } else {
            audioBtn.innerText = "Converter em Áudio";
        }
    }
});

btnCancelarAudio.addEventListener("click", e => {
    sintetizador.cancel();
    btnCancelarAudio.classList.add('d-none')
});
