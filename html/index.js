// https://github.com/bddjr/ADScreenPlayer

/// <reference path="../global.d.ts" />

window.addEventListener("keyup", (event) => {
  if (event.code === "F12") {
    window.electronAPI.ipcRendererSend("openOrCloseDevTools");
  }
});

const VideoNames = /**@type {string[]}*/ (
  window.electronAPI
    .ipcRendererSendSync("getVideoNames")
    .flatMap((i) => (i.endsWith(".json") ? [] : i))
);

console.log(VideoNames);

const config = window.electronAPI.ipcRendererSendSync("getConfig");

if (VideoNames.length > 0) {
  (async () => {
    var i = 0;
    while (true) {
      const divvideo = document.getElementById("divvideo");
      divvideo.innerHTML = "";
      const name = VideoNames[i];
      const v = document.createElement("video");
      if (v.canPlayType("video/" + name.slice(name.lastIndexOf(".") + 1))) {
        v.muted = config.muted;
        v.src = name;
        v.autoplay = true;
        if (config.debugmode) v.controls = true;
        divvideo.appendChild(v);
        await new Promise((resolve, reject) => {
          v.addEventListener("ended", resolve);
        });
      } else {
        const img = document.createElement("img");
        img.src = name;
        divvideo.appendChild(img);
        let t = 6000;
        try {
          let response = await fetch(
            name.slice(0, name.lastIndexOf(".")) + ".json"
          );
          t = (await response.json()).timeout * 1000;
        } catch (e) {}
        await new Promise((resolve, reject) => {
          setTimeout(resolve, t);
        });
      }
      i++;
      if (i >= VideoNames.length) {
        i = 0;
      }
    }
  })();
}

/** @type {NodeJS.Timeout} */
var mouseTime;
function mouseIn() {
  mouseTime = setTimeout(function () {
    document.body.style.cursor = "none";
  }, 3000);
}
function mouseOut() {
  clearTimeout(mouseTime);
  document.body.style.cursor = "";
}
function mouseMove() {
  mouseOut();
  mouseIn();
}

mouseIn();
document.body.addEventListener("mousemove", mouseMove);
document.body.addEventListener("mouseover", mouseMove);
document.body.addEventListener("mouseout", mouseMove);
document.body.addEventListener("mousedown", mouseOut);
document.body.addEventListener("mouseup", mouseMove);
