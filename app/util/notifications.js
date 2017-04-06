/* eslint-disable global-require */

var PushNotification = require('react-native-push-notification');
var util = require('./util');

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
		let ts = when.getTime();
		let id = (ts - 1491000000000).toString();
		PushNotification.localNotificationSchedule({
			id: id,
			title: "Snapshot",
		    message: "Snapshot time", // (required)
	        date: when
		});
	},

	show_message: (message) => {
		PushNotification.localNotification({
			title: message,
			message: message
		})
	},

	schedule_all_reminders_for_week: (reminders_per_week, _last_scheduled_reminder, start_hour, end_hour) => {
		console.log(reminders_per_week)
		console.log(last_scheduled_reminder)
		console.log(start_hour)
		let last_scheduled_reminder;
		if (typeof _last_scheduled_reminder === 'string') last_scheduled_reminder = new Date(_last_scheduled_reminder);
		else last_scheduled_reminder = null;
		let now = new Date();
		let do_schedule = true;
		if (last_scheduled_reminder) {
			let seconds_until_last_scheduled = (last_scheduled_reminder.getTime() - now.getTime()) / 1000;
			let days_until = seconds_until_last_scheduled / 60 / 60 / 24;
			if (days_until > 7) do_schedule = false;
		}
		console.log('do_schedule ' + do_schedule);
		if (do_schedule) {
			let first_day;
			if (!last_scheduled_reminder) last_scheduled_reminder = now;
			first_day = new Date(now.getTime());
			first_day.setDate(first_day.getDate() + 1); // Day after last
			let start_minute = start_hour * 60;
			let end_minute = end_hour * 60;
			let schedule_times = [];
			for (let i = 0; i < reminders_per_week; i++) {
				let day_index = parseInt(Math.random() * 6);
				let minute_in = start_minute + parseInt(Math.random() * (end_minute - start_minute));
				let date = new Date(first_day.getTime());
				date.setDate(date.getDate() + day_index);
				let hr = parseInt(minute_in / 60);
				let min = minute_in % 60;
				date.setHour(hr);
				date.setMinute(min);
				schedule_times.push(date);
			}
			console.log(schedule_times);
			schedule_times.forEach((when) => {
				schedule_snapshot(when);
			});
			// Return last time scheduled
			if (schedule_times.length > 0) return util.print_iso_date(schedule_times.sort()[schedule_times.length - 1].getTime());
			else return null;
		}
	},

    cancel_all_scheduled: () => {
    	PushNotification.cancelAllLocalNotifications()
    }
};

export default notifications;
