chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "fetchRoomInfo") {
      const apiURL = `https://tryhackme.api-cloud.one/room_by_url?room_url=${encodeURIComponent(request.url)}`;
      console.log(`Fetching data from: ${apiURL}`);
  
      fetch(apiURL)
        .then(response => {
          console.log(`Response status: ${response.status}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log('Received data:', data);
          sendResponse({ success: true, data: data });
        })
        .catch(error => {
          console.error('Fetch error:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true; 
    }
  });

chrome.commands.onCommand.addListener(function(command) {
    if (command === 'toggle-popup') {
      chrome.browserAction.getPopup({}, function(popup) {
        if (popup) {
          chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, { code: 'document.dispatchEvent(new CustomEvent("TryHackGuideTogglePopup"))' });
          });
        }
      });
    }
  });
  