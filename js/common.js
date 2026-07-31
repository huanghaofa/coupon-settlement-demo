(function () {
  'use strict';

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function money(value) {
    return '¥' + Number(value || 0).toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function statusClass(status) {
    if (status === '已提交E3S' || status === '启用') return 'success';
    if (status === '已冻结') return 'info';
    if (status === '停用') return 'muted';
    return 'warning';
  }

  function toast(message, type) {
    var root = document.getElementById('toast-root');
    if (!root) return;
    var el = document.createElement('div');
    el.className = 'toast toast-' + (type || 'success');
    el.textContent = message;
    root.appendChild(el);
    window.setTimeout(function () {
      el.classList.add('toast-out');
      window.setTimeout(function () { el.remove(); }, 240);
    }, 2200);
  }

  function closeFloatingPanels() {
    document.querySelectorAll('.modal-overlay, .drawer-overlay').forEach(function (el) {
      el.remove();
    });
  }

  window.AppUtils = {
    escapeHtml: escapeHtml,
    money: money,
    statusClass: statusClass,
    toast: toast,
    closeFloatingPanels: closeFloatingPanels
  };
})();
