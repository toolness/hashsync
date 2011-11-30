// hashsync.js
// By Atul Varma, 2011

(function() {
  "use strict";
  
  function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable)
        return unescape(pair[1]);
    }
  }

  function getJSON(params, cb) {
    var req;
    if (typeof(XDomainRequest) == "function") {
      // We're on IE. It also has weird caching heuristics, so
      // we'll add a random querystring argument to ensure that
      // the request really gets sent.
      req = new XDomainRequest();
      params.bypassCache = Math.random().toString();
    } else {
      req = new XMLHttpRequest();
    }
    req.onload = function() {
      cb(JSON.parse(req.responseText));
    };
    req.onerror = function() {
      cb(null);
    };
    var query = [];
    for (var name in params)
      query.push(name + "=" + escape(params[name]));
    req.open("get", SERVER_URL + "?" + query.join("&"));
    req.send();
  }

  function getUpdate() {
    getJSON({url: syncURL}, function(response) {
      if (response && response.sync == "ok" &&
          response.result != lastReceivedHash) {
        lastReceivedHash = response.result;
        window.location.hash = lastReceivedHash;
      }
    });
  }
  
  function sendUpdate() {
    getJSON({
      url: syncURL,
      control: syncPass,
      status: window.location.hash
    }, function(response) {});
  }
  
  var SERVER_URL = "http://slides.netfools.com/s5.php";
  var POLL_INTERVAL = 1500;
  
  var syncMode = getQueryVariable("syncMode");
  var syncPass = getQueryVariable("syncPass") || "no-password";
  var syncURL = getQueryVariable("syncKey");
  var lastReceivedHash;
  
  if (syncMode == "view") {
    setInterval(getUpdate, POLL_INTERVAL);
  } else if (syncMode == "control") {
    window.addEventListener("hashchange", sendUpdate, false);
    sendUpdate();
  }
})();
