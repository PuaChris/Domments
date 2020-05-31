/* eslint-disable no-undef */
chrome.devtools.panels.create(
    "Domments",
    "logo192.png",
    "index.html",
    function() {
        console.log('Creating Domments panel.');
    }
);