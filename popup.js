
document.addEventListener('DOMContentLoaded', function() {

  // First, check if the necessary Chrome APIs are available.
  if (chrome && chrome.storage && chrome.storage.local) {
    // --- APIs are available, proceed with normal logic. ---

    const toggleSwitch = document.getElementById('toggle-switch');
    const controls = document.getElementById('controls');
    const lockResizeSwitch = document.getElementById('lock-resize');

    // Load saved state from storage
    chrome.storage.local.get(['isEnabled', 'isResizeLocked'], function(result) {
      toggleSwitch.checked = result.isEnabled || false;
      controls.style.display = toggleSwitch.checked ? 'block' : 'none';
      lockResizeSwitch.checked = result.isResizeLocked || false;
    });

    // Add listener for the main toggle switch
    toggleSwitch.addEventListener('change', function() {
      const isEnabled = this.checked;
      chrome.storage.local.set({isEnabled: isEnabled});
      controls.style.display = isEnabled ? 'block' : 'none';
      sendMessage('toggle', isEnabled);
    });

    lockResizeSwitch.addEventListener('change', function() {
      const isResizeLocked = this.checked;
      chrome.storage.local.set({isResizeLocked: isResizeLocked});
      sendMessage('setResizeLocked', isResizeLocked);
    });

  } else {
    // --- APIs are NOT available, display an error message. ---

    document.body.innerHTML = '<h1>错误：无法访问浏览器功能。</h1><p>请尝试刷新插件或重启浏览器。</p>';
    console.error("Chrome Storage API was not available at the time of popup load.");
  }

  // This function sends messages to the content script.
  // It's defined outside the main logic to be accessible, but includes its own checks.
  function sendMessage(type, value) {
    if (chrome && chrome.tabs) {
       chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0] && tabs[0].id) {
          chrome.tabs.sendMessage(tabs[0].id, {type: type, value: value}, function(response) {
            if (chrome.runtime.lastError) {
              // This error is expected on pages where the content script can't run.
              // We can safely ignore it.
            }
          });
        }
      });
    }
  }
});
