import { useState, useEffect, useRef } from "react";
import questions from "./questions";
import Confetti from "react-confetti";
import confetti from "canvas-confetti"; 

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

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  
  const launchFirework = () => {
    const duration = 800;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const frame = () => {
      confetti({
        particleCount: 50,
        startVelocity: 40,
        spread: 60,
        origin: {
          x: Math.random(),
          y: randomInRange(0.1, 0.3),
        },
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  useEffect(() => {
    setShuffledQuestions(shuffleArray(questions));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

 
  if (shuffledQuestions.length === 0) {
    return <p>Loading quiz…</p>;
  }

  const currentQ = shuffledQuestions[currentQuestion];
  const options = currentQ.options;

  const handleAnswerClick = (index) => {
    if (isAnswered || isFinished) return;

    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === currentQ.correctAnswer) {
      setScore((s) => s + 1);
    }
  };

  const handleNextClick = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsFinished(true);

      
      if (score === shuffledQuestions.length) {
        setShowCelebration(true);

        
        launchFirework();
        setTimeout(launchFirework, 400);
        setTimeout(launchFirework, 800);
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
            <div
              className={`results-message ${
                score === shuffledQuestions.length ? "perfect-score" : ""
              }`}
            >
              {score === shuffledQuestions.length && (
              <h2 className="smashed-it">🎉 You smashed it! 🎉</h2>
          )}

            {score !== shuffledQuestions.length && ( 
              <h2 className="nice-try">Nice try, but you didn’t get a perfect score — try again!</h2>
               )}

              <p>
                Quiz Finished! Your Score: {score}/{shuffledQuestions.length}
              </p>
            </div>
          )}
        </div>

        
        {showCelebration && (
          <Confetti width={windowSize.width} height={windowSize.height} />
        )}

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
