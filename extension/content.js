// The floating hint element

// TODO: Add Shortcut to trigger popup and display kbd keys here
const tip = document.createElement('div');
tip.innerHTML = '❓ Stuck? Use TryHackGuide from the "🧩" in the top right';
tip.style.position = 'fixed';
tip.style.bottom = '20px';
tip.style.left = '20px';
tip.style.backgroundColor = '#333';
tip.style.color = '#fff';
tip.style.padding = '15px';
tip.style.borderRadius = '5px';
tip.style.cursor = 'pointer';
tip.style.zIndex = '9999';
tip.style.fontSize = '16px'; 
document.body.appendChild(tip);
