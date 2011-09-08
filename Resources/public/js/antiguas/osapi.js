(function($) {
	$.osapi = {}
	$.osapi.Request = function(command,params){

		if(params == null)
			params = {};
		
		if(params.userId == null)
			params.userId = "@me"
			
		if(params.groupId == null)
			params.groupId = "@self";
		
		this.command = command;
		this.params = params;
		
		this.execute = function(callback){
			$.jsonRPC.request(this.command, this.params, {
			  success: function(result) {
				  try{
				  	callback(result.result);
					}catch(e){
						}
				// Do something with the result here
				// It comes back as an RPC 2.0 compatible response object
			  },
			  error: function(result) {

				// Result is an RPC 2.0 compatible response object
			  }
			});
		}
	}
	$.osapi.people = {
			get: function(params) {
				if(params == null)
					params = { userId : "@me", groupId : "@self"};
				
				return new $.osapi.Request('people.get',params);
			},
			getViewer: function(params) {
				return $.osapi.people({userId:"@viewer"});
			},
			getViewerFriends: function(params) {
				
			},
			getOwner: function(params) {
				return $.osapi.people({userId:"@owner"});
			},
			getOwnerFriends: function(params) {
				
			}
	
	}
	$.osapi.activities = {
			get: function(params) {
				if(params == null)
					params = { appId:"@app", userId : "@me", groupId : "@self"};
				return new $.osapi.Request('activities.get',params);
			},
			create: function(params) {
				if(params == null)
					params = { appId:"@app", userId : "@me", groupId : "@self"};
				return new $.osapi.Request('activities.create',params);
			}
	
	}
	
	
	$.osapi.appdata = {
			get: function(params) {
				if(params == null)
					params = { appId:"@app", userId : "@me", groupId : "@self"};
				return new $.osapi.Request('appdata.create',params);
			},
			update: function(params) {
				if(params == null)
					params = { appId:"@app", userId : "@me", groupId : "@self"};
				return new $.osapi.Request('appdata.create',params);
			},
			delete: function(params) {
				if(params == null)
					params = { appId:"@app", userId : "@me", groupId : "@self"};
				return new $.osapi.Request('appdata.create',params);
			}
	}
	
	$.osapi.messages = {
		//Como a mi me de la gana
		//https://sites.google.com/a/lrlab.to/opensocial-pages/opensocial/messages
			send: function(params) {
				if(params == null)
					params = { userId : "@me", groupId : "@self"};
			}
	}
	
	$.osapi.http = {
			head: function(params) {
				if(params == null)
					params = { userId : "@me", groupId : "@self"};
			},
			get: function(params) {
				
			},
			put: function(params) {
			},
			post: function(params) {
			},
			delete: function(params) {
			}
	}
				
		
})(jQuery);
osapi = $.osapi;
