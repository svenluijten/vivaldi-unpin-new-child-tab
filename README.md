# Unpin New Child Tab
A tiny extension for [Vivaldi](https://vivaldi.net) that stops new tabs from inheriting the pinned state of the tab they were opened from.

## The problem

Vivaldi treats a tab opened from a pinned tab as a *related* tab, and part of that relationship is inheriting the pinned state. In practice this means:

1. You pin a page.
2. You middle-click (or right-click → **Open link in new tab**) a link on the pinned page.
3. The new tab opens **pinned**, wedged into your strip of pinned tabs.

Right now (as of version `8.1.4087.64`), Vivaldi has no setting for this. Changing **Settings → Tabs → New Tab Position** away from *As Related Tab* sometimes helps, because it severs the parent/child relationship, but it also changes where every new tab lands. This extension fixes only the specific thing that's wrong.

## What it does

It listens for tab creation. When a new tab appears that is both _pinned_ and _has an opener that is itself pinned_, it unpins the new tab.

There is a brief window of about a single frame where the tab exists as pinned before it is corrected. You may occasionally notice a flicker in the tab strip. This is unavoidable: the extension API only exposes tab creation after the fact, so there is no way to intercept the pinned state before it is applied.

### What it does not do

- It does not touch tab stacks, tab order, or new tab position.
- It does not read, modify, or transmit page content. It never requests host permissions, so it cannot see any page you visit.
- It does not run on tabs opened from unpinned tabs, since there is nothing to correct.

## Installation

The extension is not on the Chrome Web Store, so it is loaded unpacked.

1. Clone or download this repository to a permanent location. Vivaldi loads unpacked extensions from disk on every startup, so if you delete or move the folder the extension will disappear.

```sh
git clone https://github.com/svenluijten/vivaldi-unpin-new-child-tab.git ~/.local/share/vivaldi-extensions/unpin-new-child-tab
```

2. Open `vivaldi://extensions` in Vivaldi.
3. Enable **Developer mode** using the toggle in the top-right corner.
4. Click **Load unpacked** and select the repository folder containing `manifest.json`.
5. Confirm that **Unpin New Child Tab** appears in the list and is enabled.

No restart is required. Open a pinned tab, middle-click a link in it, and the new tab should land unpinned at the end of the strip.

### Compatibility

Manifest V3, so it needs Vivaldi 5.x or newer (any build on a modern Chromium base). It also works unmodified in Chrome, Edge, Brave, and other Chromium browsers, though those don't exhibit the pinned-inheritance behaviour, so it will simply do nothing there.

## Permissions

The extension requests exactly one permission:

- **`tabs`**: required to read a new tab's `pinned` and `openerTabId` properties, to look up the opener, and to call `chrome.tabs.update()` to unpin. Note that this permission also grants access to tab URLs and titles; the extension does not use them. You can verify [the source](./background.js) yourself in about 30 seconds.

## Troubleshooting

**New tabs are still pinned.** Check that the extension is enabled at `vivaldi://extensions`, then click its **service worker** link to open the console and look for errors. MV3 service workers are terminated when idle and woken by events, so an empty console is normal until a tab is created.

**Tabs I pin myself get immediately unpinned.** This shouldn't happen, since manually pinned tabs have no `openerTabId`. If it does, please open an issue with your Vivaldi version.

**The extension vanished after a restart.** The folder was moved or deleted. Unpacked extensions are loaded from their original path every time.
