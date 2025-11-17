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

function goToScreen(screenNumber) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(`screen-${screenNumber}`).classList.add('active');

    if (screenNumber === 2) {
        renderQuestion(currentQuestionIndex);
    } else if (screenNumber === 3) {
        calculateResult();
    } else if (screenNumber === 4) {
        generateAiReport();
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
}


async function generateAiReport() {
    const reportContentDiv = document.getElementById('ai-report-text');
    document.getElementById('final-handle').textContent = instagramHandle; // Mostra o perfil
    reportContentDiv.innerHTML = '<p class="loading-text">Analisando suas respostas e justificando a necessidade de impulsionamento...</p><div class="spinner"></div>';

    const analysisData = questions.map(q => {
        const score = userResponses[q.id] || 1; 
        const responseText = Object.keys(scoring).find(key => scoring[key] === score);
        return `- ${q.title}: ${responseText} (${score} pts)`;
    }).join('\n');
    
    const userLevel = document.getElementById('final-level').textContent;

    const aiPrompt = `
        Com base nas seguintes respostas do perfil @${instagramHandle} (Pontuação Total: ${finalScore} / 15, Nível: ${userLevel}):
        ${analysisData}
        
        Gere um diagnóstico profissional focado em Credibilidade e Prova Social, explicando de forma urgente e convincente:
        1. **O que está a impedir a Credibilidade** (Falta de números de seguidores/curtidas)
        2. **A Solução Única:** Argumente que a única forma de corrigir isso instantaneamente é através de Impulsionamento Digital (comprando seguidores/curtidas/views).
        3. **Foque na Confiança:** Explique que o investimento em números é o investimento em prova social, que é o que leva à confiança e, consequentemente, a vendas e parcerias.
        4. **Conclusão Estratégica:** Aconselhe o usuário a não perder mais tempo e clicar no botão "Quero minha proposta de impulsionamento".
        
        Use linguagem direta, consultiva, com senso de urgência e formatada para HTML (use <p>, <strong>, <h3> e <ul>/<li>).
    `;

    try {
        const response = await fetch('/api/generateReport', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: aiPrompt }), 
        });

        if (!response.ok) {
            throw new Error(`Erro da API: ${response.statusText}`);
        }

        const data = await response.json();
        const aiReport = data.report; 

        reportContentDiv.innerHTML = aiReport;

    } catch (error) {
        console.error("Erro ao gerar relatório de IA:", error);
        reportContentDiv.innerHTML = `<p class="loading-text" style="color: #ff0000;">Erro ao conectar com o serviço de IA. Verifique se a chave GEMINI_API_KEY está correta na Vercel.</p>`;
    }
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
