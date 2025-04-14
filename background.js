chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.action === "getCookies" && request.domain) {
        chrome.cookies.getAll({ domain: request.domain }, function (cookies) {
            sendResponse(cookies); // Send only cookies for the requested domain
        });
        return true; // Keeps sendResponse active for async call
    }
});
