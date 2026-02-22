// Quiz Application JavaScript
        // Quiz questions and answers
        const quizData = [
            {
                question: "What is the capital of France?",
                options: ["London", "Berlin", "Paris", "Madrid"],
                answer: 2
            },
            {
                question: "Which planet is known as the Red Planet?",
                options: ["Venus", "Mars", "Jupiter", "Saturn"],
                answer: 1
            },
            {
                question: "What is the largest ocean on Earth?",
                options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
                answer: 3
            },
            {
                question: "Who wrote 'Romeo and Juliet'?",
                options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
                answer: 1
            },
            {
                question: "What is the chemical symbol for gold?",
                options: ["Go", "Gd", "Au", "Ag"],
                answer: 2
            },
            {
                question: "Which country is known as the Land of the Rising Sun?",
                options: ["China", "South Korea", "Japan", "Thailand"],
                answer: 2
            },
            {
                question: "What is the hardest natural substance on Earth?",
                options: ["Gold", "Iron", "Diamond", "Platinum"],
                answer: 2
            },
            {
                question: "How many continents are there?",
                options: ["5", "6", "7", "8"],
                answer: 2
            },
            {
                question: "Which gas do plants absorb from the atmosphere?",
                options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
                answer: 1
            },
            {
                question: "What is the world's longest river?",
                options: ["Amazon River", "Nile River", "Yangtze River", "Mississippi River"],
                answer: 1
            }
        ];

        // DOM Elements
        const questionContainer = document.getElementById('question-container');
        const scoreContainer = document.getElementById('score-container');
        const questionNumber = document.getElementById('question-number');
        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        const nextBtn = document.getElementById('next-btn');
        const prevBtn = document.getElementById('prev-btn');
        const submitBtn = document.getElementById('submit-btn');
        const restartBtn = document.getElementById('restart-btn');
        const progressBar = document.getElementById('progress-bar');
        const timerElement = document.getElementById('timer');
        const correctCountElement = document.getElementById('correct-count');
        const incorrectCountElement = document.getElementById('incorrect-count');
        const scoreValueElement = document.getElementById('score-value');
        const scoreTextElement = document.getElementById('score-text');

        // Quiz state variables
        let currentQuestion = 0;
        let score = 0;
        let selectedOptions = new Array(quizData.length).fill(null);
        let timeElapsed = 0;
        let timerInterval;
        let correctCount = 0;
        let incorrectCount = 0;

        // Initialize the quiz
        function initQuiz() {
            startTimer();
            loadQuestion();
            updateStats();
            updateProgressBar();
        }

        // Start the timer
        function startTimer() {
            clearInterval(timerInterval);
            timeElapsed = 0;
            updateTimerDisplay();
            
            timerInterval = setInterval(() => {
                timeElapsed++;
                updateTimerDisplay();
            }, 1000);
        }

        // Update timer display
        function updateTimerDisplay() {
            const minutes = Math.floor(timeElapsed / 60).toString().padStart(2, '0');
            const seconds = (timeElapsed % 60).toString().padStart(2, '0');
            timerElement.textContent = `${minutes}:${seconds}`;
        }

        // Load the current question
        function loadQuestion() {
            const currentQuizData = quizData[currentQuestion];
            
            // Update question number and text
            questionNumber.textContent = `Question ${currentQuestion + 1} of ${quizData.length}`;
            questionText.textContent = currentQuizData.question;
            
            // Clear previous options
            optionsContainer.innerHTML = '';
            
            // Create option elements
            currentQuizData.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('option');
                
                // If this option was previously selected, mark it
                if (selectedOptions[currentQuestion] === index) {
                    optionElement.classList.add('selected');
                }
                
                optionElement.innerHTML = `
                    <span class="option-prefix">${String.fromCharCode(65 + index)}</span>
                    <span class="option-text">${option}</span>
                `;
                
                optionElement.addEventListener('click', () => selectOption(index));
                optionsContainer.appendChild(optionElement);
            });
            
            // Update button states
            prevBtn.disabled = currentQuestion === 0;
            
            if (currentQuestion === quizData.length - 1) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'flex';
            } else {
                nextBtn.style.display = 'flex';
                submitBtn.style.display = 'none';
            }
            
            updateProgressBar();
        }

        // Select an option
        function selectOption(index) {
            // Reset all options
            const options = document.querySelectorAll('.option');
            options.forEach(option => {
                option.classList.remove('selected');
            });
            
            // Select the clicked option
            options[index].classList.add('selected');
            selectedOptions[currentQuestion] = index;
            
            // Update stats immediately if we're reviewing answers
            if (scoreContainer.style.display === 'block') {
                checkAnswerOnReview(index);
            }
        }

        // Check answer when reviewing
        function checkAnswerOnReview(selectedIndex) {
            const currentQuizData = quizData[currentQuestion];
            const options = document.querySelectorAll('.option');
            
            // Reset all options to default
            options.forEach(option => {
                option.classList.remove('correct', 'incorrect');
            });
            
            // Mark correct answer
            options[currentQuizData.answer].classList.add('correct');
            
            // Mark incorrect if wrong answer selected
            if (selectedIndex !== currentQuizData.answer) {
                options[selectedIndex].classList.add('incorrect');
            }
        }

        // Update progress bar
        function updateProgressBar() {
            const progress = ((currentQuestion + 1) / quizData.length) * 100;
            progressBar.style.width = `${progress}%`;
        }

        // Update stats display
        function updateStats() {
            correctCountElement.textContent = correctCount;
            incorrectCountElement.textContent = incorrectCount;
        }

        // Move to the next question
        nextBtn.addEventListener('click', () => {
            if (currentQuestion < quizData.length - 1) {
                currentQuestion++;
                loadQuestion();
            }
        });

        // Move to the previous question
        prevBtn.addEventListener('click', () => {
            if (currentQuestion > 0) {
                currentQuestion--;
                loadQuestion();
            }
        });

        // Submit the quiz
        submitBtn.addEventListener('click', () => {
            clearInterval(timerInterval);
            calculateScore();
            showResults();
        });

        // Calculate the final score
        function calculateScore() {
            score = 0;
            correctCount = 0;
            incorrectCount = 0;
            
            quizData.forEach((question, index) => {
                if (selectedOptions[index] === question.answer) {
                    score++;
                    correctCount++;
                } else if (selectedOptions[index] !== null) {
                    incorrectCount++;
                }
            });
        }

        // Show the results screen
        function showResults() {
            questionContainer.style.display = 'none';
            scoreContainer.style.display = 'block';
            
            scoreValueElement.textContent = `${score}/${quizData.length}`;
            updateStats();
            
            // Set score message
            const percentage = (score / quizData.length) * 100;
            let message = "";
            
            if (percentage >= 90) {
                message = "Outstanding! You're a quiz master!";
            } else if (percentage >= 70) {
                message = "Great job! You know your stuff!";
            } else if (percentage >= 50) {
                message = "Good effort! Keep learning!";
            } else {
                message = "You can do better! Try again.";
            }
            
            scoreTextElement.textContent = message;
        }

        // Restart the quiz
        restartBtn.addEventListener('click', () => {
            currentQuestion = 0;
            score = 0;
            selectedOptions = new Array(quizData.length).fill(null);
            correctCount = 0;
            incorrectCount = 0;
            
            scoreContainer.style.display = 'none';
            questionContainer.style.display = 'block';
            
            initQuiz();
            loadQuestion();
        });

        // Initialize the quiz when page loads
        window.addEventListener('DOMContentLoaded', initQuiz);