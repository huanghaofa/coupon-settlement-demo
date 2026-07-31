(function () {
  'use strict';

  var U = window.AppUtils;
  var allRows = window.MockData.reportRows;
  var state = { keyword: '', channel: '', source: '', status: '' };

  function filteredRows() {
    return allRows.filter(function (row) {
      var keyword = state.keyword.toLowerCase();
      var haystack = [row.instanceId, row.couponName, row.orderNo, row.userVin, row.userPhone, row.userOneId].join('|').toLowerCase();
      return (!keyword || haystack.indexOf(keyword) > -1)
        && (!state.channel || row.writeoffChannel === state.channel)
        && (!state.source || row.writeoffSource === state.source)
        && (!state.status || row.status === state.status);
    });
  }

  function render() {
    var totalSettlement = allRows.reduce(function (sum, row) { return sum + row.settlementAmount; }, 0);
    var onlineCount = allRows.filter(function (row) { return row.writeoffChannel === '线上'; }).length;
    var frozenCount = allRows.filter(function (row) { return row.status === '已冻结' || row.status === '已提交E3S'; }).length;
    return '' +
      '<div class="page-heading">' +
        '<div><h1 class="page-title">实际结算报表</h1><p class="page-subtitle">按卡券实例记录结算结果；只有适用商品参与补贴计算。</p></div>' +
        '<div class="page-actions"><button class="btn" id="export-report">导出当前结果</button></div>' +
      '</div>' +
      '<div class="summary-grid">' +
        summaryCard('卡券实例', allRows.length + ' 张', '每个实例一条主记录') +
        summaryCard('线上核销', onlineCount + ' 张', '来源：商城') +
        summaryCard('已冻结 / 已提交', frozenCount + ' 张', '冻结后不再接受退款变更') +
        summaryCard('结算金额合计', U.money(totalSettlement), '演示数据口径') +
      '</div>' +
      '<section class="card process-card">' +
        '<div class="process-title">完整业务链路</div>' +
        '<div class="process-flow">' +
          processStep('1', '商城拆分优惠') + '<span class="process-arrow">→</span>' +
          processStep('2', '卡券中心汇总') + '<span class="process-arrow">→</span>' +
          processStep('3', '识别核销渠道') + '<span class="process-arrow">→</span>' +
          processStep('4', '按规则计算') + '<span class="process-arrow">→</span>' +
          processStep('5', '冻结后提交E3S') +
        '</div>' +
      '</section>' +
      '<section class="card filter-card">' +
        filterInput('keyword', '卡券实例 / 订单 / 用户', '请输入关键字') +
        filterSelect('channel', '核销渠道', ['', '线上', '线下']) +
        filterSelect('source', '核销来源', ['', '商城', 'E3S']) +
        filterSelect('status', '结算状态', ['', '待冻结', '已冻结', '已提交E3S']) +
        '<div class="filter-actions"><button class="btn btn-primary" id="query-report">查询</button><button class="btn" id="reset-report">重置</button></div>' +
      '</section>' +
      '<div class="notice"><span class="notice-icon">i</span><span>订单内并非所有商品都适用于卡券。商城必须按商品拆分并标记适用性；卡券中心仅汇总适用商品的商城商品单价、实际优惠金额和网点价。</span></div>' +
      '<section class="card report-card">' +
        '<div class="card-toolbar"><h2>实例结算明细</h2><span class="result-count" id="report-count"></span></div>' +
        '<div class="table-wrapper"><table class="report-table"><thead><tr>' +
          ['卡券实例号','卡券名称','卡券面值','VIN','手机号码','oneID','订单号','核销渠道','核销来源','适用商品数','适用商品商城价','实际优惠金额','适用商品网点价','结算基准','结算规则','结算金额','结算状态'].map(function (h) { return '<th>' + h + '</th>'; }).join('') +
        '</tr></thead><tbody id="report-body"></tbody></table></div>' +
        '<div class="footer-note">表格可横向滚动 · 点击卡券实例号查看商品拆分和计算过程</div>' +
      '</section>';
  }

  function summaryCard(label, value, meta) {
    return '<div class="card summary-card"><div class="summary-label">' + label + '</div><div class="summary-value">' + value + '</div><div class="summary-meta">' + meta + '</div></div>';
  }

  function processStep(number, label) {
    return '<div class="process-step"><span class="step-number">' + number + '</span><span>' + label + '</span></div>';
  }

  function filterInput(id, label, placeholder) {
    return '<div class="filter-group"><label for="' + id + '">' + label + '</label><input class="form-input" id="' + id + '" placeholder="' + placeholder + '"></div>';
  }

  function filterSelect(id, label, options) {
    return '<div class="filter-group"><label for="' + id + '">' + label + '</label><select class="form-select" id="' + id + '">' +
      options.map(function (option) { return '<option value="' + option + '">' + (option || '全部') + '</option>'; }).join('') +
      '</select></div>';
  }

  function init() {
    renderTable();
    document.getElementById('query-report').addEventListener('click', applyFilters);
    document.getElementById('reset-report').addEventListener('click', resetFilters);
    document.getElementById('export-report').addEventListener('click', function () {
      U.toast('静态演示：已生成当前筛选结果，共 ' + filteredRows().length + ' 条');
    });
    document.getElementById('keyword').addEventListener('keydown', function (event) {
      if (event.key === 'Enter') applyFilters();
    });
  }

  function applyFilters() {
    state.keyword = document.getElementById('keyword').value.trim();
    state.channel = document.getElementById('channel').value;
    state.source = document.getElementById('source').value;
    state.status = document.getElementById('status').value;
    renderTable();
  }

  function resetFilters() {
    state = { keyword: '', channel: '', source: '', status: '' };
    ['keyword', 'channel', 'source', 'status'].forEach(function (id) { document.getElementById(id).value = ''; });
    renderTable();
  }

  function renderTable() {
    var rows = filteredRows();
    var body = document.getElementById('report-body');
    document.getElementById('report-count').textContent = '共 ' + rows.length + ' 条';
    body.innerHTML = rows.length ? rows.map(rowHtml).join('') : '<tr><td colspan="17" style="text-align:center;padding:40px;color:#8d98a8">暂无匹配数据</td></tr>';
    body.querySelectorAll('[data-instance]').forEach(function (button) {
      button.addEventListener('click', function () { openDetail(button.dataset.instance); });
    });
  }

  function rowHtml(row) {
    return '<tr>' +
      '<td><button class="id-link" data-instance="' + U.escapeHtml(row.instanceId) + '">' + U.escapeHtml(row.instanceId) + '</button></td>' +
      '<td>' + U.escapeHtml(row.couponName) + '</td>' +
      '<td>' + U.money(row.couponFaceValue) + '</td>' +
      '<td>' + cell(row.userVin) + '</td><td>' + cell(row.userPhone) + '</td><td>' + cell(row.userOneId) + '</td>' +
      '<td>' + U.escapeHtml(row.orderNo) + '</td>' +
      '<td><span class="tag ' + (row.writeoffChannel === '线上' ? 'tag-info' : 'tag-purple') + '">' + row.writeoffChannel + '</span></td>' +
      '<td><span class="channel-cell"><span class="source-dot ' + (row.writeoffSource === 'E3S' ? 'offline' : '') + '"></span>' + row.writeoffSource + '</span></td>' +
      '<td>' + row.applicableGoodsCount + '</td>' +
      '<td>' + U.money(row.mallGoodsAmount) + '</td><td>' + U.money(row.actualDiscountAmount) + '</td><td>' + U.money(row.dealerPriceAmount) + '</td>' +
      '<td>' + row.settlementBasis + '</td><td>' + row.settlementRule + '</td>' +
      '<td class="money-strong">' + U.money(row.settlementAmount) + '</td>' +
      '<td><span class="tag tag-' + U.statusClass(row.status) + '">' + row.status + '</span></td>' +
    '</tr>';
  }

  function cell(value) {
    return value ? U.escapeHtml(value) : '<span class="empty-cell">—</span>';
  }

  function openDetail(instanceId) {
    var row = allRows.find(function (item) { return item.instanceId === instanceId; });
    if (!row) return;
    var overlay = document.createElement('div');
    overlay.className = 'drawer-overlay';
    overlay.innerHTML = '<aside class="drawer" role="dialog" aria-modal="true" aria-label="卡券实例结算详情">' +
      '<header class="drawer-header"><div><h2>结算实例详情</h2><div class="page-subtitle">' + row.instanceId + '</div></div><button class="icon-button" data-close>✕</button></header>' +
      '<div class="drawer-content">' +
        '<h3 class="section-title">实例信息</h3>' +
        '<div class="detail-grid">' +
          detailField('卡券名称', row.couponName) + detailField('订单号', row.orderNo) + detailField('核销时间', row.writeoffTime) +
          detailField('VIN', row.userVin || '—') + detailField('手机号码', row.userPhone || '—') + detailField('oneID', row.userOneId || '—') +
          detailField('核销渠道', row.writeoffChannel) + detailField('核销来源', row.writeoffSource) + detailField('结算状态', row.status) +
        '</div>' +
        '<h3 class="section-title">结算数据汇总</h3>' +
        '<div class="metric-grid">' +
          metricCard('卡券面值（卡券中心）', U.money(row.couponFaceValue)) +
          metricCard('适用商品商城价', U.money(row.mallGoodsAmount)) +
          metricCard('实际优惠金额', U.money(row.actualDiscountAmount)) +
          metricCard('适用商品网点价', U.money(row.dealerPriceAmount)) +
        '</div>' +
        '<h3 class="section-title">订单商品拆分</h3>' +
        '<div class="table-wrapper"><table class="items-table"><thead><tr><th>SKU</th><th>商品</th><th>数量</th><th>是否适用</th><th>商城单价</th><th>优惠金额</th><th>退款优惠</th><th>网点价</th><th>说明</th></tr></thead><tbody>' +
          row.items.map(itemRow).join('') +
        '</tbody></table></div>' +
        '<h3 class="section-title">结算计算</h3>' +
        '<div class="formula-box"><div class="formula-main">运行时路由：' + row.writeoffSource + ' → ' + row.writeoffChannel + '规则；结算基准：' + row.settlementBasis + '；结果：' + U.money(row.settlementAmount) + '</div>' +
          '<div class="formula-note">只计算适用商品。退款按退款商品重新计算；订单冻结后通过接口单次提交 E3S。</div></div>' +
        '<h3 class="section-title">处理轨迹</h3><div class="timeline">' +
          row.timeline.map(function (item) { return '<div class="timeline-item"><div class="timeline-time">' + item.time + '</div><div>' + item.text + '</div></div>'; }).join('') +
        '</div>' +
      '</div></aside>';
    document.body.appendChild(overlay);
    overlay.querySelector('[data-close]').addEventListener('click', function () { overlay.remove(); });
  }

  function detailField(label, value) {
    return '<div class="detail-field"><div class="field-label">' + label + '</div><div class="field-value">' + U.escapeHtml(value) + '</div></div>';
  }

  function metricCard(label, value) {
    return '<div class="metric-card"><div class="field-label">' + label + '</div><div class="value">' + value + '</div></div>';
  }

  function itemRow(item) {
    var netDiscount = Number(item.discountAmount || 0) - Number(item.refundDiscountAmount || 0);
    return '<tr class="' + (item.applicable ? '' : 'item-not-applicable') + '">' +
      '<td>' + item.sku + '</td><td>' + item.name + '</td><td>' + item.quantity + '</td>' +
      '<td><span class="' + (item.applicable ? 'applicable-mark' : 'not-applicable-mark') + '">' + (item.applicable ? '✓ 适用' : '— 不适用') + '</span></td>' +
      '<td>' + U.money(item.mallUnitPrice) + '</td><td>' + U.money(item.discountAmount) + '</td><td>' + U.money(item.refundDiscountAmount || 0) + '</td><td>' + U.money(item.dealerUnitPrice) + '</td>' +
      '<td>' + item.note + (item.applicable && item.refundDiscountAmount ? '；优惠净额 ' + U.money(netDiscount) : '') + '</td></tr>';
  }

  window.Pages = window.Pages || {};
  window.Pages.report = { render: render, init: init };
})();
