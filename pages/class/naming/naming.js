//index.js
//获取应用实例
const app = getApp()
//获取Bmob
var Bmob = require('../../../utils/bmob.js')

Page({
  data: {
    navbar: ['随机点名', '抽查点名'],
    currentTab: 0,    
    Sex:["男","女"],
    currentLesson_ID:0
  },

  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  onLoad: function (chuan_can) {
    var _this = this;
    // console.log(chuan_can.lessonId)
    this.setData({
      currentLesson_ID: chuan_can.lessonId
    })
    

    //从数据库获取数据
    //关联课程
    var student = Bmob.Object.extend("student");
    var query_class_student = new Bmob.Query(student);
    var lessonData = Bmob.Object.createWithoutData("lessonData", chuan_can.lessonId);
    query_class_student.equalTo("ownLesson", lessonData);

    query_class_student.find({
      success: function (query_class_students) {
        // console.log("查询到的学生为：")
        // console.log(query_class_students)
        //获取随机学生
        var x = Math.floor(Math.random() * query_class_students.length)
        console.log("随机学生为：")
        console.log(query_class_students[x])   
        _this.setData({
          students: query_class_students,
          randomStudent: query_class_students[x]

        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }

    });
  },
  
  changeStudent:function(){
    var currentLesson_ID = this.data.currentLesson_ID
    this.onLoad({ "lessonId": currentLesson_ID })
  }

})

