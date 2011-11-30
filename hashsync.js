// hashsync.js
// By Atul Varma, 2011
//
// This is a really simple drop-in script that uses Richard Milewski's
// anonymous slide synchronization server [1] to sync the URL hash of
// any web page between a presenter and multiple viewers. It has been
// tested on Firefox, Safari, Chrome, and Internet Explorer 9.
//
// By default, this script does absolutely nothing. However, if there's
// a querystring parameter in the URL called 'syncMode', this script
// springs into action.
//
// If syncMode is 'control', then the user is assumed to be a presenter,
// and any time they change the URL hash, its new value is broadcast
// to all viewers.
//
// If syncMode is 'view', then the user is assumed to be a viewer, and
// their URL hash is updated as the presenter changes it.
//
// Thus this script can simply be dropped-in to any existing web page
// that uses a URL hash for navigation, such as Paul Rouget's DZSlides [2],
// and the page immediately becomes something that can be used in a
// remote presentation.
//
// Currently, an additional querystring parameter called 'syncKey'
// must also be provided, which is a unique identifier for
// the presenter's session. Just set it to something like
// your email or twitter username and you should be fine.
//
// Additionally, if you're the presenter and don't want others to
// easily take control themselves, you can supply a 'syncPass'
// parameter that contains a password for your session. Once your
// session is created, only a URL with the right syncPass can be
// used to control it.
//
// Here's an example of hashsync.js at work.
//
// The presenter, Atul, has a DZSlides-based presentation at this URL:
//
//   http://mozcamp2011.hksr.us/
//
// He simply drops a <script> tag pointing at hashsync.js into the
// presentation, and opens this URL in his browser:
//
//   http://mozcamp2011.hksr.us/?syncMode=control&syncKey=atulspreso
//
// Then he gives out this URL to a bunch of people in a conference call:
// 
//   http://mozcamp2011.hksr.us/?syncMode=view&syncKey=atulspreso
//
// Now anytime Atul uses the left/right arrow keys to change
// the current slide, everyone else on the call sees the slide change
// on their browser.
//
// [1] http://slides.netfools.com/
// [2] http://paulrouget.com/dzslides/

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
