openInfo = function(e){
	if(typeof e.source.nid != 'undefined'){
		var nid = e.source.nid;
		openController('infoDetail',nid);
	}
};
createInfoItem = function(infoItem){
	var item = Ti.UI.createTableViewRow({
		nid: infoItems[i].nid,
		height: "55dp",
		backgroundColor: Alloy.CFG.colors.first,
		backgroundSelectedColor: Alloy.CFG.colors.second,
	});
	item.addEventListener('click',function(e){
		openInfo(e);
	});
	var infoPostImage = (infoItem.image != null) ? infoItem.image : false;
	if(infoPostImage){
		var image = Ti.UI.createImageView({
			touchEnabled : false, 
			image : infoPostImage,
			width : Ti.UI.FILL,
			top : 0
		});
		item.add(image);
	}
	else{
		var label = Ti.UI.createLabel({
			touchEnabled : false, 
			text : infoItem.title,
			font : {
				fontSize : "20sp",
				fontFamily : Alloy.Globals.museo_slab_700
			},
			color : Alloy.CFG.colors.third
		});
		item.add(label);
	}
	return item;
};

var info = Alloy.Collections.instance('info');
info.fetch({query : "select * from info where type != 'Organizzatore'"});
var infoItems = info.toJSON();
for(var i = 0; i < infoItems.length; i++){
	var item = createInfoItem(infoItems[i]);
	$.tableViewinfo.appendRow(item);
}
info.fetch({query : "select * from info where type = 'Organizzatore' order by title desc"});
var infoItems = info.toJSON();
for(var i = 0; i < infoItems.length; i++){
	var item = createInfoItem(infoItems[i]);
	$.tableViewinfo.appendRow(item);
}

var item = Ti.UI.createTableViewRow({
	height: "55dp",
	backgroundColor: Alloy.CFG.colors.first,
	backgroundSelectedColor: Alloy.CFG.colors.second,
});
item.addEventListener('click',function(e){
	openController('credits');
});
var label = Ti.UI.createLabel({
	touchEnabled : false, 
	text : "Crediti",
	font : {
		fontSize : "20sp",
		fontFamily : Alloy.Globals.museo_slab_700
	},
	color : Alloy.CFG.colors.third
});
item.add(label);
$.tableViewinfo.appendRow(item);
