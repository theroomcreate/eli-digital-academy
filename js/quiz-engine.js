/**
 * ELI Quiz Engine
 * Renders quizzes, handles scoring, feedback, and retakes.
 */
const QuizEngine = {
  render(containerId, quizData, lessonId) {
    const container = document.getElementById(containerId);
    if (!container || !quizData || !quizData.length) {
      if (container) container.innerHTML = '<p>No quiz for this lesson.</p>';
      return;
    }
    const state = window.EliStorage.get();
    const previous = state.quizResults[lessonId];

    let current = 0, score = 0, answers = [];

    const renderQuestion = () => {
      const q = quizData[current];
      container.innerHTML = `
        <div class="quiz-container">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
            <span class="badge">Question ${current + 1} of ${quizData.length}</span>
            ${previous ? `<span class="badge">Best: ${previous.bestScore}%</span>` : ''}
          </div>
          <div class="quiz-question">${q.question}</div>
          <div class="quiz-options" id="quizOptions">
            ${q.options.map((opt, idx) => `
              <div class="quiz-option" data-index="${idx}">
                <div class="quiz-option-marker">${String.fromCharCode(65 + idx)}</div>
                <div>${opt}</div>
              </div>
            `).join('')}
          </div>
          <div id="quizFeedback"></div>
          <div style="margin-top:24px;display:flex;gap:12px;">
            <button class="btn btn-primary" id="quizSubmit" disabled>Check Answer</button>
            <button class="btn btn-outline" id="quizNext" style="display:none;">Next</button>
          </div>
        </div>
      `;
      bindOptions();
    };

    const bindOptions = () => {
      const opts = container.querySelectorAll('.quiz-option');
      let selected = null;
      opts.forEach(opt => {
        opt.addEventListener('click', () => {
          opts.forEach(o => o.classList.remove('selected'));
          opt.classList.add('selected');
          selected = parseInt(opt.dataset.index);
          container.querySelector('#quizSubmit').disabled = false;
        });
      });
      container.querySelector('#quizSubmit').addEventListener('click', () => {
        if (selected === null) return;
        const q = quizData[current];
        const correct = selected === q.correct;
        if (correct) score++;
        answers.push({ question: q.question, correct, selected, correctAnswer: q.options[q.correct] });
        opts.forEach((opt, idx) => {
          opt.classList.remove('selected');
          if (idx === q.correct) opt.classList.add('correct');
          else if (idx === selected && !correct) opt.classList.add('incorrect');
          opt.style.pointerEvents = 'none';
        });
        const feedback = container.querySelector('#quizFeedback');
        feedback.className = `quiz-feedback ${correct ? 'correct' : 'incorrect'}`;
        feedback.textContent = correct ? 'Correct! ' + (q.explanation || '') : `Incorrect. ${q.explanation || ''}`;
        container.querySelector('#quizSubmit').style.display = 'none';
        const nextBtn = container.querySelector('#quizNext');
        nextBtn.style.display = 'inline-flex';
        if (current === quizData.length - 1) nextBtn.textContent = 'Finish Quiz';
      });
      container.querySelector('#quizNext').addEventListener('click', () => {
        current++;
        if (current < quizData.length) {
          renderQuestion();
        } else {
          finishQuiz();
        }
      });
    };

    const finishQuiz = () => {
      const pct = Math.round((score / quizData.length) * 100);
      const passed = pct >= 70;
      window.EliStorage.saveQuiz(lessonId, pct, passed);
      container.innerHTML = `
        <div class="quiz-container" style="text-align:center;">
          <div style="font-size:3rem;margin-bottom:12px;">${passed ? '\1F389' : '\1F4AA'}</div>
          <h2>${passed ? 'Quiz Passed!' : 'Quiz Completed'}</h2>
          <p>You scored <strong>${pct}%</strong> (${score}/${quizData.length})</p>
          <p>${passed ? 'Great job! You passed this quiz.' : 'Review the lesson and try again to pass (70% required).'}</p>
          <div style="margin-top:20px;display:flex;gap:12px;justify-content:center;">
            <button class="btn btn-primary" id="quizRetake">Retake Quiz</button>
            <a href="course.html" class="btn btn-outline">Back to Course</a>
          </div>
        </div>
      `;
      container.querySelector('#quizRetake').addEventListener('click', () => {
        current = 0; score = 0; answers = []; renderQuestion();
      });
      if (passed) {
        window.EliUI.confetti();
        window.EliUI.toast('Quiz passed! +20 XP', 'success');
      } else {
        window.EliUI.toast('Keep practicing! You need 70% to pass.', 'warning');
      }
    };

    renderQuestion();
  }
};

window.EliQuiz = QuizEngine;
