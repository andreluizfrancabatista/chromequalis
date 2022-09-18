var _gaq = _gaq || [];
var _AnalyticsCode = 'UA-129511160-3';


_gaq.push(['_setAccount', _AnalyticsCode]);

_gaq.push(["_trackPageview", "/popup.html"]);

function trackButtonClick(e) {
  _gaq.push(['_trackEvent', e.target.id, 'clicked']);
}