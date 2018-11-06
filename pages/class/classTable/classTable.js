//classTable.js
//获取应用实例
var app = getApp()
Page({
  data: {
    colorArrays: ["#85B8CF", "#90C652", "#D8AA5A", "#FC9F9D", "#0A9A84", "#61BC69", "#12AEF3", "#E29AAD"],
    wlist: [
      { "xqj": 1, "skjc": 1, "skcd": 3, "kcmc": "1" },
      { "xqj": 1, "skjc": 5, "skcd": 3, "kcmc": "2" },
      { "xqj": 2, "skjc": 1, "skcd": 2, "kcmc": "3" },
      { "xqj": 2, "skjc": 8, "skcd": 2, "kcmc": "4" },
      { "xqj": 3, "skjc": 4, "skcd": 1, "kcmc": "5" },
      { "xqj": 3, "skjc": 8, "skcd": 1, "kcmc": "6" },
      { "xqj": 3, "skjc": 5, "skcd": 2, "kcmc": "7" },
      { "xqj": 4, "skjc": 2, "skcd": 3, "kcmc": "8" },
      { "xqj": 4, "skjc": 8, "skcd": 2, "kcmc": "9" },
      { "xqj": 5, "skjc": 1, "skcd": 2, "kcmc": "10" },
      { "xqj": 6, "skjc": 3, "skcd": 2, "kcmc": "11" },
      { "xqj": 7, "skjc": 5, "skcd": 3, "kcmc": "12" },




    ]
  },
  onLoad: function () {
    console.log('onLoad')
  },
  showCardView: function () {
    console.log('showCardView')
  }
})
