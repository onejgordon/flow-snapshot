/* eslint-disable global-require */

var PushNotification = require('react-native-push-notification');

const notifications = {

	setup: (nav) => {

		PushNotification.configure({

		    // (optional) Called when Token is generated (iOS and Android)
		    onRegister: function(token) {
		        console.log( 'TOKEN:', token );
		    },

		    // (required) Called when a remote or local notification is opened or received
		    onNotification: function(notification) {
		        console.log( 'NOTIFICATION:', notification );
		        nav && nav.dispatch({ type: 'Navigate', routeName: 'Snapshot', params: {} });
		    },

		    // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications)
		    // senderID: "YOUR GCM SENDER ID",

		    // IOS ONLY (optional): default: all - Permissions to register.
		    permissions: {
		        alert: true,
		        badge: true,
		        sound: true
		    },

		    // Should the initial notification be popped automatically
		    // default: true
		    popInitialNotification: true,

		    /**
		      * (optional) default: true
		      * - Specified if permissions (ios) and token (android and ios) will requested or not,
		      * - if not, you must call PushNotificationsHandler.requestPermissions() later
		      */
		    requestPermissions: true,
		});
	},

	start_click_listener: (navigate) => {
		Notification.addListener('press', function(e) {
		  switch (e.action) {
		    case 'SNAPSHOT':
	            console.log(`Action Triggered! Data: ${e.payload.data}`);
	            navigate('Snapshot', {});
		        break;
		  }
		});
	},

	remove_click_listeners: () => {
	},

	schedule_snapshot: (when) => {
		console.log("Scheduling notif for " + when);
		PushNotification.localNotificationSchedule({
		    message: "Snapshot time", // (required)
	        date: when // in 60 secs
		});
	},

    cancel_all_scheduled: () => {
    	PushNotification.cancelAllLocalNotifications()
    }
};

export default notifications;
