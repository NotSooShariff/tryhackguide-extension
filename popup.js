document.addEventListener('DOMContentLoaded', async () => {
    const messageEl = document.getElementById('message');
    const backToHackEl = document.getElementById('backToHack');
  
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const tab = tabs[0];
      const url = new URL(tab.url);
  
      if (!url.hostname.includes('tryhackme.com')) {
        messageEl.textContent = "You're not on a tryhackme room";
        backToHackEl.classList.remove('hidden');
        backToHackEl.addEventListener('click', () => {
          chrome.tabs.update(tab.id, { url: 'https://tryhackme.com' });
        });
        return;
      }
  
      const apiURL = `https://tryhackme.api-cloud.one/room_by_url?room_url=${encodeURIComponent(tab.url)}`;
      
      try {
        const response = await fetch(apiURL);
        const data = await response.json();
        displayRoomInfo(data[0]);
      } catch (error) {
        messageEl.textContent = 'Failed to load room info.';
      }
    });
  
    function displayRoomInfo(room) {
      const contentEl = document.getElementById('content');
      contentEl.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">${room.name}</h2>
        <p class="mb-4">${room.description}</p>
        <a href="${room.videos[0].url}" target="_blank" class="block w-full mb-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-center">🎥 Watch Video</a>
        <a href="${room.writeups[0].url}" target="_blank" class="block w-full mb-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded text-center">📝 View Writeup</a>
        <div id="tasks">
          ${room.tasks.map(task => `
            <div class="mb-4">
              <button class="w-full text-left px-4 py-2 bg-gray-800 rounded" onclick="this.nextElementSibling.classList.toggle('hidden')">${task.title}</button>
              <div class="hidden mt-2 px-4 py-2 bg-gray-700 rounded">
                <p>${task.description}</p>
                <ul class="mt-2">
                  ${task.questions.map(question => `
                    <li class="mt-2">
                      <strong>Q${question.number}:</strong> ${question.question}
                      <br>
                      <em>Solution:</em> ${question.solution}
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>
          `).join('')}
        </div>
      `;
    }
  });
  