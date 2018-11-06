//获取Bmob
var Bmob = require('../../../utils/bmob.js')

Page({

  data: {
    Sex:["男","女"],
    student:0
  
  },
  onLoad: function (chuan_can) {
      console.log(chuan_can.studentId)
      this.setData({
        current_studentId: chuan_can.studentId
      })

      //从数据库获取数据
      var _this = this;
      var student = Bmob.Object.extend("student");
      var query_student = new Bmob.Query(student);
      query_student.get(chuan_can.studentId, {
        success: function (results) {
          console.log(results.attributes.Spoint)
          _this.setData({
            student: results,
            Spoint_judge: results.attributes.Spoint,
            Apoint_judge: results.attributes.Apoint,
            Bpoint_judge: results.attributes.Bpoint,
            Cpoint_judge: results.attributes.Cpoint,
            Dpoint_judge: results.attributes.Dpoint,
            
          })
        },
        error: function (error) {
          console.log("查询失败: " + error.code + " " + error.message);
        }
      })

  },
  
  //修改通知 提交时
  JudgeformSubmit: function (e) {
    //提交反馈
    wx.showToast({
      title: '提交中',
      icon: 'loading',
      duration: 5000
    })

    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    //获取通知信息
    var Spoint_change = parseInt(e.detail.value.Spoint_change);
    var Apoint_change = parseInt(e.detail.value.Apoint_change);
    var Bpoint_change = parseInt(e.detail.value.Bpoint_change);
    var Cpoint_change = parseInt(e.detail.value.Cpoint_change);
    var Dpoint_change = parseInt(e.detail.value.Dpoint_change);

    

    //修改student评价信息
    var current_studentId = this.data.current_studentId;
    var student = Bmob.Object.extend("student");
    var query = new Bmob.Query(student);
    query.get(current_studentId, {
      success: function (NewStudent) {
        //成功反馈
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })

        NewStudent.set("Spoint", Spoint_change);
        NewStudent.set("Apoint", Apoint_change);
        NewStudent.set("Bpoint", Bpoint_change);
        NewStudent.set("Cpoint", Cpoint_change);
        NewStudent.set("Dpoint", Dpoint_change);
        NewStudent.save();
        console.log("NewStudent修改成功")
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

  addS: function () {
    var Spoint = this.data.Spoint_judge;
    this.setData({
      Spoint_judge: Spoint+1
    })
  },
  addA: function () {
    var Apoint = this.data.Apoint_judge;
    this.setData({
      Apoint_judge: Apoint + 1
    })
  },
  addB: function () {
    var Bpoint = this.data.Bpoint_judge;
    this.setData({
      Bpoint_judge: Bpoint + 1
    })
  },
  addC: function () {
    var Cpoint = this.data.Cpoint_judge;
    this.setData({
      Cpoint_judge: Cpoint + 1
    })
  },
  addD: function () {
    var Dpoint = this.data.Dpoint_judge;
    this.setData({
      Dpoint_judge: Dpoint + 1
    })
  },
  
})