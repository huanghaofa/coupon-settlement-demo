(function () {
  'use strict';

  window.Pages = window.Pages || {};

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') window.AppUtils.closeFloatingPanels();
  });

  document.addEventListener('click', function (event) {
    if (event.target.matches('.modal-overlay, .drawer-overlay')) {
      event.target.remove();
    }
  });
})();
