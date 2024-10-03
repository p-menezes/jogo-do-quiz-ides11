const quizData = [
  //1ª questão  
  {
      question: "Qual é a capital da França?",
      answers: ["Paris", "Roma", "Berlim", "Madri"],
      correct: 0,
    },
    //2ª questão
    {
      question: "Quanto é 2 + 2?",
      answers: ["3", "4", "5", "6"],
      correct: 1,
    },
    //3ª questão
    {
      question: "O que é CSS?",
      answers: ["fff", "hhhh", "Estilo", "jjjj"],
      correct: 2,
    },
    // Adicione mais perguntas aqui!
  ];
  
  let shuffledQuestions, currentQuestionIndex, score, startTime;
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
  
  // Elementos do DOM
  const startScreen = document.getElementById("start-screen");
  const quizScreen = document.getElementById("quiz-screen");
  const resultScreen = document.getElementById("result-screen");
  const questionElement = document.getElementById("question");
  const answersElement = document.getElementById("answers");
  const nextButton = document.getElementById("next-btn");
  const finalScore = document.getElementById("final-score");
  const finalTime = document.getElementById("final-time");
  const leaderboardElement = document.getElementById("leaderboard");
  const playerNameInput = document.getElementById("player-name");
  
  document.getElementById("start-quiz").addEventListener("click", startQuiz);
  document.getElementById("restart-quiz").addEventListener("click", restartQuiz);
  nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    setNextQuestion();
  });
  
  // Função para iniciar o quiz
  function startQuiz() {
    const playerName = playerNameInput.value.trim();
    if (!playerName) {
      alert("Por favor, insira seu nome.");
      return;
    }
  
    // Preparação para o quiz
    startScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    shuffledQuestions = quizData.sort(() => Math.random() - 0.5).slice(0, 10);
    currentQuestionIndex = 0;
    score = 0;
    startTime = new Date();
    setNextQuestion();
  }
  
  // Função para exibir próxima pergunta
  function setNextQuestion() {
    resetState();
    if (currentQuestionIndex < shuffledQuestions.length) {
      showQuestion(shuffledQuestions[currentQuestionIndex]);
    } else {
      endQuiz();
    }
  }
  
  // Função para exibir uma pergunta
  function showQuestion(question) {
    questionElement.textContent = question.question;
    question.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.textContent = answer;
      button.addEventListener("click", () => selectAnswer(index, question.correct));
      answersElement.appendChild(button);
    });
  }
  
  // Função para selecionar a resposta
  function selectAnswer(selectedIndex, correctIndex) {
    const buttons = answersElement.getElementsByTagName("button");
    buttons[correctIndex].classList.add("correct");
    if (selectedIndex !== correctIndex) {
      buttons[selectedIndex].classList.add("incorrect");
    } else {
      score++;
    }
    Array.from(buttons).forEach((button) => button.disabled = true);
    nextButton.classList.remove("hidden");
  }
  
  // Função para resetar o estado
  function resetState() {
    nextButton.classList.add("hidden");
    answersElement.innerHTML = "";
  }
  
  // Função para finalizar o quiz
  function endQuiz() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");
    const totalTime = Math.floor((new Date() - startTime) / 1000);
    finalScore.textContent = score;
    finalTime.textContent = totalTime;
  
    // Atualiza o ranking
    const playerName = playerNameInput.value.trim();
    leaderboard.push({ name: playerName, score, time: totalTime });
    leaderboard.sort((a, b) => b.score - a.score || a.time - b.time);
    leaderboard = leaderboard.slice(0, 10);
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    updateLeaderboard();
  }
  
  // Função para atualizar a classificação
  function updateLeaderboard() {
    leaderboardElement.innerHTML = leaderboard
      .map((player) => `<li>${player.name} - ${player.score} pontos - ${player.time} s</li>`)
      .join("");
  }
  
  // Função para reiniciar o quiz
  function restartQuiz() {
    resultScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
    playerNameInput.value = "";
  }
  
  // Atualiza a classificação ao carregar a página
  updateLeaderboard();
  