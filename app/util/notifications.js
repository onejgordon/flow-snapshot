/* eslint-disable global-require */

var PushNotification = require('react-native-push-notification');
import util from './util';

const notifications = {

	setup: (nav) => {
		console.log('notifications.setup');
		PushNotification.configure({

		    // (optional) Called when Token is generated (iOS and Android)
		    onRegister: function(token) {
		        console.log( 'TOKEN:', token );
		    },

		    // (required) Called when a remote or local notification is opened or received
		    onNotification: function(notification) {
		        console.log( 'NOTIFICATION:', notification );
		        nav && nav.navigate('Snapshot');
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

	schedule_snapshot: (when) => {
		console.log("Scheduling notif for " + when);
		let ts = when.getTime();
		PushNotification.localNotificationSchedule({
			// id: id,
			title: "Snapshot",
		    message: "Snapshot time", // (required)
	        date: when,
	        vibrate: true,
	        vibration: 1000,
	        playSound: true
		});
	},

	show_message: (message) => {
		PushNotification.localNotification({
			title: message,
			message: message
		})
	},

	schedule_all_reminders_for_week: (reminders_per_week, _start_hour, _end_hour) => {
		console.log('schedule_all_reminders_for_week')
		let start_hour = _start_hour || 8;
		let end_hour = _end_hour || 23;
		let now = new Date();
		notifications.cancel_all_scheduled();
		let start_minute = start_hour * 60;
		let end_minute = end_hour * 60;
		let schedule_times = [];
		for (let i = 0; i < reminders_per_week; i++) {
			let day_index = parseInt(Math.random() * 6);
			let minute_in = start_minute + parseInt(Math.random() * (end_minute - start_minute));
			let date = new Date(now.getTime());
			date.setDate(date.getDate() + day_index);
			let hr = parseInt(minute_in / 60);
			let min = minute_in % 60;
			date.setHours(hr);
			date.setMinutes(min);
			if (date > now) schedule_times.push(date);
			else console.log('skipping date in past ' + date);
		}
		console.log(schedule_times);
		schedule_times.forEach((when) => {
			notifications.schedule_snapshot(when);
		});
	},

    cancel_all_scheduled: () => {
    	console.log("cancelling scheduled reminders...");
    	PushNotification.cancelAllLocalNotifications()
    }
};

export default notifications;
