document.addEventListener("DOMContentLoaded", function () {
  const fetchDataButton = document.getElementById("fetch-data");
  fetchDataButton.addEventListener("click", function () {
    fetchDataButton.style.display = "none"; // Hide the button
    // eslint-disable-next-line no-undef
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      console.log("Clicked", tabs[0].url);
      const currentUrl = tabs[0].url;
      window.postMessage(
        { type: "EXTENSION_CLICKED", profileUrl: currentUrl },
        "*"
      );
    });
  });
});


