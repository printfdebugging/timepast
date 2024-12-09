# TimePast

### TODO
- [ ] later create an account on the chrome web store and from there add the key.

A simple chrome extension which helps you look at your google calendar from a different perspective.
Well.. how many hours am I working, how much time goes to sports and fittness. What's the trend over
the last year? Am I sleeping more, or am I neglecting my health.

### LSP completions for chrome-types

I use neovim, so will be documenting for that. 
  - get typescript-language-server up and running by using `mason` and `nvim-lspconfig`.
  - have some completion popup framework like `nvim-cmp`.
  - then download the chrome types npm package using `npm install --save-dev @types/chrome`.

That's all! As soon as I did that, I started getting autocompletion suggestions for chrome types.

### A very important lesson I learnt as a developer

I felt as if I wasted 2 hours trying to create a new tab (`chrome.action.onClicked.addListener(tabs => {...})`) when the user
clicks on the extension icon. The code was clearly mentioned on the tutorial page but I managed to create a mess somehow. But
then it hit me, this is how we learn anything. At first, we are really inefficient, then we start getting a hang of it.. and then
as we work on it, we become experts at that thing.

I guess then the only skill required as a beginner is to stick around for some time, **to wait for the bud to blossom**, when 
things start clicking. *It's important to not have unrealistic expectations when just starting out*.

### Sources consulted for this project

- [Hello World extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)
- [Run scripts on every page](https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-on-every-tab)
- [Inject scripts into the active tab](https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-activetab)
- [Manage tabs](https://developer.chrome.com/docs/extensions/get-started/tutorial/popup-tabs-manager)
- [OAuth 2.0: authenticate users with Google](https://developer.chrome.com/docs/extensions/how-to/integrate/oauth)
- [javascript - How to write events to Google Calendar in Chrome Extension? - Stack Overflow](https://stackoverflow.com/questions/74440654/how-to-write-events-to-google-calendar-in-chrome-extension)
- [Publish in the Chrome Web Store](https://developer.chrome.com/docs/webstore/publish)
- Icons provided by [Icons8](https://icons8.com). Thanks! :)
