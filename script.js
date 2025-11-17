// VARIÁVEIS DE ESTADO
let currentScreen = 1;
let currentQuestionIndex = 0;
let userResponses = {}; 
let finalScore = 0;
let instagramHandle = ''; 

// Configuração do Diagnóstico (Foco em Credibilidade/Social Proof)
const questions = [
    { id: 1, title: "Autoridade", text: "O número de seguidores do seu perfil transmite imediatamente confiança e autoridade no seu nicho?" },
    { id: 2, title: "Proporção", text: "A média de interações (curtidas/comentários) nos seus últimos 5 posts é claramente proporcional ao seu número de seguidores (mínimo 5%)?" },
    { id: 3, title: "Relevância", text: "Os comentários que você recebe são relevantes para o conteúdo e não apenas emojis ou spam genérico?" },
    { id: 4, title: "Vídeos", text: "Seus vídeos/reels mais recentes atingem consistentemente milhares de visualizações?" },
    { id: 5, title: "Impressão", text: "A sua foto de perfil e a bio estão otimizadas para causar a melhor primeira impressão e capturar a atenção em 3 segundos?" }
];

const scoring = {
    'Sim': 3,
    'Parcial': 2,
    'Não': 1
};

const levels = [
    { score: 15, name: "PRONTO PARA VENDER", class: "magnetic", desc: "Sua autoridade percebida está no nível máximo. Você precisa de escala. Impulsione seu conteúdo agora." },
    { score: 12, name: "IMPULSIONAMENTO ESTRATÉGICO", class: "estrategico", desc: "Sua base é sólida, mas falta prova social em alguns pontos. O impulsionamento trará a credibilidade que falta para escalar." },
    { score: 8, name: "CREDIBILIDADE EM RISCO", class: "desalinhado", desc: "A falta de prova social (seguidores/curtidas) trava sua imagem. Sua credibilidade precisa de um reforço imediato para ser levada a sério." },
    { score: 0, name: "PERFIL FRAGILIZADO", class: "invisivel", desc: "O seu perfil está fragilizado pela falta de números. Ninguém vai confiar ou comprar. O Impulsionamento é urgente." }
];


function validateAndGoToQuiz() {
    const handleInput = document.getElementById('instagramHandle');
    let handle = handleInput.value.trim();

    if (handle === "") {
        alert("Por favor, insira seu perfil do Instagram para começar a análise.");
        return;
    }
    
    instagramHandle = handle.startsWith('@') ? handle.substring(1) : handle;
    
    goToScreen(2);
}

// FUNÇÃO goToScreen (Fluxo sem Tela 4)
function goToScreen(screenNumber) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    if (screenNumber === 3) {
        document.getElementById(`screen-${screenNumber}`).classList.add('active');
        calculateResult(); // <- Quando chega na Tela 3, dispara a função que configura o botão
    } else {
        document.getElementById(`screen-${screenNumber}`).classList.add('active');
    }
}

function renderQuestion(index) {
    if (index >= questions.length) {
        goToScreen(3); 
        return;
    }
    const q = questions[index];
    document.getElementById('current-question-title').textContent = q.title.toUpperCase(); 
    const container = document.getElementById('questions-container');
    container.innerHTML = `
        <div class="question-item" data-question-id="${q.id}">
            <h3>${q.text}</h3>
            <div class="options-group">
                ${Object.keys(scoring).map(option => `
                    <button class="option-button" data-score="${scoring[option]}" onclick="selectOption(this, ${q.id})">${option}</button>
                `).join('')}
            </div>
        </div>
    `;
    const nextButton = document.querySelector('#screen-2 .cta-button');
    nextButton.textContent = (index === questions.length - 1) ? 'VER RESULTADO' : 'PRÓXIMA PERGUNTA';
}

function selectOption(button, questionId) {
    const score = parseInt(button.dataset.score);
    userResponses[questionId] = score;
    const optionsGroup = button.parentNode;
    optionsGroup.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('selected'));
    button.classList.add('selected');
    document.querySelector('#screen-2 .cta-button').disabled = false;
}

function nextQuestion() {
    const currentQ = questions[currentQuestionIndex];
    if (userResponses[currentQ.id] === undefined) {
        userResponses[currentQ.id] = 1;
    }
    currentQuestionIndex++;
    renderQuestion(currentQuestionIndex);
}

// calculateResult (Configura o botão para sair do app)
function calculateResult() {
    finalScore = Object.values(userResponses).reduce((sum, score) => sum + score, 0);
    document.getElementById('final-score').textContent = finalScore;
    
    let finalLevel = levels.find(l => finalScore >= l.score) || levels[levels.length - 1];
    if (finalScore === 15) { finalLevel = levels[0]; }
    else if (finalScore >= 12) { finalLevel = levels[1]; }
    else if (finalScore >= 8) { finalLevel = levels[2]; }
    else { finalLevel = levels[3]; }

    const levelBadge = document.getElementById('final-level');
    levelBadge.textContent = finalLevel.name;
    levelBadge.className = 'level-badge ' + finalLevel.class;
    document.getElementById('level-description').textContent = finalLevel.desc;

    // ALTERAÇÃO CRUCIAL: O botão da Tela 3 AGORA ABRE UM LINK
    const ctaButton = document.querySelector('#screen-3 .cta-button');
    ctaButton.textContent = 'QUERO MINHA PROPOSTA DE IMPULSIONAMENTO';
    ctaButton.onclick = function() {
        // SUBSTITUA ESTE LINK PELO SEU LINK DE VENDAS/CONTATO
        window.open('https://MEU_LINK_DE_VENDAS_AQUI', '_blank');
    };
}

function resetApp() {
    currentScreen = 1;
    currentQuestionIndex = 0;
    userResponses = {};
    finalScore = 0;
    instagramHandle = ''; 
    
    goToScreen(1);
}

document.addEventListener('DOMContentLoaded', () => {
    goToScreen(1);
    document.body.style.display = 'block';
    if(document.getElementById('app-container')) {
        document.getElementById('app-container').style.margin = '50px auto';
    }
});
