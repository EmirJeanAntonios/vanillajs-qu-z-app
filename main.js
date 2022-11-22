import './style.scss';
import questions from './questions.json';
import { questionChangeEvent } from './customEvents';
//initialize of question pointer
let questionPointer = 0;
let userAnswers = [];
let trueAnswers = 0;

// Declaration of the components
const quiz_container = document.querySelector('.quiz-container');
const quiz_content = quiz_container.querySelector('.quiz-content');
const quiz_question = quiz_container.querySelector('.quiz-question');
const quiz_answers = quiz_container.querySelector('.quiz-answers');
const quiz_number = quiz_container.querySelector('#quiz-number');
const quiz_footer = quiz_container.querySelector('.quiz-footer');
const next_button = quiz_container.querySelector('#next');
const finish_button = document.createElement('button');
finish_button.textContent = 'Tamamla';
const prev_button = quiz_container.querySelector('#prev');
const start_button = document.querySelector('#start-quiz');

//helper functions

function renderQuestionaire(questionIndex = 0) {
    quiz_question.textContent = questions[questionIndex].question;
    quiz_answers.innerHTML = '';

    quiz_content.classList.contains('answered') &&
        quiz_content.classList.remove('answered');
    questions[questionIndex].answers.forEach((answer, index) => {
        let answerLi = document.createElement('li');
        answerLi.dataset.id = index;
        answerLi.textContent = answer['answer-text'];
        answerLi.addEventListener('click', answerClickEvent);

        if (userAnswers[questionIndex] != null) {
            quiz_content.classList.add('answered');
            if (userAnswers[questionIndex] === index) {
                questions[questionIndex].answers[userAnswers[questionIndex]]
                    .isCorrect
                    ? answerLi.classList.add('correct')
                    : answerLi.classList.add('wrong');
            }
            answer.isCorrect && answerLi.classList.add('correct');
        }

        quiz_answers.appendChild(answerLi);
    });

    quiz_number.textContent = ` ${questionPointer + 1} / ${questions.length}`;
    quiz_answers.dispatchEvent(questionChangeEvent);
}
function answerClickEvent(e) {
    const answerId = this.dataset.id;
    userAnswers.push(parseInt(answerId));
    if (questions[questionPointer].answers[answerId].isCorrect) {
        this.classList.add('correct');
        trueAnswers++;
    } else {
        this.classList.add('wrong');
        questions[questionPointer].answers.forEach((item, index) => {
            item.isCorrect &&
                quiz_answers.childNodes[index].classList.add('correct');
        });
    }
    quiz_content.classList.add('answered');
    questionPointer != questions.length - 1 &&
        showElementWithOpacity(next_button);
}
function hideElementWithOpacity(dom) {
    dom.style.opacity = '0';
    dom.style.pointerEvents = 'none';
}
function showElementWithOpacity(dom) {
    dom.style.opacity = '1';
    dom.style.pointerEvents = 'fill';
}

//first rendering question
renderQuestionaire();

//events

next_button.addEventListener('click', (e) => {
    if (questionPointer == questions.length - 1) return;
    questionPointer++;
    renderQuestionaire(questionPointer);
});
prev_button.addEventListener('click', (e) => {
    if (questionPointer == 0) return;
    questionPointer--;
    renderQuestionaire(questionPointer);
});

start_button.addEventListener('click', function (e) {
    quiz_container.classList.remove("not-started")
    this.remove()
});

finish_button.addEventListener('click', (e) => {
    quiz_container.removeChild(quiz_content);
    quiz_container.removeChild(quiz_footer);
    let successDiv = `
  <div class="success">
  <lord-icon
    src="https://cdn.lordicon.com/lupuorrc.json"
    style="width: 250px; height: 150px"
    trigger="loop"
  >
  </lord-icon>
  <h3>Tebrikler sınavı tamamladınız!</h3>
  <p><span id="questionCount">${questions.length}</span> sorudan <span id="trueCount">${trueAnswers}</span> tanesini doğru cevapladınız</p>
</div>
  `;
    let div = document.createElement('div');
    div.innerHTML = successDiv.trim();
    quiz_container.appendChild(div);
});

quiz_answers.addEventListener('questionChanged', (e) => {
    if (!quiz_content.classList.contains('answered')) {
        hideElementWithOpacity(next_button);
    } else {
        showElementWithOpacity(next_button);
    }

    if (questionPointer == questions.length - 1) {
        hideElementWithOpacity(next_button);
        next_button.remove();
        document.querySelector('.buttons').appendChild(finish_button);
    } else {
        document.querySelector('.buttons').appendChild(next_button);
        document.querySelector('.buttons').contains(finish_button) &&
            document.querySelector('.buttons').removeChild(finish_button);
    }

    if (questionPointer != 0) {
        showElementWithOpacity(prev_button);
    } else {
        hideElementWithOpacity(prev_button);
    }
});
