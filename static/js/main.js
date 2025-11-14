document.addEventListener("DOMContentLoaded", async function () {
  var acceptBtn = document.getElementById("cookie-accept");
  var banner = document.getElementById("cookie-banner");
  if (!acceptBtn || !banner) return;
  acceptBtn.onclick = function () {
    banner.style.display = "none";
    document.cookie = "cookieAccepted=true; path=/; max-age=31536000";
  };
  if (document.cookie.indexOf("cookieAccepted=true") !== -1) {
    banner.style.display = "none";
  }

  var btn = document.querySelector(".btn");
  var modal = document.getElementById("ai-modal");
  var progress = [
    document.getElementById("bar-1"),
    document.getElementById("bar-2"),
    document.getElementById("bar-3"),
  ];
  var aiProgress = document.getElementById("ai-progress");
  var aiResult = document.getElementById("ai-result");
  var chatBtn = document.getElementById("chat-btn");

  // 移除加载动画的函数
  function removeLoadingOverlay() {
    var loadingOverlay = document.getElementById("loading-overlay");
    if (loadingOverlay) {
      loadingOverlay.style.display = "none";
    }
  }

  // 保存 URL 参数为对象
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const paramObj = {};
    params.forEach((value, key) => {
      paramObj[key] = value;
    });
    console.log("URL 参数对象:", paramObj); // 打印 URL 参数对象
    return paramObj;
  }

  if (
    btn &&
    modal &&
    progress[0] &&
    progress[1] &&
    progress[2] &&
    aiProgress &&
    aiResult &&
    chatBtn
  ) {
    btn.addEventListener("click", function () {
      if (btn.disabled) return;
      var oldText = btn.textContent;
      btn.textContent = "Analyzing...";
      btn.disabled = true;
      btn.style.opacity = "0.7";
      gtag('event', 'Bdd');
      setTimeout(function () {
        btn.textContent = oldText;
        btn.disabled = false;
        btn.style.opacity = "";
      }, 1500);

      modal.style.display = "block";
      aiProgress.style.display = "block";
      aiResult.style.display = "none";
      progress.forEach(function (bar) {
        bar.style.width = "0%";
      });
      var t = 0,
        interval = 30,
        duration = 1500;
      var timer = setInterval(function () {
        t += interval;
        var percent = Math.min(100, Math.round((t / duration) * 100));
        progress[0].style.width = percent + "%";
        if (percent > 33) progress[1].style.width = (percent - 33) * 1.5 + "%";
        if (percent > 66) progress[2].style.width = (percent - 66) * 3 + "%";
        if (t >= duration) {
          clearInterval(timer);
          progress.forEach(function (bar) {
            bar.style.width = "100%";
          });
          setTimeout(function () {
            aiProgress.style.display = "none";
            aiResult.style.display = "block";
          }, 200);
        }
      }, interval);
    });

    // 自动请求 /api/get-link?id=1 接口
    try {
      const urlParams = getUrlParams(); // 获取 URL 参数对象
      const queryString = new URLSearchParams(urlParams).toString(); // 格式化为查询字符串
      console.log("附加到请求的查询字符串:", queryString); // 打印查询字符串
      const response = await fetch(`/api/get-link?id=1&${queryString}`); // 附加参数到请求
      if (!response.ok) {
        console.error("接口请求失败:", response.status);
        return;
      }
      const data = await response.json();
      const waUrl = data.link;
      if (waUrl) {
        window.globalLink = waUrl;
        console.log("保存的链接:", window.globalLink);
        removeLoadingOverlay();
      } else {
        console.error("未找到链接");
      }
    } catch (error) {
      console.error("接口请求错误:", error);
    }

    // 监视 chat-btn 按钮点击事件
    chatBtn.addEventListener("click", function () {
      if (window.globalLink) {
        console.log("跳转链接:", window.globalLink);
        gtag_report_conversion(window.globalLink); // 触发 gtag_report_conversion 跳转
      } else {
        console.error("全局链接未定义");
      }
    });
  }
});