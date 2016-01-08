//addPublicApp(userId, appId)
//publicAppConfigured (userId, appId)
//getPublicApps (userId)
Meteor.methods({

  addPublicApp(appId, appName, logoURL, loginLink){
    console.log("addPublicApp start");
    const userId = Meteor.userId();

    if (!userId) {//没登录
      throw new Meteor.Error("not signed in");
    }
    const userExists = !!Meteor.users.find({_id: userId});
    if (!userExists) {//用户不存在
      throw new Meteor.Error("user doesn't exist");
    }

    const userHasApps = UserApps.find({userId: userId}).count();

    if (userExists && !userHasApps) {//如果用户存在,但在userHasApps里没有建立用户档案,就add new 档案
      UserApps.insert({
        userId: userId,
        publicApps: [],
        privateApps: []
      });
    }

    UserApps.update(//前面的check都通过,then add this public app to user's record
      {userId: userId},
      {
        $addToSet: {//用addToSet而不是push来防止已经有该app的情况
          "publicApps": {
            "appId": appId,
            "appName": appName,
            "logoURL": logoURL,
            "loginLink": loginLink,
            "configured": false
          }
        }
      }
    );
  },

  removePublicApp(appId){
    console.log("removePublicApp start");
    if (!Meteor.userId()) {
      throw new Meteor.Error("not logged in");
    }
    UserApps.update(
      {userId: Meteor.userId()},
      {
        $pull: {
          publicApps: {appId: appId}
        }
      }
    );
  },

  appConfigured(appId){
    console.log("addConfigured start");
    if (!Meteor.userId()) {
      throw new Meteor.Error("not logged in");
    }
    UserApps.update(
      {
        $and: [
          {"userId": Meteor.userId()},
          {"publicApps.appId": appId}
        ]
      },
      {
        $set: {
          "publicApps.$.configured": true
        }
      }
    )
  }
});