// Данные викторины: 10 вопросов с вариантами и правильным ответом (индекс 0..3)
const quizData = [
    {
        question: "Что означает аббревиатура HTML?",
        options: ["Hyper Text Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "High-Level Text Management Language"],
        correct: 0
    },
    {
        question: "Какой тег используется для создания самой важной (главной) ссылки на CSS-стили?",
        options: ["<css>", "<link>", "<style src>", "<stylesheet>"],
        correct: 1
    },
    {
        question: "Какое CSS-свойство задаёт цвет текста?",
        options: ["text-color", "color", "font-color", "background-color"],
        correct: 1
    },
    {
        question: "Какой метод JavaScript используется для выбора элемента по его идентификатору (id)?",
        options: ["getElementById()", "querySelectorById()", "getElementByClass()", "selectId()"],
        correct: 0
    },
    {
        question: "Что делает flexbox в CSS?",
        options: ["Создаёт адаптивные сетки и выравнивание", "Добавляет тени блокам", "Отвечает за анимацию", "Управляет шрифтами"],
        correct: 0
    },
    {
        question: "Какой тег используется для вставки JavaScript-кода в HTML?",
        options: ["<js>", "<javascript>", "<script>", "<code>"],
        correct: 2
    },
    {
        question: "Какое значение свойства position заставляет элемент оставаться на месте при прокрутке?",
        options: ["relative", "absolute", "fixed", "static"],
        correct: 2
    },
    {
        question: "Что делает оператор '===' в JavaScript?",
        options: ["Сравнивает только значения", "Сравнивает значения и типы данных", "Присваивает значение", "Выполняет математическое равенство"],
        correct: 1
    },
    {
        question: "Как объявить переменную, которая не может быть переназначена?",
        options: ["let", "var", "const", "static"],
        correct: 2
    },
    {
        question: "Какой метод массива добавляет один или несколько элементов в конец массива?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correct: 0
    }
];

let currentQuestionIndex = 0;
let userAnswers = new Array(quizData.length).fill(null); // хранит индекс выбранного ответа
let quizFinished = false;

// DOM элементы
const quizArea = document.getElementById('quiz-area');
const resultArea = document.getElementById('result-area');
const restartBtn = document.getElementById('restart-btn');

// Отрисовать текущий вопрос
function renderCurrentQuestion() {
    if (quizFinished) return;
    
    const questionObj = quizData[currentQuestionIndex];
    const isAnswered = userAnswers[currentQuestionIndex] !== null;
    const selectedIdx = userAnswers[currentQuestionIndex];
    
    let optionsHtml = '';
    const letters = ['A', 'B', 'C', 'D'];
    
    questionObj.options.forEach((opt, idx) => {
        const isSelected = (selectedIdx === idx);
        const selectedClass = isSelected ? 'selected' : '';
        optionsHtml += `
            <li class="${selectedClass}" data-opt-index="${idx}">
                <span class="option-prefix">${letters[idx]}</span>
                <span>${escapeHtml(opt)}</span>
            </li>
        `;
    });
    
    const progressText = `Вопрос ${currentQuestionIndex+1} из ${quizData.length}`;
    
    const html = `
        <div class="progress">${progressText}</div>
        <div class="question-card">
            <div class="question-text">${escapeHtml(questionObj.question)}</div>
            <ul class="options">
                ${optionsHtml}
            </ul>
        </div>
        <button id="next-btn" class="next-btn">${currentQuestionIndex === quizData.length-1 ? '🏆 Завершить тест' : '➡️ Следующий вопрос'}</button>
    `;
    
    quizArea.innerHTML = html;
    
    // Навесить обработчики на варианты
    const optionItems = document.querySelectorAll('.options li');
    optionItems.forEach(li => {
        li.addEventListener('click', (e) => {
            if (quizFinished) return;
            const optIndex = parseInt(li.dataset.optIndex);
            // сохраняем ответ
            userAnswers[currentQuestionIndex] = optIndex;
            // перерисовываем текущий вопрос, чтобы подсветить выбранный
            renderCurrentQuestion();
        });
    });
    
    // Кнопка "далее/завершить"
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (userAnswers[currentQuestionIndex] === null) {
                alert('Пожалуйста, выберите вариант ответа!');
                return;
            }
            // Если это был последний вопрос - завершаем и подсчитываем результат
            if (currentQuestionIndex === quizData.length - 1) {
                finishQuiz();
            } else {
                currentQuestionIndex++;
                renderCurrentQuestion();
            }
        });
    }
}

// Вычисление результата и показ
function finishQuiz() {
    quizFinished = true;
    let correctCount = 0;
    for (let i = 0; i < quizData.length; i++) {
        if (userAnswers[i] === quizData[i].correct) {
            correctCount++;
        }
    }
    const percent = Math.round((correctCount / quizData.length) * 100);
    
    let message = '';
    if (percent >= 80) message = '🎉 Отлично! Вы настоящий знаток веб-технологий!';
    else if (percent >= 60) message = '👍 Хороший результат, но можно подтянуть теорию.';
    else if (percent >= 40) message = '📚 Неплохо, советуем повторить основы.';
    else message = '💪 Попробуйте пройти викторину ещё раз и запомнить правильные ответы!';
    
    document.getElementById('score-percent').innerText = percent;
    document.getElementById('score-message').innerHTML = `${message}<br>Правильных ответов: ${correctCount} из ${quizData.length}`;
    
    quizArea.classList.add('hidden');
    resultArea.classList.remove('hidden');
}

// Перезапуск теста
function restartQuiz() {
    currentQuestionIndex = 0;
    userAnswers = new Array(quizData.length).fill(null);
    quizFinished = false;
    quizArea.classList.remove('hidden');
    resultArea.classList.add('hidden');
    renderCurrentQuestion();
}

// Простейшая защита от XSS
function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Инициализация
restartBtn.addEventListener('click', restartQuiz);
renderCurrentQuestion();