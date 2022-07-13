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
var endTrivia = document.querySelector("#endTrivia");


var results = document.querySelector("#results");
var resultsTable = document.querySelector("#resultsTable");



// Text that contains the initials of the user
var initialsText

var questionNumber;
var answers = ['rightAnswer', 'altAnswer1', 'altAnswer2', 'altAnswer3'];
var answerResult;
var totalPoints = 0;
var topScores;

var secondsLeft = 60;
var timpePoints = 0;




// Define initial visualisation of elements
tryTrivia.className = "button";
intro_2.hidden = true;
questions.hidden = true;
results.hidden = true;
rightOrWrong.hidden = true;




// EVENT LISTENERS


tryTrivia.addEventListener("click", tryTriviaFunc);
startTrivia.addEventListener("click", startTriviaFunc);

endTrivia.addEventListener("click", function () {
    location.reload();
})

document.querySelector('#startAgain').addEventListener("click", function () {
    location.reload();
})




answerList.addEventListener("click", function(event) {
    var selection = event.target;
    console.log("This is teh event" + event);

    // The matches() method returns true if an element matches a specific CSS selector(s).
    // The matches() method returns false if not.
    

    if (selection.matches(".answerElement") || selection.matches(".answerText")) {
        if (selection.matches(".answerElement")) {var answerResult = selection.getAttribute("data-result");}
        if (selection.matches(".answerText")) {var answerResult = selection.parentElement.getAttribute("data-result")}
        
        // var answerResult = selection.getAttribute("data-result");
        console.log("Your answer is: " + answerResult); 
    
        if (answerResult == 'r') {
            rightOrWrong.innerHTML = "Your answer is correct!"
            totalPoints = totalPoints + 5;
            console.log(totalPoints);
        } else {
            rightOrWrong.innerHTML = "Sorry, this answer is NOT the correct one!"
            
            if (secondsLeft<=10) {secondsLeft = 0;} 
            else {secondsLeft = secondsLeft -10;}
        }

        rightOrWrong.hidden = false;

        answerTimer();

    }

});


// FUNCTIONS


function tryTriviaFunc () {
    
    
    document.querySelector(".enjoy").hidden = true;
    tryTrivia.className = "";

    tryTrivia.hidden = true;
    intro_2.hidden = false;

}


// Starts the Question Cycle

function startTriviaFunc (event) {

    // Saves User Initials
    initialsText = initials.value;

    if (initialsText.length > 3) {

        initialsText = initialsText.slice(0,9);

        console.log(initialsText);

        // Shows sections that are going to be used 
        intro.hidden = true;
        intro_2.hidden = true;
        questions.hidden = false;

        questionNumber = 1;

        setTimer();

        createAnswerOptions();

    } else {

        alert("The Nickname must have between 4 and 8 characters");

    }

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

        answerElement.innerHTML = ('<p class="answerText">' + questionsDB[questionNumber][answerOption] + "</p>");
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
                clearInterval(answerTimerInterval);
                timpePoints = secondsLeft;
                showResults();
            }
        }

    }, 500);    

}


function showResults() {

    questions.hidden = true;
    results.hidden = false;

    totalPoints =  totalPoints + timpePoints;

    document.querySelector('.cheering').innerHTML = initialsText + ", Thank you for playing!!!!";
    document.querySelector('#viewPoints').innerHTML = totalPoints;

    ranking();
    
}


function ranking() {

    resultsTable.innerHTML = "<td>Rank</td><td>NickName</td><td>points</td></th>";

    topScores = JSON.parse(localStorage.getItem("topScores"));
    if (topScores == null) {topScores = []}


    var newWinnwer =  {
        user: initialsText,
        points: totalPoints
    }

    topScores.push(newWinnwer);
    topScores = topScores.sort(function(a,b){return  b.points -  a.points}).slice(0,5);
    

    localStorage.setItem('topScores', JSON.stringify(topScores));
    

    for (let index = 0; index < topScores.length; index++) {
        
        var rankElement = document.createElement('tr');
        // rankElement.innerHTML += ('<td>Rank</td><td>NickName</td><td>points</td></th>');
        rankElement.innerHTML += ('<td>' + (eval(index) + 1) + '</td>');
        rankElement.innerHTML += ('<td>' + topScores[index].user + '</td>');
        rankElement.innerHTML += ('<td>' + topScores[index].points+ '</td>');
        resultsTable.appendChild(rankElement);    
        
    }
}



