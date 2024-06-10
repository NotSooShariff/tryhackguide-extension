document.addEventListener('DOMContentLoaded', async () => {
  const messageEl = document.getElementById('message');
  const backToHackEl = document.getElementById('backToHack');
  const TIMEOUT_DURATION = 5000; 
  
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tab = tabs[0];
    const url = new URL(tab.url);

    if (!url.href.startsWith('https://tryhackme.com/r/room/')) {
      displayNotInRoom();
      return;
    }

    const timeoutId = setTimeout(() => {
      displayRoomNotFound();
    }, TIMEOUT_DURATION);

    chrome.runtime.sendMessage({ action: "fetchRoomInfo", url: tab.url }, response => {
      clearTimeout(timeoutId); 

      if (response.success) {
        if (response.data.detail === "Room not found") {
          displayRoomNotFound();
        } else {
          displayRoomInfo(response.data);
        }
      } else {
        displayRoomNotFound();
      }
    });
  });

  function displayRoomInfo(room) {
    const contentEl = document.getElementById('content');
    console.log('Displaying room info for:', room);
    contentEl.innerHTML = `
      <h2 class="text-2xl font-bold mb-4">${room.name}</h2>
      <p class="mb-4">${room.description}</p>
      <a href="${room.videos[0].url}" target="_blank" class="block w-full mb-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-center">🎥 Watch Video</a>
      <a href="${room.writeups[0].url}" target="_blank" class="block w-full mb-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-center">📝 View Writeup</a>
      <div id="tasks">
        ${room.tasks.map((task, index) => `
          <div class="mb-4">
            <button id="task-${index}" class="task-button w-full text-left px-4 py-2 bg-gray-800 rounded flex justify-between items-center">
              ${task.title}
              <span id="arrow-${index}" class="ml-2">▶️</span>
            </button>
            <div id="task-details-${index}" class="task-details hidden mt-2 px-4 py-2 bg-gray-700 rounded">
              <p>${task.description}</p>
              <ul class="mt-2">
                ${task.questions.map((question, qIndex) => `
                  <li class="mt-2">
                    <strong>Q${question.number}:</strong> ${question.question}
                    <div class="flex items-center mt-2 bg-gray-800 rounded p-2">
                      <span class="solution-text flex-grow">${question.solution}</span>
                      <button id="copy-${index}-${qIndex}" class="copy-button ml-2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded">📋</button>
                    </div>
                  </li>
                `).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    room.tasks.forEach((task, index) => {
      const taskButton = document.getElementById(`task-${index}`);
      const taskDetails = document.getElementById(`task-details-${index}`);
      const arrow = document.getElementById(`arrow-${index}`);
      taskButton.addEventListener('click', () => {
        taskDetails.classList.toggle('hidden');
        arrow.textContent = taskDetails.classList.contains('hidden') ? '▶️' : '🔽';
      });

      task.questions.forEach((question, qIndex) => {
        const copyButton = document.getElementById(`copy-${index}-${qIndex}`);
        copyButton.addEventListener('click', () => {
          const solutionText = question.solution;
          navigator.clipboard.writeText(solutionText).then(() => {
            copyButton.textContent = '✅';
            setTimeout(() => {
              copyButton.textContent = '📋';
            }, 2000);
          }).catch(err => {
            console.error('Failed to copy: ', err);
          });
        });
      });
    });
  }

  function displayRoomNotFound() {
    const contentEl = document.getElementById('content');
    contentEl.innerHTML = `
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">😢</div>
        <h2 class="text-2xl font-bold mb-2">Sorry, we don't have that room yet.</h2>
        <p class="mb-4">Please submit the solution to us if you want to get it featured here.</p>
        <a href="https://x.com" target="_blank" class="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-center">Submit Solution</a>
        <p class="mt-4">See an error? <a href="https://x.com" target="_blank" class="underline text-blue-600">Report it to us</a></p>
      </div>
    `;
  }

  function displayNotInRoom() {
    messageEl.innerHTML = `
      <div class="text-center mb-8">
        <div class="text-6xl mb-4">🔒</div>
        <h2 class="text-2xl font-bold mb-2">Oops! You're not on a TryHackMe room.</h2>
        <p class="mb-4">No worries! Dive into our exciting hacktivities and start your journey.</p>
        <a href="https://tryhackme.com/r/hacktivities" target="_blank" class="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-center text-white">Explore Hacktivities</a>
      </div>
    `;
  }
});
