//index.js
//获取应用实例
const app = getApp()

//获取Bmob
var Bmob = require('../../../utils/bmob.js')

Page({
  data: {
    kind: ["课程通知", "上级通知", "比赛通知", "其他通知"],
    accountIndex: 0,
    date: '2018-01-01',
    isme: 0,
    currentNotice_id:0
  },
  onLoad: function (chuan_can_ID) {
    //获取当前用户
    var currentUser = Bmob.User.current();
    var objectId = currentUser.id;
    console.log("教师：" + objectId);
    var isme = new Bmob.User();
    isme.id = objectId;
    this.setData({
      isme: isme,
      currentNotice_id: chuan_can_ID.id
    })

    //从数据库获取数据
    var _this = this;
    var currentNotice_Id = chuan_can_ID.id;
    var notice = Bmob.Object.extend("notice");
    var query_notice = new Bmob.Query(notice);
    query_notice.get(currentNotice_Id, {
      success: function (results) {
        console.log(results)
        // console.log(results.attributes.kind)        
        _this.setData({
          notices: results.attributes,
          accountIndex: results.attributes.kind,
          date: results.attributes.deadline
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })
  },

  //通知类型picker 值变化时
  bindKindChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    this.setData({
      accountIndex: e.detail.value
    })
  },

  //通知截至时间picker 值变化时
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },

  //修改通知 提交时
  NoticeformSubmit: function (e) {
    //提交反馈
    wx.showToast({
      title: '提交中',
      icon: 'loading',
      duration: 5000
    })

    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    //获取通知信息
    var Level = parseInt(e.detail.value.Level);
    var Kind = parseInt(e.detail.value.Kind);
    var Deadline = e.detail.value.Deadline;
    var Content = e.detail.value.Content;
    var Title = e.detail.value.Title;
    //修改信息
    var currentNotice_id = this.data.currentNotice_id;
    var notice = Bmob.Object.extend("notice");
    var query = new Bmob.Query(notice);
    query.get(currentNotice_id, {
      success: function (NewNotice) {
        //成功反馈
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        NewNotice.set("level", Level);
        NewNotice.set("kind", Kind);
        NewNotice.set("deadline", Deadline);
        NewNotice.set("content", Content);
        NewNotice.set("title", Title);
        NewNotice.save();
        console.log("notice修改成功")
        
        //返回上一页
        wx.navigateBack({
          delta: 1
        })        
      },
      error: function (object, error) {
        console.log("notice修改失败")
      }
    });

  },


  deleteNotice: function () {
    //提交反馈
    wx.showToast({
      title: '删除中',
      icon: 'loading',
      duration: 10000
    })
    var currentNotice_id = this.data.currentNotice_id;
    var notice = Bmob.Object.extend("notice");
    var query = new Bmob.Query(notice);
    query.get(currentNotice_id, {
      success: function (object) {
        object.destroy({
          success: function (deleteObject) {
            console.log('删除通知成功');
            //成功反馈
            wx.showToast({
              title: '成功',
              icon: 'success',
              duration: 2000
            })
            //返回上一页
            wx.navigateBack({
              delta: 1
            })
          },
          error: function (object, error) {
            console.log('删除通知失败');
          }
        });
      },
      error: function (object, error) {
        console.log("query object fail");
      }
    });
  },

}) 