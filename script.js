// Required variables
var player1Name, player2Name;
var player1Score = 0, player2Score = 0;
var selectedCategory;
var currentQuestionIndex = 0;
var questions = [];
var currentPlayer = 1;
var selectedAnswer = null;
var questionsPerCategory = 6;
var easyQuestions = 2, mediumQuestions = 2, hardQuestions = 2;

// Event listeners
document.getElementById('start').addEventListener('click', startGame);
document.getElementById('select-category-btn').addEventListener('click', selectCategory);
document.getElementById('submit-answer').addEventListener('click', submitAnswer);
document.getElementById('play-again').addEventListener('click', playAgain);
document.getElementById('end-game').addEventListener('click', endGame);

// Fetch categories
function fetchCategories() {
    fetch('https://the-trivia-api.com/v2/categories')
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            var categoryDropdown = document.getElementById('select-category');
            for (var category in data) {
                var option = document.createElement('option');
                option.value = category;
                option.text = data[category];
                categoryDropdown.add(option);
            }
        })
        .catch(function(error) {
            console.error('Error fetching categories:', error);
        });
}

// Game logic
function startGame() {
    player1Name = document.getElementById('name1').value;
    player2Name = document.getElementById('name2').value;
    
    if (player1Name === '' || player2Name === '') {
        alert('Please enter both player names.');
        return;
    }
    
    document.getElementById('player-details').style.display = 'none';
    document.getElementById('category').style.display = 'block';
    fetchCategories();
}

function selectCategory() {
    selectedCategory = document.getElementById('select-category').value;
    document.getElementById('category').style.display = 'none';
    document.getElementById('questions').style.display = 'block';
    document.getElementById('score').style.display = 'block';
    fetchQuestions();
}

function fetchQuestions() {
    fetch(`https://the-trivia-api.com/v2/questions?categories=${selectedCategory}&limit=${questionsPerCategory}`)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            questions = data;
            displayQuestion();
        })
        .catch(function(error) {
            console.error('Error in fetching questions:', error);
        });
}

function displayQuestion() {
    var currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = currentQuestion.question.text;

    var answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';

    var answers = [...currentQuestion.incorrectAnswers, currentQuestion.correctAnswer];
    answers.sort(() => Math.random() - 0.5);

    answers.forEach(function(answer) {
        var li = document.createElement('li');
        li.textContent = answer;
        li.addEventListener('click', function() {
            selectAnswer(answer);
        });
        answersContainer.appendChild(li);
    });
}

function selectAnswer(answer) {
    selectedAnswer = answer;
    var answersContainer = document.getElementById('answers');
    var answerOptions = answersContainer.getElementsByTagName('li');
    
    for (var i = 0; i < answerOptions.length; i++) {
        if (answerOptions[i].textContent === answer) {
            answerOptions[i].classList.add('selected');
        } else {
            answerOptions[i].classList.remove('selected');
        }
    }
}

function submitAnswer() {
    if (selectedAnswer === null) {
        alert('Please select an answer before submitting.');
        return;
    }
    
    var currentQuestion = questions[currentQuestionIndex];
    if (selectedAnswer === currentQuestion.correctAnswer) {
        if (currentPlayer === 1) {
            if (currentQuestionIndex < easyQuestions) {
                player1Score += 10;
            } else if (currentQuestionIndex < easyQuestions + mediumQuestions) {
                player1Score += 15;
            } else {
                player1Score += 20;
            }
            document.getElementById('player1-score').textContent = player1Score;
        } else {
            if (currentQuestionIndex < easyQuestions) {
                player2Score += 10;
            } else if (currentQuestionIndex < easyQuestions + mediumQuestions) {
                player2Score += 15;
            } else {
                player2Score += 20;
            }
            document.getElementById('player2-score').textContent = player2Score;
        }
    }

    currentQuestionIndex++;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    selectedAnswer = null;

    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        document.getElementById('questions').style.display = 'none';
        document.getElementById('end').style.display = 'block';
        var message;
        if (player1Score === 0 && player2Score === 0) {
            message = "You both have to improve your performance.";
        } else {
            message = `Game Over! ${player1Score > player2Score ? player1Name : player2Name} wins!`;
        }
        document.getElementById('message').textContent = message;
    }
}

function playAgain() {
    currentQuestionIndex = 0;
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    selectedAnswer = null;
    document.getElementById('player1-score').textContent = '0';
    document.getElementById('player2-score').textContent = '0';
    document.getElementById('end').style.display = 'none';
    document.getElementById('category').style.display = 'block';
    fetchCategories();
}

function endGame() {
    document.getElementById('questions').style.display = 'none';
    document.getElementById('end').style.display = 'block';
    var message;
    if (player1Score === 0 && player2Score === 0) {
        message = "You both have to improve your performance.";
    } else {
        message = `Game Over! ${player1Score > player2Score ? player1Name : player2Name} wins!`;
    }
    document.getElementById('message').textContent = message;
    document.getElementById('end-game').style.display = 'none';
    document.getElementById('play-again').textContent = 'Thank you for participating';
}
