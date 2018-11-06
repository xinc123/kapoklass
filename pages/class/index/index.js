//index.js
//获取应用实例
const app = getApp()

//获取Bmob
var Bmob = require('../../../utils/bmob.js')


Page({
  data: {
    navbar: ['课程动态', '所有课程'],
    currentTab: 0,

    kind: ["课程通知", "上级通知", "比赛通知", "其他通知"],
    
    sort:["按时间排序","按优先排序"],
    sortCondition:true,
    
    // notices: [
    //   { objectId: 0, level: "无", level: "无", title: "无", kind: "无", deadline: "无"},
    // ],

    current_Day:0,

    isme:0
  },
  
  //每次显示页面都要刷新
  onShow() {
    this.onLoad()
  },

  onLoad: function () {
    var _this = this;
    //获取当前星期数
    var date = new Date();
    var current_Day = date.getDay();
    console.log(current_Day)
    //获取当前用户
    var currentUser = Bmob.User.current();
    var objectId = currentUser.id;
    console.log("教师：" + objectId);
    var isme = new Bmob.User();
    isme.id = objectId;
    this.setData({
      isme: isme,
      current_Day: current_Day
    })

    //获取通知数据
    var notice = Bmob.Object.extend("notice");
    var query_notice = new Bmob.Query(notice);
    query_notice.equalTo("ownUser", isme);
    query_notice.include("ownUser");

    var sortCondition = this.data.sortCondition;
    if(sortCondition){
      query_notice.ascending("deadline");
    }
    else{
      query_notice.descending("level");
    }
    // 查询所有数据
    query_notice.find({
      success: function (results) {
        // console.log("notices返回数据为：" , results)
        _this.setData({
          notices: results
        })
        // 循环处理查询到的数据
        // for (var i = 0; i < results.length; i++) {
        //   var object = results[i];
        //   console.log(object.id + ' - ' + object.get('content'));
        // }
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }

    });
    
    //获取课程时间表内容
    var lessonTime = Bmob.Object.extend("lessonTime");
    var query_lessonTime = new Bmob.Query(lessonTime);
    //条件查询：当前用户and当天课程
    query_lessonTime.equalTo("ownUser", isme);
    query_lessonTime.equalTo("day", current_Day);
    //用include把关联的表的数据也拿过来
    query_lessonTime.include("ownUser");
    query_lessonTime.include("ownLesson");    
    // 查询符合条件的所有数据
    query_lessonTime.find({
      success: function (query_lessonTime_results) {
        //console.log(query_lessonTime_results)        
        _this.setData({
          lessonTimes: query_lessonTime_results,
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }

    });

    //获取课程数据表内容
    var lessonData = Bmob.Object.extend("lessonData");
    var query_lessonData = new Bmob.Query(lessonData);
    query_lessonData.equalTo("ownUser", isme);
    query_lessonData.include("ownUser");

    // 查询所有数据
    query_lessonData.find({
      success: function (query_lessonData_results) {
        _this.setData({
          lessonDatas: query_lessonData_results,
          total_lesson: query_lessonData_results.length
        })
      },
      error: function (error) {
        console.log("查询失败: " + error.code + " " + error.message);
      }

    });

  },
  
  sortChange: function (e) {
    this.setData({
      sortCondition: (!this.data.sortCondition)
    })
    this.onLoad();
  },

  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
    
  }
})

