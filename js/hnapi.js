// object to store articles
var storyObj = {};
/**
 * xhr - makes an ajax request to given url
 * @param  {string} url the server (file) location
 * @param  {object} cb  callback
 * @return {object}     returns a JSON object
 */
function xhr(url, cb) {
  // create an instance of an object
  var xmlHttp = new XMLHttpRequest();
  // contains the event handler to be called when the readystatechange event is fired
  xmlHttp.onreadystatechange = function() {
    // check to see if all is OK
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      cb(xmlHttp.responseText);
  }
  // Specifies the type of request
  xmlHttp.open("GET", url, true);
  // after the request header, nothing is being sent to server
  xmlHttp.send(null);
}

/**
 * newStories - get all new stories
 *
 * @param  {object} res responseText
 * @return {object}     parsed JSON object
 */
function newStories(res) {
  var newV0 = JSON.parse(res);
  for (var i = 0; i < 30; i++) {
    var storyID = newV0[i];
    xhr(`https://hacker-news.firebaseio.com/v0/item/${storyID}.json?print=pretty`, paintDOM);
  }
}

function init() {
  xhr('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty', newStories)
}

/**
 * paintDOM - adds information to the DOM
 *
 * @param  {object} res responseText
 * @return {type}     description
 */
function paintDOM(res) {
  var newV0 = JSON.parse(res);
  // add adds to the story object hash
  storyObj[newV0.id] = newV0;
  // counter to keep track of number of objects
  var counter = Object.keys(storyObj).length;
  // append to the DOM
  $('#news').append(
    `<p class="item">
        <span id='score'>${counter}.</span>
        <span id='vote'>
          <img id='vote' src="img/grayarrow2x.gif">
        </span>
        <a href="${newV0.url}">${newV0.title}</a>
        <a href="newV0.url"><small>(${getBaseUrl(newV0.url)})</small></a>
        <br>
        <small id="subtext">
            <a class="sub" href="https://news.ycombinator.com/item?id=${newV0.id}">
            ${newV0.score}
            ${(newV0.score <= 1? 'point by': 'points by')} </a>
            <a class="sub" href="https://news.ycombinator.com/user?id=${newV0.by}">${newV0.by}</a>
            <a class="sub" href="https://news.ycombinator.com/item?id=${newV0.id}">${timeSince(newV0.time)}</a>
            <a class="sub" id="hide" href="#">| hide |</a>  commments
        </small>
    </p>`);
}
// run
init();

// source: stackoverflow
function timeSince(date) {
  var seconds = Math.floor(((new Date().getTime() / 1000) - date)),
    interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + " years ago";
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + " minutes ago";
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return interval + " days ago";
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return interval + " hours ago";
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + " minutes ago ";
  return Math.floor(seconds) + " seconds ago";
}

/**
 * var getBaseUrl - parse url string and return base url
 *
 * @param  {string} url the url address
 * @return {string}     return base url
 */
function getBaseUrl(url) {
  var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
  var parts = parse_url.exec(url);
  var result = parts[3];
  return result;
};
