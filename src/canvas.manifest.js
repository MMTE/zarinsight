export const manifest = {
  screens: {
    scr_ipkieq: { name: "نمای کلی", route: "/", position: { "x": 160, "y": 1820 } },
    scr_rdkcaa: { name: "بینش‌های مهم", route: "/insights", position: { "x": 160, "y": 3800 } },
    scr_v3jxrv: { name: "جزئیات یافته — افت پرداخت", route: "/insights/psp08-success-drop", position: { "x": 1560, "y": 3800 } },
    scr_k3rybr: { name: "جزئیات یافته — مشتریان تکراری", route: "/insights/repeat-customer-value", position: { "x": 2960, "y": 3800 } },
    scr_gv35i7: { name: "جزئیات یافته — رها شدن پرداخت", route: "/insights/retry-funnel-loss", position: { "x": 4360, "y": 3800 } },
    scr_h07fax: { name: "فروش", route: "/sales", position: { "x": 1560, "y": 1820 } },
    scr_qrgxv6: { name: "مشتریان", route: "/customers", position: { "x": 2960, "y": 1820 } },
    scr_urq628: { name: "پرداخت‌ها", route: "/payments", position: { "x": 4360, "y": 1820 } },
    scr_vhxell: { name: "مقایسه با کسب‌وکارهای مشابه", route: "/benchmarks", position: { "x": 160, "y": 7760 } },
    scr_tkdhiq: { name: "بررسی داده‌ها", route: "/explore", position: { "x": 160, "y": 5780 } },
    scr_a2f4sf: { name: "جست‌وجوی تحلیلی", route: "/ask", position: { "x": 1560, "y": 5780 } },
    scr_ax0s17: { name: "پاسخ تحلیلی", route: "/ask?q=%DA%86%D8%B1%D8%A7%20%D9%81%D8%B1%D9%88%D8%B4%D9%85%20%DA%A9%D9%85%20%D8%B4%D8%AF%D9%87%D8%9F", position: { "x": 2960, "y": 5780 } },
    scr_scbqoy: { name: "تغییرات مهم", route: "/notifications", position: { "x": 0, "y": 0 }, isDefaultRow: true },
    scr_pym84t: { name: "کیفیت داده", route: "/data-quality", position: { "x": 1560, "y": 7760 } },
    scr_ck8xzc: { name: "روش تحلیل", route: "/methodology", position: { "x": 1400, "y": 0 }, isDefaultRow: true },
    scr_2az5j0: { name: "بیش‌تر (موبایل)", route: "/more", position: { "x": 2800, "y": 0 }, isDefaultRow: true }
  },
  sections: {
    sec_e4z28u: { name: "Primary Navigation", x: 0, y: 1600, width: 5720, height: 1180 },
    sec_18ght8: { name: "Insights Discovery", x: 0, y: 3580, width: 5720, height: 1180 },
    sec_7204bf: { name: "Data Exploration", x: 0, y: 5560, width: 4320, height: 1180 },
    sec_t0ykkl: { name: "Benchmarking & Quality", x: 0, y: 7540, width: 2920, height: 1180 }
  },
  layers: [
  { kind: "screen", id: "scr_scbqoy" },
  { kind: "screen", id: "scr_ck8xzc" },
  { kind: "screen", id: "scr_2az5j0" },
  { kind: "section", id: "sec_e4z28u", children: [
    { kind: "screen", id: "scr_ipkieq" },
    { kind: "screen", id: "scr_h07fax" },
    { kind: "screen", id: "scr_qrgxv6" },
    { kind: "screen", id: "scr_urq628" }]
  },
  { kind: "section", id: "sec_18ght8", children: [
    { kind: "screen", id: "scr_rdkcaa" },
    { kind: "screen", id: "scr_v3jxrv" },
    { kind: "screen", id: "scr_k3rybr" },
    { kind: "screen", id: "scr_gv35i7" }]
  },
  { kind: "section", id: "sec_7204bf", children: [
    { kind: "screen", id: "scr_tkdhiq" },
    { kind: "screen", id: "scr_a2f4sf" },
    { kind: "screen", id: "scr_ax0s17" }]
  },
  { kind: "section", id: "sec_t0ykkl", children: [
    { kind: "screen", id: "scr_vhxell" },
    { kind: "screen", id: "scr_pym84t" }]
  }]

};