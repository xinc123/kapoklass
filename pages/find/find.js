var app = getApp()
Page({
  data: {
    navbar: ['精选文章', '我的收藏'],
    currentTab: 0
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  }
}) 