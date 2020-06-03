/* eslint-disable no-undef */
chrome.devtools.panels.elements.createSidebarPane("Domments",
    function(sidebar) {
        sidebar.setPage("index.html");
        sidebar.setHeight("8ex");
});