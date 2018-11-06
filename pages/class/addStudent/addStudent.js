//获取Bmob
var Bmob = require('../../../utils/bmob.js')
// pages/class/addStudent/addStudent.js
Page({

  
  data: {
    //星期picker的range
    accounts: ["男", "女"],
    //上课时间数据
    objectArray: [
      { id: 0, unique: 'unique_0', accountIndex: "0", StudentName: 0, StudentNum: 0, SPoint: "0", APoint: "0", BPoint: "0", CPoint: "0", DPoint: "0" },
    ],
    currentLessonId:0,
    isme:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (chuan_can_ID) {
    var that = this;
    //获取当前用户
    var currentUser = Bmob.User.current();
    var objectId = currentUser.id;
    var isme = new Bmob.User();
    isme.id = objectId;
    console.log(chuan_can_ID.lessonId);
    this.setData({
      isme: isme,
      currentLesson_id: chuan_can_ID.lessonId
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
    //关联用户
    var isme = this.data.isme;
    //关联课程
    var currentLesson_id = this.data.currentLesson_id;
    var lessonData = Bmob.Object.createWithoutData("lessonData", currentLesson_id);
    //获取学生数据
    var ObjectArray_Data = this.data.objectArray;
    var length = ObjectArray_Data.length;
    
    for (let i = 0; i < length; ++i) {
      //获取每个上课时间
      var Sex_i = parseInt(ObjectArray_Data[i].accountIndex);
      var StudentName_i = ObjectArray_Data[i].StudentName;
      var StudentNum_i = ObjectArray_Data[i].StudentNum;
      var Spoint_i = parseInt(ObjectArray_Data[i].SPoint);
      var Apoint_i = parseInt(ObjectArray_Data[i].APoint);
      var Bpoint_i = parseInt(ObjectArray_Data[i].BPoint);
      var Cpoint_i = parseInt(ObjectArray_Data[i].CPoint);
      var Dpoint_i = parseInt(ObjectArray_Data[i].DPoint);
      //连接数据表student数据
      var student = Bmob.Object.extend("student");
      var NewStudent = new student();
      NewStudent.set("ownUser", isme);
      NewStudent.set("ownLesson", lessonData);
      NewStudent.set("studentSex", Sex_i);
      NewStudent.set("studentName", StudentName_i);
      NewStudent.set("studentNum", StudentNum_i);
      NewStudent.set("Spoint", Spoint_i);
      NewStudent.set("Apoint", Apoint_i);
      NewStudent.set("Bpoint", Bpoint_i);
      NewStudent.set("Cpoint", Cpoint_i);
      NewStudent.set("Dpoint", Dpoint_i);
      
      
      NewStudent.save(null, {
        success: function (result) {
          console.log("NewStudent创建成功, objectId:" + result.id);
          //成功反馈
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          })
            //返回上一页
            wx.navigateBack({
              delta:1
            })
        },
        error: function (result, error) {
          console.log('创建NewStudent失败');
        }
      });
    }
    
  },


  //添加多一个上课时间picker到前部
  addToFront: function (e) {
    var length = this.data.objectArray.length
    this.data.objectArray = [{ id: length, unique: 'unique_' + length, accountIndex: "0", StudentName: 0, StudentNum: 0, SPoint: "0", APoint: "0", BPoint: "0", CPoint: "0", DPoint: "0" }].concat(this.data.objectArray)
    this.setData({
      objectArray: this.data.objectArray
    })
  },


  //星期picker 值发生变化时
  bindSexChange: function (e) {
    //找到当前picker对应的objectArray数组元素下标mark
    var objectArray = this.data.objectArray;
    var index = parseInt(e.currentTarget.dataset.index);
    var length = this.data.objectArray.length;
    var mark = length - index - 1;
    //微信小程序用setData修改数组或对象中的一个属性值
    //先用一个变量，把(objectArray[mark].accountIndexy)用字符串拼接起来
    var accountIndex = "objectArray[" + mark + "].accountIndex";
    //console.log(mark);
    //console.log('picker account 发生选择改变，携带值为', e.detail.value);
    //修改被选序号accountIndex并返回
    this.setData({
      [accountIndex]: e.detail.value
    })
    //console.log(objectArray);
  },

  //开始节数picker 值变化时
  bindNameChange: function (e) {
    //找到当前picker对应的objectArray数组元素下标mark
    var objectArray = this.data.objectArray;
    var index = parseInt(e.currentTarget.dataset.index);
    var length = this.data.objectArray.length;
    var mark = length - index - 1;
    var StudentName = "objectArray[" + mark + "].StudentName";
    //console.log(mark);
    //console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      [StudentName]: e.detail.value
    })
    //console.log(objectArray);
  },

  //结束节数picker 值变化时
  bindNumChange: function (e) {
    var objectArray = this.data.objectArray;
    var index = parseInt(e.currentTarget.dataset.index);
    var length = this.data.objectArray.length;
    var mark = length - index - 1;
    var StudentNum = "objectArray[" + mark + "].StudentNum";
    //console.log(mark);
    //console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      [StudentNum]: e.detail.value
    })
    //console.log(objectArray);
  },

})