(function () {
  'use strict';

  var U = window.AppUtils;
  var rules = window.MockData.rules.map(function (item) { return Object.assign({}, item); });
  var filterState = { keyword: '', status: '' };
  var editingId = null;

  function render() {
    return '' +
      '<div class="page-heading">' +
        '<div><h1 class="page-title">卡券规则设置</h1><p class="page-subtitle">沿用原结算规则的增删改查；规则内同时维护线上与线下配置。</p></div>' +
        '<div class="page-actions"><button class="btn btn-primary" id="create-rule">新增结算规则</button></div>' +
      '</div>' +
      '<div class="notice"><span class="notice-icon">i</span><span>规则配置页不设置“结算渠道”。实际结算时，卡券中心根据核销来源自动路由：商城使用线上配置，E3S 使用线下配置。</span></div>' +
      '<section class="card route-card">' +
        '<h2>实际结算运行时路由</h2>' +
        '<div class="route-diagram">' +
          '<div class="route-node"><div><strong>卡券实例进入结算</strong><span>携带核销来源与业务数据</span></div></div>' +
          '<div class="route-arrow">→</div>' +
          '<div class="route-node decision"><div><strong>判断核销来源</strong><span>不由规则配置人员手工选择</span></div></div>' +
          '<div class="route-arrow">→</div>' +
          '<div class="route-branches"><div class="route-branch"><strong>商城&nbsp;</strong> → 读取线上配置</div><div class="route-branch"><strong>E3S&nbsp;</strong> → 读取线下配置</div></div>' +
        '</div>' +
      '</section>' +
      '<section class="card report-card">' +
        '<div class="rules-toolbar">' +
          '<div class="filter-group"><label for="rule-keyword">模板名称 / 规则编号</label><input class="form-input" id="rule-keyword" placeholder="请输入关键字"></div>' +
          '<div class="filter-group"><label for="rule-status">状态</label><select class="form-select" id="rule-status"><option value="">全部</option><option>启用</option><option>停用</option></select></div>' +
          '<div class="filter-actions"><button class="btn btn-primary" id="query-rule">查询</button><button class="btn" id="reset-rule">重置</button></div>' +
        '</div>' +
        '<div class="card-toolbar"><h2>结算规则列表</h2><span class="result-count" id="rule-count"></span></div>' +
        '<div class="table-wrapper"><table class="rule-table"><thead><tr>' +
          ['规则编号','模板名称','品牌','线上结算配置','线上价格标准','线下结算配置','线下价格标准','状态','操作'].map(function (title) { return '<th>' + title + '</th>'; }).join('') +
        '</tr></thead><tbody id="rule-body"></tbody></table></div>' +
        '<div class="footer-note">已被卡券引用的规则锁定删除；其他规则支持新增、编辑、删除、启停用。</div>' +
      '</section>';
  }

  function init() {
    renderTable();
    document.getElementById('create-rule').addEventListener('click', function () { openForm(); });
    document.getElementById('query-rule').addEventListener('click', applyFilters);
    document.getElementById('reset-rule').addEventListener('click', resetFilters);
    document.getElementById('rule-keyword').addEventListener('keydown', function (event) {
      if (event.key === 'Enter') applyFilters();
    });
  }

  function filteredRules() {
    var keyword = filterState.keyword.toLowerCase();
    return rules.filter(function (rule) {
      return (!keyword || (rule.id + '|' + rule.name).toLowerCase().indexOf(keyword) > -1)
        && (!filterState.status || rule.status === filterState.status);
    });
  }

  function applyFilters() {
    filterState.keyword = document.getElementById('rule-keyword').value.trim();
    filterState.status = document.getElementById('rule-status').value;
    renderTable();
  }

  function resetFilters() {
    filterState = { keyword: '', status: '' };
    document.getElementById('rule-keyword').value = '';
    document.getElementById('rule-status').value = '';
    renderTable();
  }

  function renderTable() {
    var list = filteredRules();
    var body = document.getElementById('rule-body');
    if (!body) return;
    document.getElementById('rule-count').textContent = '共 ' + list.length + ' 条';
    body.innerHTML = list.length ? list.map(function (rule) {
      return '<tr>' +
        '<td>' + U.escapeHtml(rule.id) + '</td>' +
        '<td><strong>' + U.escapeHtml(rule.name) + '</strong>' + (rule.used ? '<div class="form-help">已被卡券引用</div>' : '') + '</td>' +
        '<td>' + U.escapeHtml(rule.brand) + '</td>' +
        '<td>' + configText(rule.onlineType, rule.onlineValue) + '</td><td>' + rule.onlineBasis + '</td>' +
        '<td>' + configText(rule.offlineType, rule.offlineValue) + '</td><td>' + rule.offlineBasis + '</td>' +
        '<td><span class="tag tag-' + U.statusClass(rule.status) + '">' + rule.status + '</span></td>' +
        '<td><button class="btn btn-text" data-edit="' + rule.id + '">编辑</button>' +
          '<button class="btn btn-text" data-toggle="' + rule.id + '">' + (rule.status === '启用' ? '停用' : '启用') + '</button>' +
          '<button class="btn btn-text btn-danger-text" data-delete="' + rule.id + '"' + (rule.used ? ' disabled title="已被卡券引用，不可删除"' : '') + '>删除</button></td>' +
      '</tr>';
    }).join('') : '<tr><td colspan="9" style="text-align:center;padding:40px;color:#8d98a8">暂无匹配数据</td></tr>';

    body.querySelectorAll('[data-edit]').forEach(function (button) {
      button.addEventListener('click', function () { openForm(button.dataset.edit); });
    });
    body.querySelectorAll('[data-toggle]').forEach(function (button) {
      button.addEventListener('click', function () { toggleRule(button.dataset.toggle); });
    });
    body.querySelectorAll('[data-delete]').forEach(function (button) {
      button.addEventListener('click', function () { deleteRule(button.dataset.delete); });
    });
  }

  function configText(type, value) {
    return '<span class="tag tag-info">' + U.escapeHtml(type) + '</span> <strong>' + U.escapeHtml(value) + '</strong>';
  }

  function openForm(id) {
    editingId = id || null;
    var rule = editingId ? rules.find(function (item) { return item.id === editingId; }) : null;
    var overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = '<section class="modal" role="dialog" aria-modal="true" aria-label="' + (rule ? '编辑' : '新增') + '结算规则">' +
      '<header class="modal-header"><h2>' + (rule ? '编辑结算规则' : '新增结算规则') + '</h2><button class="icon-button" data-close>✕</button></header>' +
      '<form id="rule-form" class="modal-body">' +
        (rule && rule.used ? '<div class="locked-note">该规则已被卡券引用。允许调整配置并保留规则编号，但不可删除。</div>' : '') +
        '<div class="rule-form-grid">' +
          fieldInput('rule-name', '模板名称', rule ? rule.name : '', true, '例如：精品类卡券结算规则') +
          fieldSelect('rule-brand', '品牌', ['东风日产', '东风启辰', '英菲尼迪'], rule ? rule.brand : '东风日产', true) +
        '</div>' +
        configBlock('线上结算配置', '商城核销时使用', 'online', rule) +
        configBlock('线下结算配置', 'E3S 核销时使用', 'offline', rule) +
        '<div class="rule-form-grid" style="margin-top:18px">' +
          fieldSelect('rule-form-status', '规则状态', ['启用', '停用'], rule ? rule.status : '启用', true) +
          '<div><label class="form-label" for="rule-note">补贴计算备注</label><input class="form-input" id="rule-note" placeholder="选填，填写规则说明"></div>' +
        '</div>' +
      '</form>' +
      '<footer class="modal-footer"><button class="btn" type="button" data-close>取消</button><button class="btn btn-primary" type="submit" form="rule-form">' + (rule ? '保存修改' : '提交') + '</button></footer>' +
    '</section>';
    document.body.appendChild(overlay);
    overlay.querySelectorAll('[data-close]').forEach(function (button) {
      button.addEventListener('click', function () { overlay.remove(); });
    });
    overlay.querySelector('#rule-form').addEventListener('submit', function (event) {
      event.preventDefault();
      saveRule(overlay);
    });
    overlay.querySelectorAll('[data-type-select]').forEach(function (select) {
      select.addEventListener('change', function () { updateUnit(select); });
      updateUnit(select);
    });
  }

  function configBlock(title, caption, prefix, rule) {
    var type = rule ? rule[prefix + 'Type'] : '比例结算';
    var value = rule ? String(rule[prefix + 'Value']).replace(/%|元/g, '') : '';
    var basis = rule ? rule[prefix + 'Basis'] : (prefix === 'online' ? '实际优惠金额' : '网点价');
    return '<div class="config-block">' +
      '<div class="config-title"><h3>' + title + '</h3><span>' + caption + '</span></div>' +
      '<div class="inline-fields">' +
        fieldSelect(prefix + '-type', '结算方式', ['固定金额', '比例结算'], type, true, 'data-type-select') +
        '<div><label class="form-label required" for="' + prefix + '-value">结算值</label><div style="display:flex"><input class="form-input" style="width:105px" type="number" min="0" step="0.01" id="' + prefix + '-value" value="' + U.escapeHtml(value) + '" required><span id="' + prefix + '-unit" style="padding:7px 0 0 7px;color:#66758a">%</span></div></div>' +
        fieldSelect(prefix + '-basis', '价格标准值', window.MockData.basisOptions, basis, true) +
      '</div>' +
    '</div>';
  }

  function fieldInput(id, label, value, required, placeholder) {
    return '<div><label class="form-label ' + (required ? 'required' : '') + '" for="' + id + '">' + label + '</label><input class="form-input" style="width:100%" id="' + id + '" value="' + U.escapeHtml(value) + '" placeholder="' + placeholder + '"' + (required ? ' required' : '') + '></div>';
  }

  function fieldSelect(id, label, options, value, required, extraAttr) {
    return '<div><label class="form-label ' + (required ? 'required' : '') + '" for="' + id + '">' + label + '</label><select class="form-select" style="width:100%" id="' + id + '" ' + (extraAttr || '') + '>' +
      options.map(function (item) { return '<option' + (item === value ? ' selected' : '') + '>' + item + '</option>'; }).join('') +
      '</select></div>';
  }

  function updateUnit(select) {
    var prefix = select.id.split('-')[0];
    var unit = document.getElementById(prefix + '-unit');
    if (unit) unit.textContent = select.value === '比例结算' ? '%' : '元';
  }

  function saveRule(overlay) {
    var name = document.getElementById('rule-name').value.trim();
    if (!name) return;
    var values = {
      name: name,
      brand: document.getElementById('rule-brand').value,
      onlineType: document.getElementById('online-type').value,
      onlineValue: formatValue('online'),
      onlineBasis: document.getElementById('online-basis').value,
      offlineType: document.getElementById('offline-type').value,
      offlineValue: formatValue('offline'),
      offlineBasis: document.getElementById('offline-basis').value,
      status: document.getElementById('rule-form-status').value,
      updatedAt: '2026-07-23 15:30'
    };
    if (editingId) {
      var target = rules.find(function (item) { return item.id === editingId; });
      Object.assign(target, values);
      U.toast('结算规则已更新');
    } else {
      var max = rules.reduce(function (num, item) {
        return Math.max(num, parseInt(item.id.split('-').pop(), 10) || 0);
      }, 0);
      values.id = 'RULE-DPL-' + String(max + 1).padStart(3, '0');
      values.used = false;
      rules.unshift(values);
      U.toast('结算规则已新增');
    }
    overlay.remove();
    renderTable();
  }

  function formatValue(prefix) {
    var type = document.getElementById(prefix + '-type').value;
    var value = document.getElementById(prefix + '-value').value || '0';
    return value + (type === '比例结算' ? '%' : '元');
  }

  function toggleRule(id) {
    var rule = rules.find(function (item) { return item.id === id; });
    rule.status = rule.status === '启用' ? '停用' : '启用';
    U.toast('规则已' + rule.status);
    renderTable();
  }

  function deleteRule(id) {
    var rule = rules.find(function (item) { return item.id === id; });
    if (!rule || rule.used) {
      U.toast('已被卡券引用的规则不可删除', 'error');
      return;
    }
    if (!window.confirm('确认删除“' + rule.name + '”吗？')) return;
    rules = rules.filter(function (item) { return item.id !== id; });
    U.toast('结算规则已删除');
    renderTable();
  }

  window.Pages = window.Pages || {};
  window.Pages.rules = { render: render, init: init };
})();
