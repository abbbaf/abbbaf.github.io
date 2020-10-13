function uncheckAnswers(answers) {
    answers.forEach(answer => answer.checked = false);
}

function disableInput(answers) {
    answers.forEach(answer => answer.disabled = true);
}   


function answerAll(answers, numberOfQuestions) {
    const checkedAnswers = [];
    let checkedCount = 0;

    return new Promise(resolve => {
        answers.forEach(answer => {
            answer.onclick = () => {
                const questionIndex = answer.name - 1;
                if (checkedAnswers[questionIndex] == undefined) checkedCount++;
                checkedAnswers[questionIndex] = answer;
                if (checkedCount == numberOfQuestions) resolve(checkedAnswers)
            }
        })
    })
}

function revealScore(answers, resultMsg, checkedAnswers, correctAnswers) {
     return () => {
        disableInput(answers);
        const score = checkedAnswers.reduce((acc, answer, index) => {
            return acc + (answer == correctAnswers[index]);
        },0);
        resultMsg.innerHTML = "Your score is: " + score + ".";    
        checkedAnswers.forEach(answer => {
            if (answer.checked) answer.parentNode.style.backgroundColor = '#ff000080';
        })
        correctAnswers.forEach(answer => answer.parentNode.style.backgroundColor = '#00ff0080')
    }
}

async function startTrivia(trivia, numOfOptions) {
    const answers = Array.from(trivia.querySelectorAll('.answer input'));
    const numberOfQuestions = Array.from(trivia.querySelectorAll('.question')).length;
    uncheckAnswers(answers)
    const resultMsg = document.querySelector('#result h2');
    resultMsg.innerHTML = "";
    const resultButton = document.querySelector('#result button');
    resultButton.onclick = () => resultMsg.innerHTML = "You must answer all questions.";
    const checkedAnswers = await answerAll(answers, numberOfQuestions);
    const correctAnswersIndexes = [1, 1, 2, 3, 0, 3, 0, 1, 2, 2];
    const correctAnswers = correctAnswersIndexes.map((answerIndex, arrayIndex) => {
        const index = answerIndex + (numOfOptions * arrayIndex);
        return answers[index];
    })
    resultButton.onclick = revealScore(answers, resultMsg, checkedAnswers, correctAnswers);
}


const $trivia = document.querySelector('.questions');
startTrivia($trivia, 4);


