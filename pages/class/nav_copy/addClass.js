var app = getApp()
Page({
  data: {
    navbar: ['首页', '搜索', '我'],
    currentTab: 0
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  }
}) 