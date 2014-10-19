openTalk = function(e){
	if(typeof e.source.nid != 'undefined'){
		var nid = e.source.nid;
		openController('talkDetail',nid);
	}
};
transformFunction = function(transform){
	var speaker = Alloy.Collections.instance('speaker');
	speaker.fetch();
	speakerData = speaker.get(transform.uid);

	if(typeof speakerData != 'undefined'){
		transform.name = speakerData.get("name");
		transform.surname = speakerData.get("surname");
	}
	else{
		transform.name = "";
		transform.surname = "";
	}
	return transform;
};
function createRow(talkHoursList,talkData){
	var tableViewSections = new Array();
	var hoursIndexes = new Array();
	for(var i = 0; i < talkHoursList.length; i++){
		if(parseInt(talkHoursList[i].end) < now){
			continue;
		}
		var start = new Date(parseInt(talkHoursList[i].start) * 1000);
		start = start.getHours() + ":" + start.getMinutes();
		var end = new Date(parseInt(talkHoursList[i].end) * 1000);
		end = end.getHours() + ":" + end.getMinutes();
		talkHoursList[i].time = start + " - " + end;
		var headerViewElement = Ti.UI.createView({layout: "vertical",height: Ti.UI.SIZE});
		$.addClass(headerViewElement,"headerSession");
		var timeContainer = Ti.UI.createView({touchEnabled : false, layout: "absolute",height: Ti.UI.SIZE, width: Ti.UI.FILL});
		var time = Ti.UI.createLabel({touchEnabled : false, text : talkHoursList[i] .time});
		$.addClass(time,"scheduleDate");
		var headerSeparatorTop = Ti.UI.createView();
		$.addClass(headerSeparatorTop,"headerSeparatorTop");
		var headerSeparatorBottom = Ti.UI.createView();
		$.addClass(headerSeparatorBottom,"headerSeparatorBottom");
		headerViewElement.add(headerSeparatorTop);
		timeContainer.add(time);
		if(parseInt(talkHoursList[i].start) < now){
			var liveNow = Ti.UI.createView({width : "20dp", height: "20dp", borderRadius : "10dp", backgroundColor : "#00ff00", right: "5%", top: "3dp"});
			timeContainer.add(liveNow);
		}
		headerViewElement.add(timeContainer);
		headerViewElement.add(headerSeparatorBottom);
		hoursIndexes[talkHoursList[i].start + "-" + talkHoursList[i].end] = i;
		tableViewSections[i] = Ti.UI.createView({layout: "vertical", height : Ti.UI.SIZE, start : talkHoursList[i].start, end : talkHoursList[i].end});
		tableViewSections[i].add(headerViewElement);
	}
	var tableView = Ti.UI.createScrollView({layout: "vertical", scrollType : "vertical"});
	for(var i = 0; i < talkData.length; i++){
		if(parseInt(talkData[i].end) < now){
			continue;
		}
		var talk =  transformFunction(talkData[i]);
		var tableViewRow = Ti.UI.createView({nid : talk.nid, height: Ti.UI.SIZE});
		tableViewRow.addEventListener('click',function(e){
			openTalk(e);
		});
	    var rowView = Ti.UI.createView({touchEnabled : false, layout : "horizontal", width: Ti.UI.FILL, height: Ti.UI.SIZE});
		$.addClass(rowView,"rowView");
		var title = Ti.UI.createLabel({touchEnabled : false, text : talk.title});
		$.addClass(title,"listTitle");
		var speaker = Ti.UI.createLabel({touchEnabled : false, text : talk.name + " " + talk.surname});
		$.addClass(speaker,"listSpeaker");
		
		var track = Ti.UI.createLabel({touchEnabled : false, text : talk.track});
		$.addClass(track,"listTrack");
	    var rowViewLeft = Ti.UI.createView({touchEnabled : false, layout : "vertical", width: "80%", height: Ti.UI.SIZE});
	    var rowViewRight = Ti.UI.createView({touchEnabled : false, layout : "vertical", width: "20%", height: Ti.UI.SIZE});
		
		rowViewLeft.add(title);
		rowViewLeft.add(speaker);
//		rowViewRight.add(twitter);
		rowViewRight.add(track);
		rowView.add(rowViewLeft);
		rowView.add(rowViewRight);
		tableViewRow.add(rowView);
		hoursIndex = hoursIndexes[talk.start + "-" + talk.end];
		tableViewSections[hoursIndex].add(tableViewRow);
	}
	for(var i = 0; i < tableViewSections.length; i++){
		if(typeof tableViewSections[i] != 'undefined' && tableViewSections[i].children.length > 1){
			for(var j = 0; j < tableViewSections[i].children.length; j++){
				if(j != 0 && j != (tableViewSections[i].children.length-1)){
					var rowSeparator = Ti.UI.createView();
					$.addClass(rowSeparator,"rowSeparator");
					tableViewSections[i].children[j].children[0].add(rowSeparator);
				}
			}
		}
		if(typeof tableViewSections[i] != 'undefined'){
			tableView.add(tableViewSections[i]);
		}
	}
	return tableView;
}
var updateView = function(){
	var tableView = $.schedule_live.children[0];
	var now = new Date().getTime()/1000;
	if(tableView.children.length > 0){
		for(var i = 0; i < tableView.children.length; i++){
			if(tableView.children[i].end < now){
				tableView.remove(tableView.children[i]);
				i--;
			}
			else if(tableView.children[i].start < now){
				var liveNow = Ti.UI.createView({width : "20dp", height: "20dp", borderRadius : "10dp", backgroundColor : "#00ff00", right: "5%", top: "3dp"});
				tableView.children[i].children[0].children[1].add(liveNow);
			}
		}
	}
	else{
		$.schedule_live.visible = false;
		var day1 = new Date("2014-11-14 23:59:59").getTime()/1000;
		var day2 = new Date("2014-11-15 23:59:59").getTime()/1000;
		if(now < day1){
			$.conference.visible = true;
		}
		else if(now < day2){
			$.conference.visible = false;
			$.formazione.visible = true;
		}
		else if(now > day2){
			$.conference.visible = false;
			$.formazione.visible = false;
			$.grazie.visible = true;
		}
	}
};
var now = new Date().getTime()/1000;
var talk = Alloy.Collections.instance('talk');
talk.fetch({query : "select start, end from talk group by start,end order by start, end ASC"});
var talkHoursList = talk.toJSON();
talk.fetch({query : "select * from talk order by start ASC"});
var talkList = talk.toJSON();
$.schedule_live.add(createRow(talkHoursList,talkList));
updateView();
setInterval(function(){
	updateView();
}, 60000);
