chrome.tabs.onCreated.addListener(async (tab) => {
  if (!tab.pinned || !tab.openerTabId) return;
  try {
    const opener = await chrome.tabs.get(tab.openerTabId);
    if (opener.pinned) await chrome.tabs.update(tab.id, { pinned: false });
  } catch { /* opener already gone */ }
});

