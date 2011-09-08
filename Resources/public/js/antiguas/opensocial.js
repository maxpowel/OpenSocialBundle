(function($) {
    
        //All opensocial objects will extend this class
        OpensocialObject = function(originalData,updateMethod){
        
                var data = null;
                
                if(originalData != null)
                    data = originalData
                else
                    data = {};
                
                this.getField = function(key,params){
			return data[key];
		}
		
		this.setField = function(key,value){
                    data[key] = value;
                    if(data['id'] != null){
                        var postData = {};
                        postData[key] = value;
                        postData['id'] = data['id'];
                        var obj = new $.osapi.Request(updateMethod,postData);
                        obj.execute();
                    }
		}
		
		this.getId = function(){
			return data['id'];	
		}	
	}
        

	$.opensocial = {}
        
        //Objects and creators
        
        //Activity
	$.opensocial.newActivity = function(){
		return new $.opensocial.Activity({});
	}
        
        $.opensocial.Activity = function(data){
            $.extend(this,new OpensocialObject(data,"activity.update"));
            var mediaItems = new Array();
	    $.each(data['mediaItems'],function(i,item){
                mediaItems.push(new $.opensocial.MediaItem(item));
            });
            data['mediaItems'] = mediaItems;
        }
	
        //Message
        $.opensocial.newMessage = function(){
		return new $.opensocial.Message({});
	}
        
        $.opensocial.Message = function(data){
		$.extend(this,new OpensocialObject(data,"message.update"));
	}

        //Album
	$.opensocial.newAlbum = function(data){
		return new $.opensocial.Album(data);
	}
	
	$.opensocial.Album = function(data){
		$.extend(this,new OpensocialObject(data,"album.update"));
	}
	
        //Media Item
	$.opensocial.newMediaItem = function(data){
		return new $.opensocial.MediaItem(data);
	}
	
	$.opensocial.MediaItem = function(data){
		$.extend(this,new OpensocialObject(data,"mediaItem.update"));
	}
	
        //Person
        $.opensocial.newPerson = function(data){
		return new $.opensocial.Person(data);
	}
        
        $.opensocial.Person = function(data){
                if(data == null) data = {};
		$.extend(this,new OpensocialObject(data,"person.update"));
                
                this.getDisplayName = function(){
                    return data['displayName'];
			
		}
		this.getAppData = function(key){
			
		}
	
		this.isOwner = function(){
		}
		
		this.isViewer = function(){
		}
                
                this.toJson = function(){
                    return $.toJSON(data);
                }
	}
        
        
        //Collection
        $.opensocial.newCollection = function(data,info){
		return new $.opensocial.Collection(data,info);
	}
        
        $.opensocial.Collection = function(original,infoOrig){
		var collection = original;
		var info = infoOrig;
		this.asArray = function (){
			return collection
		};
		
		this.each = function (fn){
			for(i in collection){
				fn(collection[i]);
			}
		};
		
		this.getById = function (id){
			return collection[id];
		};
		
		this.getOffset = function (){
			return info['offset'];
		};
		
		this.getTotalSize = function (){
			return info['totalResults'];
		};
		
		this.getSize = function (id){
			return collection.length;
		};
		
	}
        
        ////////WIXET objects (non opensocial standard)////////
        //Blog
        $.opensocial.newBlog = function(data){
		return new $.opensocial.Blog(data);
	}
	
        $.opensocial.Blog = function(params){
		var data = params;
		this.getTitle = function(){
			return data['title'];
		}
		
		this.getContent = function(){
			return data['content'];
		}
		
		this.getId = function(){
			return data['id'];
		}
	}
        
        //Group
        $.opensocial.newGroup = function(data){
		return new $.opensocial.Group(data);
	}
        
	$.opensocial.Group = function(data){
		$.extend(this,new OpensocialObject(data));
	}
    
        //Calendar
        $.opensocial.newCalendar = function(data){
		return new $.opensocial.Calendar(data);
	}
        
	$.opensocial.Calendar = function(params){
            var data;
            if(params != null){
                    data = params;

                    //
                    var d = data['start'].split(" ");
                    var dd = d[0].split("-");
                    var dh = d[1].split(":");


                    data['start'] = new Date(dd[0],(dd[1]-1),dd[2],dh[0],dh[1],dh[2]);
                    if(data['end'] != null){
                            d = data['end'].split(" ");
                            dd = d[0].split("-");
                            dh = d[1].split(":");
                            data['end'] = new Date(dd[0],(dd[1]-1),dd[2],dh[0],dh[1],dh[2]);
                    }
            }
            else
                    data = {};
                    
            $.extend(this,new OpensocialObject(data));
		
	}
        
        //Notification collection
        $.opensocial.newNotificationCollection = function(data){
		return new $.opensocial.NotificationCollection(data);
	}
        
        $.opensocial.NotificationCollection = function(original){
		var title = original['title'];
                var name = original['name'];
                
                var notificationArray = new Array();
                
                $.each(original['notifications'],function(i,item){
                    
			notificationArray.push(new $.opensocial.Notification(item));
		});
                
		this.notifications = new $.opensocial.Collection(notificationArray,{totalResults: notificationArray.length});
                
		
		this.getName = function(){
			return name;
		}
                
                this.getTitle = function(){
			return title;
		}
		
		
		
	}
        
        //Favourites
        $.opensocial.newFavourite = function(data){
                var req = new $.osapi.Request('profile.createFavourite',data);
                req.execute();
		return new $.opensocial.Favourite(data);
	}
	
        $.opensocial.Favourite = function(data){
                
                $.extend(this,new OpensocialObject(data));
                
		this.getName = function(){
			return data['name'];
		}
		
		this.getBody = function(){
			return data['body'];
		}
		
		this.getId = function(){
			return data['id'];
		}
	}
        
        
        //Notification
        $.opensocial.newNotification = function(data){
		return new $.opensocial.Notification(data);
	}
        
        $.opensocial.Notification = function(data){
		$.extend(this,new OpensocialObject(data));
	}
        
        /// END OBJECTS ////
        
        //Data Response
	$.opensocial.DataResponse = function(response){
		var data = response;
		this.get = function(key){
			return new $.opensocial.ResponseItem(data[key]);
		};
		this.getErrorMessage = function(){};
		this.hadError = function(){};
	}
	
	$.opensocial.ResponseItem = function(iniData){
		var data = iniData;
		this.getData = function(){
			return data;
		};
		this.getErrorCode = function(){};
		this.getErrorMessage = function(){};
		this.getOriginalDataRequest = function(){};
		this.hadError = function(){};

	}
	
	
	//////////////////////////////////////////////////
	
	
	
	
	$.opensocial.newDataRequest = function(){

		
		var dataRequest = function(){
			var items = new Array();
			this.add = function(request,opt_key){
				//request.execute()
				items.push({request:request,key:opt_key});
			}
			/////////////////////////////////////
			//Esto es de WIXET, no es estandar//
			/*BLOG*/
			this.newCreateBlogRequest = function(idspec,title,content){
				var obj = new $.osapi.Request('blog.create',{spec:idspec,title:title,content:content});
				//Extends
				obj.build = function(data){
					//console.log(data);
					return data.result;
				}
				return obj;
			}
			this.newFetchBlogRequest = function(idspec,params){
                                params['spec'] = idspec;
				var obj = new $.osapi.Request('blog.get',params);
				//Extends
				obj.build = function(data){
                                        //var result = $.evalJSON(data['result']);
                                        var result = data['result'];
					var blogs = new Array();
					$.each(result['entry'],function(i,element){
                                            
						blogs.push(new $.opensocial.Blog(element));
					});

					return new $.opensocial.Collection(blogs,{totalResults: result['totalResults']});
				}
				return obj;
			}
			
			this.newRemoveBlogRequest = function(blogId){
				var obj = new $.osapi.Request('blog.remove',{blogId:blogId});
				//Extends
				obj.build = function(data){
					return data.result;
				}
				return obj;
			}
			
			/* Comments */
			////Profile comment
			this.newCreateProfileCommentRequest = function(profileId,body,mediaItem){
				var obj = new $.osapi.Request('profile.createComment',{body:body,profileId:profileId,mediaItem:mediaItem});
				//Extends
				obj.build = function(data){
					return new $.opensocial.Comment(data.result);
				}
				return obj;
			}
			
			this.newFetchProfileCommentsRequest = function(profileId,params){
				var obj = new $.osapi.Request('profile.getComments',{profileId:profileId,params:params});
				//Extends
				obj.build = function(data){
					var result = data['result'];
					var commentList = new Array();
					$.each(result['entry'],function(i,element){
						commentList.push(new $.opensocial.Comment(element));
					});
					
                                        var info = result;
					info['entry'] = null;
                                        
					return new $.opensocial.Collection(commentList,info);
				}
				return obj;
			}
			
			this.newRemoveProfileCommentRequest = function(profileId,commentId){
				var obj = new $.osapi.Request('profile.removeComment',{profileId:profileId,commentId:commentId});
				//Extends
				obj.build = function(data){
					return data.result;
				}
				return obj;
			}
			////Media itemComment
			this.newCreateMediaItemCommentRequest = function(mediaItemId,body,params){
                                if(params == null)
                                    params = {}

                                params['body'] = body;
                                params['mediaItemId'] = mediaItemId;
				var obj = new $.osapi.Request('mediaItems.createComment',params);
				//Extends
				obj.build = function(data){
					return data.result;
				}
				return obj;
			}

			this.newFetchMediaItemCommentsRequest = function(mediaItemId,params){
                                params['mediaItemId'] = mediaItemId;
				var obj = new $.osapi.Request('mediaItems.getComments',params);
				//Extends
				obj.build = function(data){
					var result = $.evalJSON(data['result']);
					var commentList = new Array();
					$.each(result['entry'],function(i,element){
						commentList.push(new $.opensocial.Comment(element));
					});

					return new $.opensocial.Collection(commentList,{totalResults: result['totalResults']});
				}
				return obj;
			}

			this.newRemoveMediaItemCommentRequest = function(profileId,commentId){
				var obj = new $.osapi.Request('profile.removeComment',{profileId:profileId,commentId:commentId});
				//Extends
				obj.build = function(data){
					return data.result;
				}
				return obj;
			}
                        /* User group */
                        this.newFetchUserGroupsRequest = function(idspec,params){
                                if(params == null) params = {};
                                
                                params['spec'] = idspec;
				var obj = new $.osapi.Request('user.getGroups',params);
				//Extends
				obj.build = function(data){
                                        var result = data['result'];
					var groups = new Array();
					$.each(result['entry'],function(i,element){
                                            
						groups.push(new $.opensocial.Group(element));
					});

					return new $.opensocial.Collection(groups,{totalResults: result['totalResults']});
				}
				return obj;
			}
                        /* Album */
                        this.newFetchUserAlbumsRequest = function(idspec,params){
                                if(params == null) params = {};
                                
                                params['spec'] = idspec;
				var obj = new $.osapi.Request('user.getAlbums',params);
				//Extends
				obj.build = function(data){
                                        var result = data['result'];
					var groups = new Array();
					$.each(result['entry'],function(i,element){
                                            
						groups.push(new $.opensocial.Album(element));
					});

					return new $.opensocial.Collection(groups,{totalResults: result['totalResults']});
				}
				return obj;
			}
                        /* Notifications */
                        this.newFetchNotificationsRequest = function(idSpec,params){
                                params['idspec'] = idSpec;
				var obj = new $.osapi.Request('notifications.get',params);
				//Extends
				obj.build = function(data){
					var result = data['result'];
					var notificationList = new Array();
					$.each(result['entry'],function(i,element){
						notificationList.push(new $.opensocial.NotificationCollection(element));
					});
                                         
					return new $.opensocial.Collection(notificationList,{totalResults: result['totalResults']});
				}
				return obj;
			}
                        /* People query */
                        this.newFetchPeopleQuery = function(idspec,params){
                                params['spec'] = idspec;
				var obj = new $.osapi.Request('people.query',params);
				//Extends
				obj.build = function(data){
                                        //var result = $.evalJSON(data['result']);
                                        var result = data['result'];
					var people = new Array();
					$.each(result['entry'],function(i,element){
                                            
						people.push(new $.opensocial.Person(element));
					});

					return new $.opensocial.Collection(people,{totalResults: result['totalResults']});
				}
				return obj;
			}
			/* Message collection */
			this.newCreateMessageCollectionRequest = function(idspec, name){
				var obj = new $.osapi.Request('messages.createCollection',{name:name});
				//Extends
				obj.build = function(data){
					var result = data['result'];
					return result.id;
				}
				return obj;
			}

                        this.newFetchMessagesRequest = function(idspec, collectionId, params){
				var obj = new $.osapi.Request('messages.getMessages',{idspec:idspec,collectionId:collectionId,params:params});
				//Extends
				obj.build = function(data){
                                        var result = $.evalJSON(data['result']);
					var messages = new Array();
					$.each(result['entry'],function(i,element){
                                            
						messages.push(new $.opensocial.Message(element));
					});

					return new $.opensocial.Collection(messages,{totalResults: result['totalResults']});
				}
				return obj;
			}

                        this.newFetchMessageThreadRequest = function(idspec, messageId, params){
				var obj = new $.osapi.Request('messages.getMessageThread',{idspec:idspec,messageId:messageId,params:params});
				//Extends
				obj.build = function(data){
                                        var result = $.evalJSON(data['result']);
					var messages = new Array();
					$.each(result['entry'],function(i,element){

						messages.push(new $.opensocial.Message(element));
					});

					return new $.opensocial.Collection(messages,{totalResults: result['totalResults']});
				}
				return obj;
			}

			this.newDeleteMessageCollectionRequest = function(idspec, id){
				var obj = new $.osapi.Request('messages.deleteCollection',{id:id});
				//Extends
				obj.build = function(data){
					var result = data['result'];
					return result;
				}
				return obj;
			}
			
			/* Calendar task */
			this.newCreateCalendarEventRequest = function(title,allDay,start,end){
				var obj = new $.osapi.Request('calendar.create',{title:title,start:start,end:end,allDay:allDay});
				//Extends
				obj.build = function(data){
					return new $.opensocial.Calendar(data.result);
				}
				return obj;
			}
			
			this.newUpdateCalendarEventRequest = function(id,title,allDay,start,end){
				var obj = new $.osapi.Request('calendar.update',{id:id,title:title,start:start,end:end,allDay:allDay});
				//Extends
				obj.build = function(data){
					return new $.opensocial.Calendar(data.result);
				}
				return obj;
			}
			
			this.newFetchCalendarEventRequest = function(start,end){
				var obj = new $.osapi.Request('calendar.get',{start:start,end:end});
				//Extends
				obj.build = function(data){
					var result = data['result'];
					var calendarList = new Array();
					$.each(result,function(i,element){
						calendarList.push(new $.opensocial.Calendar(element));
					});
					
					return new $.opensocial.Collection(calendarList);
				}
				return obj;
			}
			
			this.newRemoveCalendarEventRequest = function(blogId){
				var obj = new $.osapi.Request('calendar.remove',{blogId:blogId});
				//Extends
				obj.build = function(data){
					return data.result;
				}
				return obj;
			}
                        
                        //Favourites
                        this.newFetchFavouritesRequest = function(idspec,params){
                                params['spec'] = idspec;
				var obj = new $.osapi.Request('profile.getFavourites',params);
				//Extends
				obj.build = function(data){
					var result = data['result'];
					var favouritesList = new Array();
					$.each(result,function(i,element){
						favouritesList.push(new $.opensocial.favourite(element));
					});
					
					return new $.opensocial.Collection(favouritesList,{totalResults: result['totalResults']});
				}
				return obj;
			}
			
			this.newRemoveFavouriteRequest = function(favouriteId){
				var obj = new $.osapi.Request('profile.removeFavourite',{favouriteId:favouriteId});
				//Extends
				obj.build = function(data){
					return data.result;
				}
				return obj;
			}
/*TODO REVISAR ESTO DE LOS PERMISOS */                        
                        this.newAddPermissionRequest = function(type,id,permission){
                                var permissionArr = {userId: permission.getField("userId"), groupId: permission.getField("groupId"), readGranted: permission.getField("readGranted"), readDenied: permission.getField("readDenied"), writeGranted: permission.getField("writeGranted"), writeDenied: permission.getField("writeDenied")};
				var obj = new $.osapi.Request('user.addPermission',{type:type,id:id,permission:permissionArr});
				//Extends
				obj.build = function(data){
					return new $.opensocial.Calendar(data.result);
				}
				return obj;
			}
			////////////////////////////////////
			
			
			this.newCreateAlbumRequest = function(idspec, title){
				//var obj = new $.osapi.Request('albums.create',{title:album.getField(opensocial.Album.Field.TITLE)});
				var obj = new $.osapi.Request('albums.create',{title:title});
				//Extends
				obj.build = function(data){
					var result = data['result'];
					return result.id;
					//return new $.opensocial.Album(result);
				}
				return obj;
			}
			
			this.newDeleteAlbumRequest = function(idspec, id){
				var obj = new $.osapi.Request('albums.delete',{id:id});
				//Extends
				obj.build = function(data){
					var result = data['result'];
					return result;
				}
				return obj;
			}
			
			this.newCreateMediaItemRequest = function(idspec, albumId, mediaItem){}
			this.newFetchActivitiesRequest = function(idspec, opt_params){
				var obj = new $.osapi.Request('activities.get',opt_params);
				//Extends
				obj.build = function(data){
                                        //var result = $.evalJSON(data['result']);
                                        var result = data['result'];
					var activities = new Array();
					$.each(result['entry'],function(i,element){
                                            
						activities.push(new $.opensocial.Activity(element));
					});

					return new $.opensocial.Collection(activities,{totalResults: result['totalResults']});
				}
				return obj;
			}
			this.newFetchMediaItemsRequest = function(idspec, albumId, opt_params){
				opt_params[opensocial.MediaItem.Field.ALBUM_ID] = albumId;
				var obj = new $.osapi.Request('mediaItems.get',opt_params);
				//Extends
				obj.build = function(data){
					
					var result = $.evalJSON(data['result']);
					var mediaItems = new Array();
					$.each(result['entry'],function(i,element){
						mediaItems.push(new $.opensocial.MediaItem(element));
					});
					var info = result;
					info['entry'] = null;
					
					return new $.opensocial.Collection(mediaItems,info);
				}
				return obj;
			}
			this.newFetchPersonAppDataRequest = function(){}
			this.newFetchPersonRequest = function(id,params){
                                if(params == null) params = {};
				var obj = new $.osapi.Request('people.get',params);
				//Extends
				obj.build = function(data){
					var person = new $.opensocial.Person(data['result'][0]);
					return person;
				}
				return obj;
			}
			this.newRemovePersonAppDataRequest = function(){}
			this.newUpdateAlbumRequest = function(){}
			this.newUpdateMediaItemRequest = function(idSpec, albumId, mediaItemId, fields){
                            var obj = new $.osapi.Request('mediaItems.update',{mediaItemId: mediaItemId, fields:fields});
				//Extends
				obj.build = function(data){
                                        //TODO hacer que devuelva si ha habido error o no
					return true;
				}
				return obj;
                        }
			this.newUpdatePersonAppDataRequest = function(){}
			this.send = function(callback){
				var batch = new Array();
				$.each(items,function(i,element){
					var id;
					if(element.key != null)
						id = element.key;
					else
						id = i;
						
					batch.push({method:element.request.command, params:element.request.params, id:id});
				});
				$.jsonRPC.batchRequest(batch, { 
						success: function(result) {
							if(callback != null){
								var dataElements = new Array();
								try{
									
									$.each(result,function(i,element){
										//Con build cada request crea su estructura con el json
										//Ej: fetchPerson creara un person, fetchPeople un collection<person>
										dataElements[element.id] = items[i].request.build(element);
									});
									var data = new $.opensocial.DataResponse(dataElements);
									if(callback != null)
										callback(data)
								}catch(e){
									console.log("Error while building gadget response: "+e.message);
								}
							}
						}
					  });
			}
			
			};
		return new dataRequest();
	}
	
	
	
	
	
    $.opensocial.getEnvironment = function(){}
    $.opensocial.hasPermission = function(){}
    $.opensocial.invalidateCache = function(){}
    
    
    $.opensocial.newIdSpec = function(params){
        var idSpec = function(){
                var items = new Array();

                this.getAll = function(){
                        return items;
                }

                this.getField = function(key, opt_params){
                        return items[key];
                };

                this.setField = function(key, data){
                        items[key] = data;
                };

        }
        var spec = new idSpec();
        if(params){
                $.each(params,function(key,data){

                        //Special words like VIEWER, OWNER...
                        if($.idSpecValues[data] != null){
                                spec.setField(key,$.idSpecValues[data]);
                        }
                        else
                                spec.setField(key,data);
                });
        }

        return spec;
    }
   
    $.opensocial.newNavigationParameters = function(){}
    $.opensocial.requestCreateActivity = function(){}
    $.opensocial.requestPermission = function(){}
    $.opensocial.requestSendMessage = function(){}
    $.opensocial.requestShareApp = function(){}
    $.opensocial.requestUploadMediaItem = function(){}

	
	
	
	////Constants/////////


        $.opensocial.Person.Field = {
		GENDER : "gender",
		BOOKS : "books",
                ID : "id",
                NAME: "name",
                THUMBNAIL_URL: "thumbnailUrl",
                PROFILE_URL: "profileUrl",
                ADDRESSES: "addresses",
                EMAILS: "emails",
                PHONE_NUMBERS: "phoneNumbers",
                URLS: "urls"

	}
        
	$.opensocial.MediaItem.Field = {
		ALBUM_ID : "albumId",
		CREATED : "created",
		DESCRIPTION : "description",
		DURATION : "duration",
		FILE_SIZE : "fileSize",
		ID : "id",
		LANGUAGE : "language",
		LAST_UPDATED : "lastUpdated",
		LOCATION : "location",
		MIME_TYPE : "mimeType",
		NUM_COMMENTS : "numComments",
		NUM_VIEWS : "numViews",
		NUM_VOTES : "numVotes",
		RATING : "rating",
		START_TIME : "startTime",
		TAGGED_PEOPLE : "taggedPeople",
		TAGS : "tags",
		THUMBNAIL_URL : "thumbnailUrl",
		TITLE : "title",
		TYPE : "type",
		URL : "url"
	}
	$.opensocial.MediaItem.Type = {
		AUDIO : "audio",
		IMAGE : "image",
		VIDEO : "video"
	}
	
	$.opensocial.Album.Field = {
		DESCRIPTION : "description",
		ID : "id",
		LOCATION : "location",
		MEDIA_ITEM_COUNT : "mediaItemCount",
		MEDIA_MIME_TYPE : "mediaMimeType",
		MEDIA_TYPE : "mediaType",
		OWNER_ID : "ownerId",
		THUMBNAIL_URL : "thumbnailUrl",
		TITLE : "title"
	}
	
	$.opensocial.IdSpec = {
		Field:{
			GROUP_ID : "groupId",
			NETWORK_DISTANCE : "networkDistance",
			USER_ID : "userId"
		},
		GroupId:{
			ALL : "ALL",
			FRIENDS : "FRIENDS",
			SELF : "SELF"
		},
		PersonId:{
			OWNER : "OWNER",
			VIEWER : "VIEWER"
		}
	}
	$.idSpecValues = new Array();
	$.idSpecValues[$.opensocial.IdSpec.PersonId.VIEWER] = "@viewer";
	$.idSpecValues[$.opensocial.IdSpec.PersonId.OWNER] = "@owner";
	$.idSpecValues[$.opensocial.IdSpec.GroupId.ALL] = "@all";
	$.idSpecValues[$.opensocial.IdSpec.GroupId.FRIENDS] = "@friends";
	$.idSpecValues[$.opensocial.IdSpec.GroupId.SELF] = "@self";

	$.opensocial.DataRequest = {
		ActivityRequestFields:{
			FIRST : "FIRST",
			MAX : "MAX"
		},	
		AlbumRequestFields:{
			FIRST : "FIRST",
			MAX : "MAX"
		},	
		DataRequestFields:{
			ESCAPE_TYPE : "escapeType"
		},	
		FilterType:{
			ALL : "all",
			HAS_APP : "hasApp",
			IS_FRIENDS_WITH : "isFriendsWith",
			TOP_FRIENDS : "topFriends"
		},	
		MediaItemRequestFields:{
			FIRST : "FIRST",
			MAX : "MAX"
		},	
		PeopleRequestFields:{
			APP_DATA : "appData",
			ESCAPE_TYPE : "escapeType",
			FILTER : "filter",
			FILTER_OPTIONS : "filerOptions",
			FIRST : "first",
			MAX : "max",
			PROFILE_DETAILS : "profileDetails",
			SORT_ORDER : "sortOrder"
		},	
		SortOrder:{
			NAME : "name",
			TOP_FRIENDS : "topFriends"
		}
	}

	$.opensocial.Activity.Field = {
			/*APP_ID:{text:"appId",editable:false},
			BODY: {text:"body",editable:true},
			ID:{text:"id",editable:false},
			MEDIA_ITEMS:{text:"mediaItems",editable:true},
			POSTED_TIME:{text:"postedTime",editable:false},
			STREAM_FAVICON_URL: {text:"streamFaviconUrl",editable:true},
			TITLE : {text:"title",editable:true},
			URL : {text:"url",editable:true},
			USER_ID : {text:"userId",editable:false},*/
			APP_ID: "appId",
			BODY: "body",
			ID: "id",
			MEDIA_ITEMS: "mediaItems",
			POSTED_TIME: "postedTime",
			STREAM_FAVICON_URL:"streamFaviconUrl",
			TITLE : "title",
			URL : "url",
			USER_ID : "userId"
		}

	$.opensocial.Calendar.Field = {
		START : "start",
		END : "end",
		TITLE : "title",
		ALL_DAY : "allDay",
		URL: "url",
		TYPE: "type",
		CLASS_NAME: "className",
		EDITABLE: "editable"
	}
	
	$.opensocial.Calendar.Type = {
		TASK : "task",
		EVENT : "event",
		BIRTHDAY : "birthday"
	}

        $.opensocial.Message.Field = {
                APP_URL : "appUrl",
                BODY : "body",
                BODY_ID : "bodyId",
                COLLECTION_IDS : "collectionIds",
                ID : "id",
                IN_REPLY_TO : "inReplyTo",
                RECIPIENTS : "recipients",
                REPLIES : "replies",
                SENDER_ID : "senderId",
                STATUS : "status",
                TIME_SENT : "timeSent",
                TITLE : "title",
                TITLE_ID : "titleid",
                TYPE : "type",
                UPDATED : "updated",
                URLS : "urls"
        }
	
})(jQuery);
opensocial = $.opensocial;
