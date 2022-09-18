window.onload = function(){    
    const scriptTag = document.createElement("script");
    scriptTag.src = chrome.runtime.getURL("./analytics-override.js");
    scriptTag.type = "text/javascript";
    document.head.appendChild(scriptTag);
}