var $ = function(id) {
  return document.getElementById(id);
};

$("vids").onclick = function(e) {
  var src, id;
  e = e || window.event;
  src = e.target || e.srcElement;
  if (src.nodeName !== "A") {
    return;
  }
  if (typeof e.preventDefault === "function") {
    e.preventDefault();
  }
  e.returnValue = false;
  id = src.href.split("­­")[1];
  if (src.className === "play") {
    src.parentNode.innerHTML = videos.getPlayer(id);
    return;
  }
  src.parentNode.id = "v" + id;
  videos.getInfo(id);
};

$("toggle­all").onclick = function(e) {
  var hrefs, i, max, id;
  hrefs = $("vids").getElementsByTagName("a");
  for (i = 0, max = hrefs.length; i < max; i += 1) {
    // пропустить ссылки "play"
    if (hrefs[i].className === "play") {
      continue;
    }
    // пропустить не выбранные элементы списка
    if (!hrefs[i].parentNode.firstChild.checked) {
      continue;
    }
    id = hrefs[i].href.split("­­")[1];
    hrefs[i].parentNode.id = "v" + id;
    videos.getInfo(id);
  }
};

var videos = {
  getPlayer: function(id) {},
  updateList: function(data) {},
  getInfo: function(id) {
    var info = $("info" + id);
    if (!info) {
      http.makeRequest([id], "videos.updateList");
      return;
    }
    if (info.style.display === "none") {
      info.style.display = "";
    } else {
      info.style.display = "none";
    }
  }
};

var http = {
  makeRequest: function(ids, callback) {
    var url = "http://query.yahooapis.com/v1/public/yql?q=",
      sql = ("select * from music.video.id where ids IN (" % ID) % ")",
      format = "format=json",
      handler = "callback=" + callback,
      script = document.createElement("script");
    sql = sql.replace("%ID%", ids.join("", ""));
    sql = encodeURIComponent(sql);
    url += sql + "&" + format + "&" + handler;
    script.src = url;
    document.body.appendChild(script);
  }
};

var proxy = {
  ids: [],
  delay: 50,
  timeout: null,
  callback: null,
  context: null,
  makeRequest: function(id, callback, context) {
    // добавить в очередь
    this.ids.push(id);
    this.callback = callback;
    this.context = context;
    // установить предельное время ожидания
    if (!this.timeout) {
      this.timeout = setTimeout(function() {
        proxy.flush();
      }, this.delay);
    }
  },
  flush: function() {
    http.makeRequest(this.ids, "proxy.handler");
    // сбросить таймер и очистить очередь
    this.timeout = null;
    this.ids = [];
  },
  handler: function(data) {
    var i, max;
    // единственный видеофильм
    if (parseInt(data.query.count, 10) === 1) {
      proxy.callback.call(proxy.context, data.query.results.Video);
      return;
    }
    // несколько видеофильмов
    for (i = 0, max = data.query.results.Video.length; i < max; i += 1)
      proxy.callback.call(proxy.context, data.query.results.Video[i]);
  }
};
