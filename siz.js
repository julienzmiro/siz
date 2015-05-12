(function () {

  function init () {
    // Flush the event cache
    addEvent(window, 'unload', EventCache.flush);

    addEvent(window, 'resize', checkImages);

    checkImages();
  }

  function checkImages () {
    var i;
    var images = document.getElementsByClassName("siz");

    for (i = 0; i < images.length; ++i) {
      if (isImageScaledDown(images[i])) {
        images[i].className = images[i].className + " zoomable";
        addEvent(images[i], 'click', iClickHandler);
      }
    }
  }

  function isImageScaledDown (imgToCheck) {
    var imgNatWidth = imgToCheck.naturalWidth;
    var imgNatHeight = imgToCheck.naturalHeight;
    var imgDisWidth = imgToCheck.clientWidth;
    var imgDisHeight = imgToCheck.clientHeight;
    var result = null;
    if (imgNatWidth > imgDisWidth || imgNatHeight > imgDisHeight) {
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  function hideBodyContent () {
    var i;
    var body = document.getElementsByTagName("BODY")[0];
    var nodes = body.children;

    for (i = 0; i < nodes.length; ++i) {
      nodes[i].style.display = "none";
    }
  }

  function showBodyContent () {
    var i;
    var body = document.getElementsByTagName("BODY")[0];
    var nodes = body.children;

    for (i = 0; i < nodes.length; ++i) {
      nodes[i].style.display = "";
    }
  }

  function iClickHandler (e) {
    var el = this;
    var overlay = document.createElement("DIV");
    var image = el.cloneNode(true);
    var body = document.getElementsByTagName("BODY")[0];
    var marginL;
    var marginT;
    var scrollVal;
    var savedScroll = [window.scrollY, window.scrollX];

    hideBodyContent();

    image.className = "sizImg";
    image.style.top = (window.scrollY + window.innerHeight / 2) + "px";
    image.style.left = (body.clientWidth / 2) + "px";

    overlay.className = "sizOverlay";
    overlay.style.height = window.innerHeight + "px";
    overlay.style.width = window.innerWidth + "px";

    body.style.cursor = "zoom-out";

    body.appendChild(overlay);
    body.appendChild(image);

    if (window.innerWidth < image.naturalWidth) {
      marginL = (image.naturalWidth - window.innerWidth) / 2;
      image.style.marginLeft = marginL + "px";
    }

    if (window.innerHeight < image.naturalHeight) {
      marginT = (image.naturalHeight - window.innerHeight) / 2;
      image.style.marginTop = marginT + "px";
    }

    addEvent(overlay, 'click', function () {
      closeZoom(savedScroll);
    });
    addEvent(image, 'click', function () {
      closeZoom(savedScroll);
    });

    scrollVal = ((image.naturalWidth - window.innerWidth) / 2);
    window.scrollBy(scrollVal, 0);
  }

  function closeZoom () {
    var body = document.getElementsByTagName("BODY")[0];
    var o = document.getElementsByClassName("sizOverlay")[0];
    var i = document.getElementsByClassName("sizImg")[0];

    body.style.cursor = "";

    body.removeChild(o);
    body.removeChild(i);

    showBodyContent();

    window.scrollTo(scrollValue[1], scrollValue[0]);
  }

  // Cross browser get document size from http://james.padolsey.com/snippets/get-document-height-cross-browser/
  function getDocSize() {
      var d = document;
      var h = Math.max(d.body.scrollHeight, d.documentElement.scrollHeight, d.body.offsetHeight, d.documentElement.offsetHeight, d.body.clientHeight, d.documentElement.clientHeight);
      var w = Math.max(d.body.scrollWidth, d.documentElement.scrollWidth, d.body.offsetWidth, d.documentElement.offsetWidth, d.body.clientWidth, d.documentElement.clientWidth);
      return {
        height: h,
        width: w
      };
  }

  // Rock solid add event method by Dustin Diaz (http://dustindiaz.com/rock-solid-addevent)
  function addEvent (obj, type, fn) {
    if (obj.addEventListener) {
      obj.addEventListener( type, fn, false );
      EventCache.add(obj, type, fn);
    }
    else if (obj.attachEvent) {
      obj["e"+type+fn] = fn;
      obj[type+fn] = function() { obj["e"+type+fn]( window.event ); }
      obj.attachEvent( "on"+type, obj[type+fn] );
      EventCache.add(obj, type, fn);
    }
    else {
      obj["on"+type] = obj["e"+type+fn];
    }
  }

  // Store the event cache
  var EventCache = function () {
    var listEvents = [];
    return {
      listEvents : listEvents,
      add : function(node, sEventName, fHandler){
        listEvents.push(arguments);
      },
      flush : function(){
        var i, item;
        for(i = listEvents.length - 1; i >= 0; i = i - 1){
          item = listEvents[i];
          if(item[0].removeEventListener){
            item[0].removeEventListener(item[1], item[2], item[3]);
          };
          if(item[1].substring(0, 2) != "on"){
            item[1] = "on" + item[1];
          };
          if(item[0].detachEvent){
            item[0].detachEvent(item[1], item[2]);
          };
          item[0][item[1]] = null;
        };
      }
    };
  }();

  // Check wether or not the document is ready until it is ready
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
      init();
      clearInterval(readyStateCheckInterval);
    }
  }, 10);
})();
