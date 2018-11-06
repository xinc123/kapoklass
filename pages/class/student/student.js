//获取Bmob
var Bmob = require('../../../utils/bmob.js')


Page({
  data: {
      isme:0,
      currentStudentId:0,
      student:0,
      Sex:["男","女"],
    

    //上课时间数据
    objectArray: [
      { id: 0, unique: 'unique_0', accountIndex: "0", Begin: 0, End: 0 },
    ]

  },
  

  onLoad: function (chuan_can) {
    //获取当前用户
    var currentUser = Bmob.User.current();
    var objectId = currentUser.id;
    //console.log("教师：" + objectId);
    var isme = new Bmob.User();
    isme.id = objectId;
    this.setData({
      isme: isme,
      currentStudentId: chuan_can.studentId
    })
    //console.log(chuan_can.studentId)

    //从数据库获取数据
    var _this = this;
    var student = Bmob.Object.extend("student");
    var query_student = new Bmob.Query(student);
    query_student.get(chuan_can.studentId, {
      success: function (results) {
        //console.log(results)
        _this.setData({
          student: results
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })

  },

  deleteStudent: function () {
    //提交反馈
    wx.showToast({
      title: '删除中',
      icon: 'loading',
      duration: 10000
    })
    var currentStudent_id = this.data.currentStudentId;
    var student = Bmob.Object.extend("student");
    var query = new Bmob.Query(student);
    query.get(currentStudent_id, {
      success: function (object) {
        object.destroy({
          success: function (deleteObject) {
            console.log('删除通知成功');
            //成功反馈
            wx.showToast({
              title: '删除学生成功',
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
  



});