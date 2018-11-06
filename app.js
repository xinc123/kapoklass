var Bmob = require('utils/bmob.js')
Bmob.initialize(
  '9948b7e9e093a835162a03fc7d8f5cb1',
  '14eeab9c6549e499c844f41778b701e7'
)

App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {

    var user = new Bmob.User();//开始注册用户

    var newOpenid = wx.getStorageSync('openid')
    if(!newOpenid){

      wx.login({
        success:function(res){
          user.loginWithWeapp(res.code).then(function(user){
            var openid = user.get("authData").weapp.openid;
            console.log(user,'user',user.id,res);

            if(user.get("nickName")){
              //第二次访问
              console.log(user.get("nickName"),'res.get("nickName")');
              
              wx.setStorageSync('openid', openid)
            }else{
              //保存用户其他信息
              wx.getUserInfo({
                success:function(result){
                  var userInfo = result.userInfo;
                  var nickName = userInfo.nickName;
                  var avatarUrl = userInfo.avatarUrl;

                  var u = Bmob.Object.extend("_User");
                  var query = new Bmob.Query(u);
                  //这个id是要修改条目的id，你在生成这个存储并成功时可以获取到
                  query.get(user.id,{
                    success:function(result){
                      result.set('nickName',nickName);
                      result.set('userPic',avatarUrl);
                      result.set('openid',openid)
                      result.save();
                    }
                  });
                }
              });
             }
            },function(err){
              console.log(err,'errr');
            });
          }
        });
      }

    },
    getUserInfo:function(cb){
      var that = this
      if(this.globalData.userInfo){
        typeof cb == "function" && cb(this.globalData.userInfo)
      }else{
        //调用登录接口
        wx.login({
          success:function(){
            wx.getUserInfo({
              success:function(res){
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
              }
            })
          }
        })
      }
      },
      globalData:{
        userInfo:null,
        pageReady:false
      }
})
