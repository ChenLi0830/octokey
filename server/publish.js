Meteor.publish("zenApps", function () {
    localSimulateLatency(2000);
    if (this.userId) {
        return ZenApps.find();
    }
});

Meteor.publish("userApps", function () {
    localSimulateLatency(1000);
    return UserApps.find({userId: this.userId})
});

Meteor.publish("zenCategories", function () {
    localSimulateLatency(500);
    if (this.userId) {
        return ZenCategories.find();
    }
});

Meteor.publish("appCredential", function (userId, appId, username) {
    localSimulateLatency(2000);
    //console.log("publish appCredential", userId, appId, username);
    //console.log("this.user", this.user);
    let result = UserAppCredentials.find(
        {
            $and: [
                {userId: userId},
                {
                    publicApps: {
                        $elemMatch: {
                            appId: appId,
                            username: username
                        }
                    }
                }
            ]
        },
        {fields: {'publicApps.$': 1}});
    return result;
});
