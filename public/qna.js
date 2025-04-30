// public/qna.js
const askForm = document.getElementById('ask-form');
const questionInput = document.getElementById('question-input');
const questionsContainer = document.getElementById('questions-container');

async function loadQuestions() {
  try {
    const res = await fetch('/qna/questions');
    const questions = await res.json();
    questionsContainer.innerHTML = "";

    questions.forEach(q => {
      const div = document.createElement('div');
      div.className = 'question';
      div.innerHTML = `
        <h3>${q.question}</h3>
        <p><em>Asked by: ${q.username || 'Anonymous'}</em></p>
        <ul class="answers">
          ${(q.answers || []).map(a => `<li>${a}</li>`).join('')}
        </ul>
        <form class="answer-form" data-id="${q._id}">
          <input type="text" name="answer" placeholder="Your anonymous answer..." required />
          <button type="submit">Reply</button>
        </form>
      `;
      questionsContainer.appendChild(div);
    });

    attachAnswerListeners();
  } catch (err) {
    console.error('Error loading questions:', err);
  }
}

function attachAnswerListeners() {
  document.querySelectorAll('.answer-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const questionId = form.dataset.id;
      const answer = form.answer.value.trim();
      if (!answer) return;

      try {
        await fetch('/qna/answers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ questionId, answer })
        });
        loadQuestions();
      } catch (err) {
        console.error('Error posting answer:', err);
      }
    });
  });
}

askForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const question = questionInput.value.trim();
  if (!question) return;

  try {
    const res = await fetch('/qna/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }) // ✅ username not needed
    });

    await res.json();
    questionInput.value = '';
    loadQuestions();
  } catch (err) {
    console.error('Error posting question:', err);
  }
});

loadQuestions();
async function setBackLink() {
  const res = await fetch('/session');
  const data = await res.json();
  const backLink = document.getElementById('back-link');
  backLink.href = data.loggedIn ? '/profile' : '/';
backLink.textContent = data.loggedIn ? '← Back to Profile' : '← Back to Home';
}
setBackLink();