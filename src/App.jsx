import { useState, useEffect } from "react";
import questions from "./questions";
import Confetti from "react-confetti";

// note: saving change to trigger commit (no functional change)

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

const App = () => {
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  useEffect(() => {
    setShuffledQuestions(shuffleArray(questions));
  }, []);

  const handleAnswerClick = (index) => {
    if (isAnswered || isFinished) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === shuffledQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextClick = () => {
  if (currentQuestion < shuffledQuestions.length - 1) {
    setCurrentQuestion(currentQuestion + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
  } else {
    setIsFinished(true);

    // Check for perfect score
    const gotLastCorrect = selectedAnswer === currentQ.correctAnswer;
    if (score + (selectedAnswer === currentQ.correctAnswer ? 1 : 0) === shuffledQuestions.length) {
      setShowCelebration(true);
    }
  }
};


  const handleReset = () => {
    setShuffledQuestions(shuffleArray(questions));
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setIsFinished(false);
    setShowCelebration(false);
};

  if (shuffledQuestions.length === 0) return null;

  const currentQ = shuffledQuestions[currentQuestion];
  const options = currentQ.options;

  return (
    <>
      <div className="card-container">
        <div className="header">
          <h1>The Ultimate Geography Quiz!</h1>

          {!isFinished ? (
            <p>
              {currentQuestion + 1}: {currentQ.question}
            </p>
          ) : (
            <p>
              Quiz Finished! Your Score: {score}/{shuffledQuestions.length}
            </p>
          )}
        </div>
          {showCelebration && <Confetti />}

        {!isFinished && (
          <ul className="questions">
            {options.map((option, index) => {
              let className = "";

              if (isAnswered) {
                if (index === currentQ.correctAnswer) {
                  className = "correct";
                } else if (index === selectedAnswer) {
                  className = "incorrect";
                }
              }

              return (
                <li
                  key={index}
                  className={className}
                  onClick={() => handleAnswerClick(index)}
                >
                  {option}
                </li>
              );
            })}
          </ul>
        )}

        {!isFinished ? (
          currentQuestion === shuffledQuestions.length - 1 ? (
            <button onClick={handleNextClick}>Finish Quiz</button>
          ) : (
            <button onClick={handleNextClick}>Next Question</button>
          )
        ) : (
          
          <button onClick={handleReset}>Reset Quiz</button>
        )}
      </div>
    </>
  );
};

export default App;
