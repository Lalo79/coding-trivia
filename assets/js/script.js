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
var resultsTable = document.querySelector("#resultsTable");



// Text that contains the initials of the user
var initialsText

var questionNumber;
var answers = ['rightAnswer', 'altAnswer1', 'altAnswer2', 'altAnswer3'];
var answerResult;
var totalPoints = 0;
var topScores;

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

    if (answerResult == 'r') {
        rightOrWrong.innerHTML = "Your answer is correct!"
        totalPoints = totalPoints + 5;
        console.log(totalPoints);
    } else {
        rightOrWrong.innerHTML = "Sorry, this answer is not the correct one!"
        
        if (secondsLeft<=10) {secondsLeft = 0;} 
        else {secondsLeft = secondsLeft -10;}
    }

    rightOrWrong.hidden = false;

    answerTimer();


});





function tryTriviaFunc (event) {
    
    console.log("Click boton TryTrivia");
  
    tryTrivia.hidden = true;
    intro_2.hidden = false;

}


// Starts the Question Cycle

function startTriviaFunc (event) {


    // Saves User Initials
    initialsText = initials.value;
    console.log(initialsText);

    // Shows sections that are going to be used 
    intro.hidden = true;
    intro_2.hidden = true;
    questions.hidden = false;


    questionNumber = 1;


    setTimer();

    createAnswerOptions();
 

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
        mins = Math.floor(secondsLeft/60);
        secs = Math.round(secondsLeft%60);


        if (secs < 10 ) {
            timeLeft.textContent = mins + ":0" + secs;
        } else {
            timeLeft.textContent = mins + ":" + secs;
        }


        if (secondsLeft <= 0) {
            clearInterval(timerInterval);
            showResults();
        }


    }, 1000);    

}

function answerTimer() {
    var answerSecondsLeft = 1;

    var answerTimerInterval = setInterval(function() {
        answerSecondsLeft--;

        console.log(answerSecondsLeft);
        
        if (answerSecondsLeft == 0) {
            clearInterval(answerTimerInterval);
            rightOrWrong.hidden = true;

            if (questionNumber<10) {
                questionNumber++;
                createAnswerOptions();
            } else {
                showResults();
            }



        }

    }, 1000);    

}


function showResults() {

    questions.hidden = true;
    results.hidden = false;

    document.querySelector('#viewPoints').innerHTML = totalPoints;

    ranking();
    
}


function ranking() {

    resultsTable.innerHTML = "";

    topScores = JSON.parse(localStorage.getItem("topScores"));

    if (topScores == null) {topScores = []}

    if (topScores.length < 5) {tempArray = topScores} else {
        var tempArray = topScores.filter(record=>{return record.points>totalPoints});
    }
    
    if (tempArray.length < 5 ) {

        var newWinnwer =  {
            user: initialsText,
            points: totalPoints
        }
        
        tempArray.push(newWinnwer);

        topScores = tempArray.sort(function(a,b){return  b.points -  a.points});

        localStorage.setItem('topScores', JSON.stringify(topScores));
    }


    for (let index = 0; index < topScores.length; index++) {
        
        
        var rankElement = document.createElement('tr');
        rankElement.innerHTML += ('<td>' + topScores[index].user + '</td>');
        rankElement.innerHTML += ('<td>' + topScores[index].points+ '</td>');
        resultsTable.appendChild(rankElement);    
        
    }
}