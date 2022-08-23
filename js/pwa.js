if ( "serviceWorker" in navigator ) {
    navigator.serviceWorker.register("sw3.js").then(function(registration) {
        console.log("Service worker registered with scope:", registration.scope);
    }).catch(function(err) {
        console.log("Service worker registration failed:", err);
    });
}