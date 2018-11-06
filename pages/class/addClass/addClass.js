//获取Bmob
var Bmob = require('../../../utils/bmob.js')


Page({
  data: {
    //导航条数据
    navbar: ['添加课程', '添加通知'],
    currentTab: 0,

    //星期picker的range
    accounts: ["周日","周一", "周二", "周三", "周四", "周五", "周六"],

    //通知类别picker的range 以及accountIndex（被选的序号）
    kind: ["课程通知", "上级通知", "比赛通知", "其他通知"],
    accountIndex: 0,

    //默认值
    date: '2018-01-01',

    //上课时间数据
    objectArray: [
      { id: 0, unique: 'unique_0', accountIndex: "0",Begin:0,End:0 },
    ]

  },
  //导航条切换
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  onLoad: function () {
    //获取当前用户
    var currentUser = Bmob.User.current();
    var objectId = currentUser.id;
    console.log("教师：" + objectId);
    var isme = new Bmob.User();
    isme.id = objectId;
    this.setData({
      isme: isme
    })

  },

  //添加课程 提交时
  LessonformSubmit: function (e) {
    //提交反馈
    wx.showToast({
      title: '提交中',
      icon: 'loading',
      duration: 10000
    })

    var _this = this;
    console.log('Lessonform发生了submit事件，携带数据为：', e.detail.value)
    //获取课程信息
    var LessonName = e.detail.value.LessonName;
    var Class = e.detail.value.Class;
    var Address = e.detail.value.Address;
    //连接数据表lessonData
    var lessonData = Bmob.Object.extend("lessonData");
    var NewLessonData = new lessonData();
    //关联用户
    var isme = this.data.isme;
    //添加一行lessonData数据
    NewLessonData.set("ownUser", isme);
    NewLessonData.set("class", Class);
    NewLessonData.set("lessonName", LessonName);
    NewLessonData.set("address", Address);
    //添加数据，第一个入口参数是null
    NewLessonData.save(null, {
      success: function (result) {
        // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        console.log("lessonData创建成功, objectId:" + result.id);
        console.log(result.attributes.lessonName)
        console.log(result.attributes.class)
        console.log(result.attributes.address)
        
       
        //添加lessonTime数据
        var ObjectArray_Data = _this.data.objectArray;
        var length = ObjectArray_Data.length;
        var isme_forLessonTime = _this.data.isme;
        //关联课程
        var id = result.id
        var lessonData = Bmob.Object.createWithoutData("lessonData", id);
        //console.log(ObjectArray_Data); 
        //console.log(length); 
        //console.log(isme_forLessonTime); 
        for (let i = 0; i < length; ++i) {
          //获取每个上课时间
          var Day_i = parseInt(ObjectArray_Data[i].accountIndex);
          var Begin_i = parseInt(ObjectArray_Data[i].Begin);
          var End_i = parseInt(ObjectArray_Data[i].End);
          //连接数据表lessonTime数据
          var lessonTime = Bmob.Object.extend("lessonTime");
          var NewLessonTime = new lessonTime();
          NewLessonTime.set("ownUser", isme_forLessonTime);
          NewLessonTime.set("ownLesson", lessonData);
          NewLessonTime.set("day", Day_i);
          NewLessonTime.set("begin", Begin_i);
          NewLessonTime.set("end", End_i);
          NewLessonTime.save(null, {
            success: function (result) {
              console.log("NewLessonTime创建成功, objectId:" + result.id);
              //跳转到成功反馈页面
              // wx.navigateTo({
              //   url: '../success/success'
              // })
              wx.showToast({
                title: '成功',
                icon: 'success',
                duration: 2000
              })
              wx.switchTab({
                url: '../index/index'
              })
              
            },
            error: function (result, error) {
              console.log('创建NewLessonTime失败');
            }
          });
        }
        
      },
      error: function (result, error) {
        console.log('创建lessonData失败');
      }
    });    
    
    
  },

  //添加通知 提交时
  NoticeformSubmit: function(e) {
    //提交反馈
    wx.showToast({
      title: '请检查输入内容',
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
    //连接数据表notice
    var notice = Bmob.Object.extend("notice");
    var NewNotice = new notice();
    //关联用户
    var isme = this.data.isme;
    //添加一行notice数据
    NewNotice.set("ownUser", isme);
    NewNotice.set("level", Level);
    NewNotice.set("kind", Kind);
    NewNotice.set("deadline", Deadline);
    NewNotice.set("content", Content);
    NewNotice.set("title", Title);
    NewNotice.save(null, {
      success: function (result) {
        console.log("NewNotice创建成功, objectId:" + result.id);
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
      error: function (result, error) {
        console.log('创建NewNotice失败');
      }
    });
  },

  //添加多一个上课时间picker到前部
  addToFront: function (e) {
    var length = this.data.objectArray.length
    this.data.objectArray = [{ id: length, unique: 'unique_' + length, accountIndex: "0", Begin: 0, End: 0 }].concat(this.data.objectArray)
    this.setData({
      objectArray: this.data.objectArray
    })
  },

  //星期picker 值发生变化时
  bindDayChange: function (e) {
    //找到当前picker对应的objectArray数组元素下标mark
    var objectArray = this.data.objectArray;
    var index = parseInt(e.currentTarget.dataset.index);
    var length = this.data.objectArray.length;
    var mark = length - index - 1;
    //微信小程序用setData修改数组或对象中的一个属性值
    //先用一个变量，把(objectArray[mark].accountIndexy)用字符串拼接起来
    var accountIndex = "objectArray[" + mark + "].accountIndex";
    //console.log(mark);
    console.log('picker account 发生选择改变，携带值为', e.detail.value);
    //修改被选序号accountIndex并返回
    this.setData({
      [accountIndex]: e.detail.value
    })
    console.log(objectArray);
  },

  //开始节数picker 值变化时
  bindBeginChange: function (e) {
    //找到当前picker对应的objectArray数组元素下标mark
    var objectArray = this.data.objectArray;
    var index = parseInt(e.currentTarget.dataset.index);
    var length = this.data.objectArray.length;
    var mark = length - index - 1;
    var Begin = "objectArray[" + mark + "].Begin";
    //console.log(mark);
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      [Begin]: e.detail.value
    })
    console.log(objectArray);
  },

  //结束节数picker 值变化时
  bindEndChange: function (e) {
    var objectArray = this.data.objectArray;
    var index = parseInt(e.currentTarget.dataset.index);
    var length = this.data.objectArray.length;
    var mark = length - index - 1;
    var End = "objectArray[" + mark + "].End";
    //console.log(mark);
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      [End]: e.detail.value
    })
    console.log(objectArray);
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

  


});