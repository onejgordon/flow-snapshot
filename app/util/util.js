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
	},

    findIndexById: function(collection, id, _id_prop) {
        var id_prop = _id_prop || "id";
        var ids = collection.map(function(x) {return (x != null) ? x[id_prop] : null; });
        return ids.indexOf(id);
    },

    title_case(str) {
        return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
    }
}

export default util;