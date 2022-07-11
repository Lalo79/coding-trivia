var intro = document.querySelector("#intro");
var tryTrivia = document.querySelector('#tryTrivia');

var intro_2 = document.querySelector("#intro_2");
var initials = document.querySelector("#initials");
var startTrivia = document.querySelector('#startTrivia');


var questions = document.querySelector("#questions");
var timeLeft = document.querySelector("#timeLeft");
var theQuestion = document.querySelector(".question");

// Variables to create answer choices
var answerList = document.querySelector('#answerList');
var rightOrWrong = document.querySelector('#rightOrWrong');


var results = document.querySelector("#results");


// Text that contains the initials of the user
var initialsText

var questionNumber;
var answers = ['rightAnswer', 'altAnswer1', 'altAnswer2', 'altAnswer3'];
var answerResult;
var totalPoints;

var secondsLeft = 80;




// Define initial visualisation of elements
tryTrivia.hidden = false;
intro_2.hidden = true;
questions.hidden = true;
results.hidden = true;
rightOrWrong.hidden = true;


tryTrivia.addEventListener("click", tryTriviaFunc);
startTrivia.addEventListener("click", startTriviaFunc);
answerList.addEventListener("click", function(evento) {
    var selection = evento.target;

    // The matches() method returns true if an element matches a specific CSS selector(s).
    // The matches() method returns false if not.

    if (selection.matches(".answerElement")) {
        var answerResult = selection.getAttribute("data-result");
        console.log(answerResult);
      
    }

});


answerList.addEventListener("click", function(evento) {
    var selection = evento.target;

    // The matches() method returns true if an element matches a specific CSS selector(s).
    // The matches() method returns false if not.

    if (selection.matches(".answerElement")) {
        var answerResult = selection.getAttribute("data-result");
        console.log(answerResult);
      
    }

});



function tryTriviaFunc (event) {
    
    console.log("Click boton TryTrivia");
  
    tryTrivia.hidden = true;
    intro_2.hidden = false;

}


//---------- MAIN FUNCTION ----------//

function startTriviaFunc (event) {


    // Saves User Initials
    initialsText = initials.value;
    console.log(initialsText);

    // Shows sections that are going to be used 
    intro.hidden = true;
    intro_2.hidden = true;
    questions.hidden = false;



    // Main Flow Control
    questionNumber = 1;


    setTimer();

    

    while (questionNumber <= 10) {

        createAnswerOptions();

        // Waints until user chooses an answwer
        waitForButtonClick();

        
        if (answerResult == "r") {
            rightOrWrong.innerHTML = "Your Answer is Correct!";
            totalPoints = totalPoints +10; 

        } else {
            rightOrWrong.innerHTML = "Sorry, this is NOT the right Answer!";
            secondsLeft = secondsLeft - 10;
        }
        

        questionNumber++;

    }


}



function getUserSelection(item, event) {
    return new Promise((resolve) => {
      const listener = () => {
        item.removeEventListener(event, listener);
        resolve();
      }
      item.addEventListener(event, listener);
    })
  }






function scrambleAnswers() {
    var answerseq = [];
    var unselected = answers;

    for (let index = 0; index < answers.length; index++) {

        answerPick = Math.floor(Math.random()*unselected.length);
        answerPick = unselected[answerPick];
        answerseq.push(answerPick);

        unselected = unselected.filter(element=>{return element != answerPick});      
    }

    return answerseq;
    
}


function createAnswerOptions() {

    answerList.innerHTML = "";
    answerseq = scrambleAnswers();

    theQuestion.innerHTML = questionsDB[questionNumber]['question']

    for (let index = 0; index < answerseq.length; index++) {

        var answerOption = answerseq[index];
        console.log(answerOption);


        // Create answer options in Ordered List
        var answerElement = document.createElement('li');
        answerElement.classList.add('answerElement');

        if (answerOption == 'rightAnswer') {
            answerElement.setAttribute('data-result','r');
        } else { 
            answerElement.setAttribute('data-result','w');
        }

        answerElement.innerHTML = questionsDB[questionNumber][answerOption];
        answerList.appendChild(answerElement);
    }
    
}


function setTimer() {
    var timerInterval = setInterval(function() {
        secondsLeft--;
        mins = Math.round(secondsLeft/60);
        secs = Math.round(secondsLeft%60);


        if (secs < 10 ) {
            timeLeft.textContent = mins + ":0" + secs;
        } else {
            timeLeft.textContent = mins + ":" + secs;
        }



        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
        }


    }, 1000);    

}

async function waitForButtonClick() {
    await getUserSelection(answerList, "click")
}
