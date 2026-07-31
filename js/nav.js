(function () {
  'use strict';

  var config = null;
  var currentPage = 'report';

  function loadConfig() {
    return fetch('config/nav.json')
      .then(function (response) {
        if (!response.ok) throw new Error('导航配置加载失败');
        return response.json();
      })
      .then(function (data) {
        config = data;
        renderNav();
        var hashPage = window.location.hash.replace('#/', '');
        navigateToPage(window.Pages[hashPage] ? hashPage : currentPage);
      })
      .catch(function () {
        document.getElementById('main-nav').innerHTML = '<div style="padding:20px;color:#fff">请通过 HTTP 服务访问本项目。</div>';
      });
  }

  function renderNav() {
    var nav = document.getElementById('main-nav');
    nav.innerHTML = '<div class="sidebar-brand"><div class="brand-title"><span class="brand-mark">券</span><span>卡券结算管理</span></div><div class="brand-caption">SETTLEMENT</div></div>' +
      '<ul class="nav-list">' + config.menu.map(function (item) {
        return '<li><a class="nav-link" href="#/' + item.key + '" data-page="' + item.key + '"><span class="nav-icon">' + item.icon + '</span><span>' + item.label + '</span></a></li>';
      }).join('') + '</ul>' +
      '<div class="sidebar-note">静态部署演示版<br>业务数据均为 Mock 数据<br>无后端服务依赖</div>';

    nav.querySelectorAll('[data-page]').forEach(function (link) {
      link.addEventListener('click', function (event) {
        event.preventDefault();
        navigateToPage(link.dataset.page);
        if (window.innerWidth <= 760) nav.classList.remove('open');
      });
    });
  }

  function navigateToPage(pageKey) {
    var page = window.Pages[pageKey];
    if (!page) return;
    window.AppUtils.closeFloatingPanels();
    currentPage = pageKey;
    window.location.hash = '#/' + pageKey;
    document.getElementById('app').innerHTML = page.render();
    page.init();
    document.querySelectorAll('.nav-link').forEach(function (link) {
      link.classList.toggle('active', link.dataset.page === pageKey);
    });
    document.getElementById('app').focus({ preventScroll: true });
  }

  window.addEventListener('hashchange', function () {
    var pageKey = window.location.hash.replace('#/', '');
    if (pageKey && pageKey !== currentPage && window.Pages[pageKey]) navigateToPage(pageKey);
  });

  document.getElementById('sidebar-toggle').addEventListener('click', function () {
    document.getElementById('main-nav').classList.toggle('open');
  });

  window.navigateTo = navigateToPage;
  document.addEventListener('DOMContentLoaded', loadConfig);
})();
