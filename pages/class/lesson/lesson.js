//index.js
//获取应用实例
const app = getApp()
//获取Bmob
var Bmob = require('../../../utils/bmob.js')
Page({
  data: {
    navbar: ['班级课程', '所有功能'],
    // navbar: ['班级课程', '所有功能', '资源'],    
    currentTab: 0,
    Sex:["男","女"],
    currentLesson_id: 0
  },

  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  //每次显示页面都要刷新
  onShow() {
    var currentLesson_id = this.data.currentLesson_id
    this.onLoad({ "lessonId": currentLesson_id });
  },

  onLoad: function (chuan_can_ID) {
    var _this = this;
    //获取当前用户
    var currentUser = Bmob.User.current();
    var objectId = currentUser.id;
    var isme = new Bmob.User();
    isme.id = objectId;
    console.log("课程："+chuan_can_ID.lessonId);    
    this.setData({
      isme: isme,
      currentLesson_id: chuan_can_ID.lessonId
    })
    
    //从数据库获取数据
    var currentLesson_id = chuan_can_ID.lessonId;
    var lessonData = Bmob.Object.extend("lessonData");
    var query_lessonData = new Bmob.Query(lessonData);
    query_lessonData.get(currentLesson_id, {
      success: function (results) {
        //console.log(results.attributes.class)
        //console.log(results)
        _this.setData({
          return_class: results.attributes.class,
          return_lessonName: results.attributes.lessonName,
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }
    })

    //从数据库获取数据
    //关联课程
    var student = Bmob.Object.extend("student");
    var query_class_student = new Bmob.Query(student);
    query_class_student.equalTo("ownUser", isme);
    var lessonData = Bmob.Object.createWithoutData("lessonData", chuan_can_ID.lessonId);
    query_class_student.equalTo("ownLesson", lessonData);

    query_class_student.find({
      success: function (query_class_students) {
        console.log("查询到的学生为：")
        console.log(query_class_students)
        
        _this.setData({
          students: query_class_students,
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }

    });

  },
  
  //删除课程，除了删除课程数据，还要删除课程时间,还要删除课程学生
  deleteLesson: function () {
    //提交反馈
    wx.showToast({
      title: '删除中',
      icon: 'loading',
      duration: 10000
    })

    //删除课程时间
    var lessonTime = Bmob.Object.extend("lessonTime");
    var query_lessonTime = new Bmob.Query(lessonTime);
    var currentLesson_id = this.data.currentLesson_id;
    var lessonData_delete = Bmob.Object.createWithoutData("lessonData", currentLesson_id);
    query_lessonTime.equalTo("ownLesson", lessonData_delete);
    query_lessonTime.destroyAll({
      success: function () {
        //成功反馈
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
        //删除成功
        console.log("删除课程时间成功")
      },
      error: function (err) {
        // 删除失败
        console.log("删除课程时间失败")        
      }
    });

    //删除课程学生
    var student = Bmob.Object.extend("student");
    var query_student = new Bmob.Query(student);
    query_student.equalTo("ownLesson", lessonData_delete);
    query_student.destroyAll({
      success: function () {
        //删除成功
        console.log("删除课程学生成功")
      },
      error: function (err) {
        // 删除失败
        console.log("删除课程学生失败")
      }
    });

    //删除课程数据
    var lessonData = Bmob.Object.extend("lessonData");
    var query = new Bmob.Query(lessonData);
    query.get(currentLesson_id, {
      success: function (object) {
        object.destroy({
          success: function (deleteObject) {
            console.log('删除课程数据成功');
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
            console.log('删除课程数据失败');
          }
        });
      },
      error: function (object, error) {
        console.log("query object fail");
      }
    });
  },
  
})

