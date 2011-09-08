function _gel(id){
	return document.getElementById(id)
}

(function($) {
	$.gadgets = {}
	
	$.gadgets.io = {
			makeRequest: function(url, callback, opt_params) {
				params = {
					url: url
				};
				
				$.each(opt_params,function(param,value){
					params[param] = value;	
				});
				$.post("/makeRequest",params,callback);
			},
			AuthorizationType: {
				NONE: "NONE",
				OAUTH: "OAUTH",
				SIGNED: "SIGNED"
			},
			
			ContentType: {
				DOM:"DOM",
				FEED:"FEED",
				JSON:"JSON",
				TEXT:"TEXT"
			},
			RequestParameters: {},
			
			ProxyUrlRequestParameters: {
				REFRESH_INTERVAL: 5000
			},
			
			getProxyUrl: function(url, opt_params){
				return "/proxy?url="+url;
			}
			
	}
	
	$.gadgets.TabSet = function(opt_moduleId, opt_defaultTab, opt_container){
		//Falta tooltip e indicar el index
		var container;
		var tabs = null;
		var callbacks = new Array();//Save the tabs callbacks
		if(opt_container == null){
			container = $('<div>');
			$("body").prepend(container);
		}else container = $(opt_container);
		var tabsObject = new Array();

		

		this.addTab = function(name,params){
			
			$.params = params;//Global variable to avoid problems into "add" event
			if(tabs == null){//If is the first tab, we create the tabs widget
				//tabsObject[tabs.tabs( "length" )]=new $.gadgets.Tab({index:tabs.tabs( "length" ),callback:});
				if(params != null && params.callback != null){
					tabsObject[0]=new $.gadgets.Tab({index:0,callback:params.callback});
				}else tabsObject[0]=new $.gadgets.Tab({index:0,callback:null});
				
				
				var content = "";
				if(params != null){
					if(params.callback != null){
							callbacks[0]=params.callback;
						}
					if(params.contentContainer != null){
						content = params.contentContainer;
					}
				}
				 tabs = $('	<div id="tabs">'+
					'<ul>'+
						'<li><a href="#tabs-0">'+name+'</a></li>'+
					'</ul>'+
					'<div id="tabs-0">'+
					'	<p></p>'+
					'</div>'+
				'</div>');
				tabs.find("p").append(content);
				container.append(tabs);
				tabs.tabs({add: function(event,ui){
					var newTab = $(ui.panel);
					
					if($.params != null){
						if($.params.contentContainer != null){
							var tb = $('<p></p>');
							var orig = $($.params.contentContainer);
							orig.remove();
							tb.prepend(orig);
							newTab.append(tb);
						}else
							newTab.append('<p align="center"><br>'+
											'</p>');
											
						if($.params.callback != null){
							callbacks[ui.index]=$.params.callback;
						}
					}
					},
					select: function(event, ui) {
						try{
							
							callbacks[ui.index]();
						}catch(e){
							
						}
					}

				});
			}else{
			tabs.tabs('add', '#tabs-'+tabs.tabs( "length" ), name,tabs.tabs( "length" ));
		}


		}
		
		this.alignTabs = function(align,offset){
			//Not implemented
		}
		
		this.displayTabs = function(display){
			if(display)
				container.show();
			else
				container.hide();
		}
		
		this.getHeaderContainer = function(){
			//Not implemented
		}
		
		this.getSelectedTab = function(){
			var selectedIndex = $tabs.tabs('option', 'selected');
			var tabCallback = null;
			//if(callbacks
			
			//return algo
		}
		
		this.getTabs = function(){
		
		}
		
		this.removeTab = function(index){
			if(tabs != null)
				tabs.tabs( "remove", index );
		}
		
		this.setSelectedTab = function(index){
			tabs.tabs( "select" , index );
		}
		
		this.swapTabs = function(tabIndex1,tabIndex2){
		
		}
	}
	
	$.gadgets.Tab = function(params){
		var data = params;
    	
    	this.getContentContainer = function(){
			return $("#tabs-"+params['index']);
		}
		
    	this.getIndex = function(){
			return params['index'];
		}
		
    	this.getName = function(){
			//TODO
			return "Not implemented";
		}
		
    	this.getNameContainer = function(){
			//TODO
			return "Not implemented";
		}
		
    	this.getCallback = function(){
			return this.data['callback'];
		}

		
	}
	
	$.gadgets.util = {
		registerOnLoadHandler: function(callback){
			$(document).ready(callback);
		},
		escapeString: function(str){
			return str;
			var object = $("<div>");
			var someHtmlString = "<script>alert('hi!');</script>";
			object.text(someHtmlString);
			return object.text()
		},
		
		unescapeString: function(str){
			return str;
			var htmlNode = document.createElement('div');
			htmlNode.innerHTML = str;
			if (htmlNode.innerText) {
				return htmlNode.innerText; // IE
			}
			return htmlNode.textContent; // FF

		},
		
		hasFeature: function(feature){
			return false;
		}
	}
	
	//<Require feature="dynamic-height"/>
	$.gadgets.window = {
		adjustHeight: function(callback){
				parent.doIframe();
		},
		getViewportDimensions: function(callback){
			
		},
		setTitle: function(title){
			  pm({
				  target: window.parent,
				  type: "widget-"+__MODULE_ID__, 
				  data:{command:"settile",parameters:{title:title}}
				});
			
		}
	}
	//fin <Require feature="dynamic-height"/>
	
	//<Require feature="setprefs" />
	$.gadgets.Prefs =function(){
		this.getBool = function(key){
			return Boolean($.gadgets.prefs[key]);
		}
		this.getCountry = function(){
			return "es";
		}
		this.getFloat = function(key){
			return parseFloat($.gadgets.prefs[key]);
		}
		this.getArray = function(key){
			if ($.gadgets.prefs[key].constructor.toString().indexOf("Array") == -1)
				return $.gadgets.prefs[key];
			else
				return null;
		}
		this.getInt = function(key){
			return parseInt($.gadgets.prefs[key]);
		}
		this.getLang = function(){
			return "es";
		}
		this.getModuleId = function(){
			return $.gadgets.prefs["id"];
		}
		this.getMsg = function(key){
			console.log("msg "+key);
			return "";
		}
		this.getString = function(key){
			return ""+$.gadgets.prefs[key];
				
		}
		this.set = function(key,val){
			$.gadgets.prefs[key] = val;
			$.post("/setPrefs",{id:__MODULE_ID__,key:key,val:val});
			
			//console.log("set "+key+ " "+val);
		}
		this.setArray = function(key,val){
			$.gadgets.prefs[key] = val;
			$.post("/setPrefs",{key:key,val:$.toJSON(val)});
		}
	};
	//fin <Require feature="setprefs" />




	/////////RPC
	$.gadgets.rpc = {
		services: new Array(),
		call: function(targetId, serviceName, callback, var_args){
			var_args = {};
			if(callback == null){
				callback = function(){
					console.log("hola");
				}
			}
			callback = this.services[serviceName];
			$.jsonRPC.request("people.get", var_args, {
			  success: callback,
			  error: function(result) {

				// Result is an RPC 2.0 compatible response object
			  }
			});
		},
		
		register: function(serviceName, handler){
			this.services[serviceName] = handler;
		},
		registerDefault: function(handler){
			
		},
		unregister: function(serviceName){
			
		},
		unregisterDefault: function(){
			
		},
	}
	
	
	
	/***************/
	
	$.gadgets.wixet = {
            
		goTo: function(url){
			  pm({
				  target: window.parent,
				  type: "widget-"+__MODULE_ID__, 
				  data:{command:"goto",parameters:{url:url}}
				});
			
		},
                notice: function(content){
                    pm({
				  target: window.parent,
				  type: "widget-"+__MODULE_ID__, 
				  data:{command:"notice",parameters:{content:content}}
				});
                },
		alert: function(title,content){
			pm({
				  target: window.parent,
				  type: "widget-"+__MODULE_ID__, 
				  data:{command:"alert",parameters:{title:title,content:content}}
				});
		},
		Dialog: function(content,params){
			
			var dialog = content; //Remove script tag is done in the "server" frame
			
			//Click handlers////
			if(params.buttons){
				var buttons = new Array();
				$.each(params.buttons,function(i,button){
					pm.bind("dialog-button-"+i, function() {
						button();
					});
					//Only send the name of the event
					buttons.push(i);
				});
				params.buttons = buttons;
			}
			//////////////
			params.gadgetId = __MODULE_ID__;
			pm({
				  target: window.parent,
				  type: "widget-"+__MODULE_ID__, 
				  data:{command:"dialog",parameters:{dialog:dialog,params:params,action:"create"}}
				});
				
			this.getText = function(id){
				var dfd = new jQuery.Deferred();
				pm({
				  target: window.parent,
				  type: "widget-"+__MODULE_ID__, 
				  data:{command:"dialog",parameters:{action:"gettext",id:id}},
				  success:function(data){dfd.resolve(data);}
				});
				return dfd.promise();
			}
			
			this.setText = function(id,value){
				pm({
				  target: window.parent,
				  type: "widget-"+__MODULE_ID__, 
				  data:{command:"dialog",parameters:{action:"settext",id:id, value:value}}
				});
			}
			
			this.removeClass = function(id,className){
				pm({
				  target: window.parent,
				  type: "widget-"+__MODULE_ID__, 
				  data:{command:"dialog",parameters:{action:"removeClass",id:id,class:className}}
				});
			}
			
			this.addClass = function(id,className){
				pm({
				  target: window.parent,
				  type: "widget-"+__MODULE_ID__, 
				  data:{command:"dialog",parameters:{action:"addClass",id:id,class:className}}
				});
			}
			
			this.focus = function(id){
				pm({
				  target: window.parent,
				  type: "widget-"+__MODULE_ID__, 
				  data:{command:"dialog",parameters:{action:"focus",id:id}}
				});
			}
			
			this.open = function(){
				pm({
				  target: window.parent,
				  type: "widget-"+__MODULE_ID__, 
				  data:{command:"dialog",parameters:{action:"open"}}
				});
			}
			
			this.close = function(){
				pm({
				  target: window.parent,
				  type: "widget-"+__MODULE_ID__, 
				  data:{command:"dialog",parameters:{action:"close"}}
				});
				
			}
		}
	}
	/**************/
	/////////////
	$.gadgets.views = {
		getSupportedViews: function(){
			return {
				canvas:"CANVAS"
				};
		},
		requestNavigateTo: function(view,params){
			location.href = "http://code/info/memcache?view="+view;
			console.log(view);
			console.log(params);
		},
		ViewType: {
			CANVAS: "CANVAS",
			HOME: "HOME",
			PREVIEW: "PREVIEW",
			PROFILE: "PROFILE"
		},
	}
//Config
$.gadgets.io.RequestParameters = {
	AUTHORIZATION: $.gadgets.io.AuthorizationType.NONE,
	CONTENT_TYPE: $.gadgets.io.ContentType.TEXT,
	GET_SUMMARIES:"",
	HEADERS:"",
	METHOD:"",
	NUM_ENTRIES :"",
	POST_DATA :"",
	REFRESH_INTERVAL:""	
};
	
	
})(jQuery);
gadgets = $.gadgets;
