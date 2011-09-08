function doIframe(){
	o = document.getElementsByTagName('iframe');
	for(i=0;i<o.length;i++){
		//if (/\bautoHeight\b/.test(o[i].className)){
			setHeight(o[i]);
			//addEvent(o[i],'load', doIframe);
		//}
	}
}

function setHeight(e){
	if(e.contentDocument){
		e.height = e.contentDocument.body.offsetHeight + 35;
	} else {
		e.height = e.contentWindow.document.body.scrollHeight;
	}
}

function setWidgetTitle(title,id){
	$(document).find("#widget-"+id).find(".title").text(title);
}
