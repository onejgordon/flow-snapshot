var util = {
    print_iso_date(ts) {
        let newDate = new Date();
        newDate.setTime(ts*1000);
        let year = newDate.getFullYear();
        let day = newDate.getDate();
        let month = newDate.getMonth();
        let dt = year+'-'+(month+1)+'-'+day;
        return dt;
    },

	serializeJSON(data) {
        return Object.keys(data).map(function (keyName) {
	        return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
        }).join('&');
	}
}

export default util;