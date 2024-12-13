# TimePast

A simple firefox extension which helps you look at your google calendar from a different perspective.
Well.. how many hours am I working, how much time goes to sports and fittness. What's the trend over
the last year? Am I sleeping more, or am I neglecting my health.

### LSP completions for chrome-types

I use neovim, so will be documenting for that. 
  - get typescript-language-server up and running by using `mason` and `nvim-lspconfig`.
  - have some completion popup framework like `nvim-cmp`.
  - then download the chrome types npm package using `npm install --save-dev @types/chrome`.

That's all! As soon as I did that, I started getting autocompletion suggestions for chrome types.

### LSP completions on firefox

Create `jsconfig.json` file in the root of your extension project, that's all! Once done, the lsp
will start providing completions like `browser.browserAction.onClicked...`.

```json
// jsconfig.json
{"typeAcquisition": {"include": ["firefox-webext-browser"]}}
```

### Moving to firefox

I was having a hard time setting up extension ID and OAuth2 on chromium. I was getting a wierd error
(`Unchecked runtime.lastError: The user turned off browser signin`) probably because chromium doesn't
come with google chrome propriatery stuff.. 

Also to publish an extension on chrome, I was required to
have an account there. That's another reason why IMO firefox is a better choice, not to mention that 
most of the extensions on firefox add-ons page have a github repo link, so you can easily go
to the source and learn about how the extension is doing something. (this is not that common on chrome
extensions store)


### A very important lesson I learnt as a developer

I felt as if I wasted 2 hours trying to create a new tab (`chrome.action.onClicked.addListener(tabs => {...})`) when the user
clicks on the extension icon. The code was clearly mentioned on the tutorial page but I managed to create a mess somehow. But
then it hit me, this is how we learn anything. At first, we are really inefficient, then we start getting a hang of it.. and then
as we work on it, we become experts at that thing.

I guess then the only skill required as a beginner is to stick around for some time, **to wait for the bud to blossom**, when 
things start clicking. *It's important to not have unrealistic expectations when just starting out*.

### Resources related to extensions

- [Hello World extension](https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world)
- [Run scripts on every page](https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-on-every-tab)
- [Inject scripts into the active tab](https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-activetab)
- [Manage tabs](https://developer.chrome.com/docs/extensions/get-started/tutorial/popup-tabs-manager)
- [OAuth 2.0: authenticate users with Google](https://developer.chrome.com/docs/extensions/how-to/integrate/oauth)
- [javascript - How to write events to Google Calendar in Chrome Extension? - Stack Overflow](https://stackoverflow.com/questions/74440654/how-to-write-events-to-google-calendar-in-chrome-extension)
- [Publish in the Chrome Web Store](https://developer.chrome.com/docs/webstore/publish)
- https://github.com/mdn/webextensions-examples/tree/main/google-userinfo
- https://developers.google.com/identity/protocols/oauth2
- https://developers.google.com/identity/protocols/OAuth2UserAgent#tokeninfo-validation
- https://www.chartjs.org/docs/latest/getting-started/
- Icons provided by [Icons8](https://icons8.com). Thanks! :)

### Resources related to javascript

These  are really  quick tutorials/primers  which go  over varous  aspects of  the
language  like basic  syntax, networking  (request/response), async/await/promises
etc.
https://medium.com/weekly-webtips/javascript-the-survival-guide-41799d01d565
https://www.cs.cmu.edu/~aldrich/courses/17-396/js/
https://kinsta.com/knowledgebase/javascript-http-request/
https://developer.mozilla.org/en-US/docs/Web/API/Request
https://www.sitepoint.com/javascript-async-await/
https://developer.chrome.com/docs/extensions/get-started/tutorial/hello-world
https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-on-every-tab
https://developer.chrome.com/docs/extensions/get-started/tutorial/scripts-activetab
https://developer.chrome.com/docs/extensions/get-started/tutorial/popup-tabs-manager
https://developer.chrome.com/docs/extensions/how-to/integrate/oauth
https://stackoverflow.com/questions/74440654/how-to-write-events-to-google-calendar-in-chrome-extension
https://developer.chrome.com/docs/webstore/publish
