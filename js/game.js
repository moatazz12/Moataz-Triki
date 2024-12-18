const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');

const loader = document.getElementById('loader')
const game = document.getElementById('game');


let currentQuestion = {};
let acceptingAnswes = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = []; 

fetch(
    "questions.json"
    )
  .then(response => response.json())  
  .then(loadedQuestions => {

    questions = loadedQuestions;  

    startGame();
  })
    .catch(err => {
         console.log(err);
    });

const CORRECT_BONUS = 3;
const MAX_QUESTIONS = 10;

startGame = () =>{
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions]; 
    
    getNewQuestions();

    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestions = () =>{
     
    if(availableQuestions.length ===0 || questionCounter >= MAX_QUESTIONS){

        localStorage.setItem("mostRecentScore", score);

        return window.location.assign('end.html');
    }

    questionCounter++;
    progressText.innerText = ` Question ${questionCounter}/${MAX_QUESTIONS}`;
 

   progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`; 

     const questionIndex = Math.floor(Math.random() * availableQuestions.length);
     currentQuestion = availableQuestions[questionIndex];
     question.innerText = currentQuestion.question;

     choices.forEach(choice =>{
          const number = choice.dataset['number']; 
          choice.innerText = currentQuestion['choice' + number]; 

     });

     availableQuestions.splice(questionIndex, 1); 

     acceptingAnswes= true;
};

choices.forEach(choice =>{
    choice.addEventListener('click', e => {
           if(!acceptingAnswes) return;

           acceptingAnswes = false;
           const selectedChoice = e.target;
           const selectedAnswer = selectedChoice.dataset['number'];

            const classToApply = 
            selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';
           
                  if(classToApply === 'correct'){
                      incrementScore(CORRECT_BONUS);
                  }  

            selectedChoice.parentElement.classList.add(classToApply);

            setTimeout(() =>{
 
                selectedChoice.parentElement.classList.remove(classToApply);
                getNewQuestions();
            },1000); 
           
    });
});

incrementScore = num => {
    score +=num;
    scoreText.innerText = score;  
}

