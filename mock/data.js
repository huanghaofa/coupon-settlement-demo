(function () {
  'use strict';

  window.MockData = {
    reportRows: [
      {
        instanceId: 'CI-DPL-20260723001',
        couponName: '夏季精品满减券',
        couponFaceValue: 100,
        userVin: 'LGBM4AE4XNS001721',
        userPhone: '138****7261',
        userOneId: 'ONEID-DPL-10001',
        orderNo: 'SO-DPL-20260723-001',
        writeoffChannel: '线上',
        writeoffSource: '商城',
        applicableGoodsCount: 2,
        mallGoodsAmount: 528,
        actualDiscountAmount: 100,
        dealerPriceAmount: 502,
        settlementBasis: '实际优惠金额',
        settlementRule: '比例结算 80%',
        settlementAmount: 80,
        status: '待冻结',
        writeoffTime: '2026-07-23 10:18:22',
        items: [
          { sku: 'SKU-DPL-1001', name: '原厂脚垫', quantity: 1, applicable: true, mallUnitPrice: 399, discountAmount: 80, dealerUnitPrice: 380, note: '适用商品，参与补贴计算' },
          { sku: 'SKU-DPL-1002', name: '车载香氛', quantity: 1, applicable: true, mallUnitPrice: 129, discountAmount: 40, refundDiscountAmount: 20, dealerUnitPrice: 122, note: '退款后按商品重算，优惠净额 20 元' },
          { sku: 'SKU-DPL-1003', name: '儿童安全座椅', quantity: 1, applicable: false, mallUnitPrice: 899, discountAmount: 0, dealerUnitPrice: 850, note: '非适用商品，不参与计算' }
        ],
        timeline: [
          { time: '2026-07-23 10:18:22', text: '商城完成核销并按订单商品拆分优惠金额' },
          { time: '2026-07-23 10:20:03', text: '卡券中心汇总同一用户、同一卡券实例数据' },
          { time: '2026-07-23 10:20:04', text: '运行时识别商城来源，采用线上结算规则' },
          { time: '待操作', text: '冻结订单后，通过接口单次提交 E3S 结算' }
        ]
      },
      {
        instanceId: 'CI-DPL-20260723002',
        couponName: '原厂保养优惠券',
        couponFaceValue: 200,
        userVin: '',
        userPhone: '136****2830',
        userOneId: 'ONEID-DPL-10002',
        orderNo: 'SO-DPL-20260723-002',
        writeoffChannel: '线上',
        writeoffSource: '商城',
        applicableGoodsCount: 1,
        mallGoodsAmount: 698,
        actualDiscountAmount: 200,
        dealerPriceAmount: 650,
        settlementBasis: '卡券面值',
        settlementRule: '固定金额 120 元',
        settlementAmount: 120,
        status: '已冻结',
        writeoffTime: '2026-07-22 16:42:09',
        items: [
          { sku: 'SKU-DPL-2001', name: '基础保养套餐', quantity: 1, applicable: true, mallUnitPrice: 698, discountAmount: 200, dealerUnitPrice: 650, note: '适用商品，参与补贴计算' }
        ],
        timeline: [
          { time: '2026-07-22 16:42:09', text: '商城完成核销并传入商品结算数据' },
          { time: '2026-07-22 16:43:11', text: '卡券中心完成结算金额计算' },
          { time: '2026-07-23 09:00:00', text: '业务确认无退款风险并冻结订单' }
        ]
      },
      {
        instanceId: 'CI-DPL-20260723003',
        couponName: '到店检测抵用券',
        couponFaceValue: 80,
        userVin: 'LGBM4AE4XNS008920',
        userPhone: '',
        userOneId: '',
        orderNo: 'E3S-WO-DPL-073003',
        writeoffChannel: '线下',
        writeoffSource: 'E3S',
        applicableGoodsCount: 1,
        mallGoodsAmount: 0,
        actualDiscountAmount: 80,
        dealerPriceAmount: 90,
        settlementBasis: '网点价',
        settlementRule: '比例结算 70%',
        settlementAmount: 63,
        status: '已提交E3S',
        writeoffTime: '2026-07-21 14:30:56',
        items: [
          { sku: 'SERVICE-DPL-01', name: '全车安全检测', quantity: 1, applicable: true, mallUnitPrice: 0, discountAmount: 80, dealerUnitPrice: 90, note: 'E3S 线下核销服务项目' }
        ],
        timeline: [
          { time: '2026-07-21 14:30:56', text: 'E3S 完成线下核销' },
          { time: '2026-07-21 14:31:02', text: '卡券中心采用线下结算规则完成计算' },
          { time: '2026-07-23 08:00:00', text: '订单冻结后单次提交 E3S，提交成功' }
        ]
      },
      {
        instanceId: 'CI-DPL-20260723004',
        couponName: '车载精品折扣券',
        couponFaceValue: 150,
        userVin: 'LGBM4AE4XNS002618',
        userPhone: '139****1886',
        userOneId: 'ONEID-DPL-10004',
        orderNo: 'SO-DPL-20260723-004',
        writeoffChannel: '线上',
        writeoffSource: '商城',
        applicableGoodsCount: 2,
        mallGoodsAmount: 860,
        actualDiscountAmount: 150,
        dealerPriceAmount: 810,
        settlementBasis: '商城商品单价',
        settlementRule: '比例结算 10%',
        settlementAmount: 86,
        status: '待冻结',
        writeoffTime: '2026-07-20 11:08:31',
        items: [
          { sku: 'SKU-DPL-4001', name: '原厂后备箱垫', quantity: 1, applicable: true, mallUnitPrice: 360, discountAmount: 60, dealerUnitPrice: 340, note: '适用商品，参与补贴计算' },
          { sku: 'SKU-DPL-4002', name: '车顶行李箱', quantity: 1, applicable: true, mallUnitPrice: 500, discountAmount: 90, dealerUnitPrice: 470, note: '适用商品，参与补贴计算' }
        ],
        timeline: [
          { time: '2026-07-20 11:08:31', text: '商城完成线上核销' },
          { time: '2026-07-20 11:09:03', text: '卡券中心按适用商品商城单价汇总并计算' }
        ]
      }
    ],
    rules: [
      {
        id: 'RULE-DPL-001',
        name: '精品类卡券结算规则',
        brand: '东风日产',
        onlineType: '比例结算',
        onlineValue: '80%',
        onlineBasis: '实际优惠金额',
        offlineType: '比例结算',
        offlineValue: '70%',
        offlineBasis: '网点价',
        status: '启用',
        used: true,
        updatedAt: '2026-07-22 17:40'
      },
      {
        id: 'RULE-DPL-002',
        name: '保养类卡券结算规则',
        brand: '东风日产',
        onlineType: '固定金额',
        onlineValue: '120元',
        onlineBasis: '卡券面值',
        offlineType: '固定金额',
        offlineValue: '100元',
        offlineBasis: '卡券面值',
        status: '启用',
        used: false,
        updatedAt: '2026-07-21 09:16'
      },
      {
        id: 'RULE-DPL-003',
        name: '通用检测券结算规则',
        brand: '东风启辰',
        onlineType: '比例结算',
        onlineValue: '10%',
        onlineBasis: '商城商品单价',
        offlineType: '比例结算',
        offlineValue: '75%',
        offlineBasis: '实际优惠金额',
        status: '停用',
        used: false,
        updatedAt: '2026-07-18 13:26'
      }
    ],
    basisOptions: ['商城商品单价', '实际优惠金额', '卡券面值', '网点价']
  };
})();
