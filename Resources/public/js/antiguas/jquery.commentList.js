(function($){
	$.fn.commentList = function(options) {
		
		var settings = $.extend({}, $.fn.commentList.defaults, options);
		var me = $(this);
		var paginator = $("<table align='center'><tr><td><div class='paginator'/></td> </tr></table>");
		var commentList =$('<div style="opacity: 1; display: block; overflow: visible; margin-left:5px; margin-right: 5px;">');
		function paginate(page){
				commentList.fadeOut("fast");
                                var req = opensocial.newDataRequest();
                                var params = {};
                                params['FIRST'] = (page-1)*settings.pageSize;
                                params['MAX'] = settings.pageSize;

                                if(settings.type == "mediaItem"){
                                    req.add(req.newFetchMediaItemCommentsRequest(settings.id,params), 'comments');
                                }else if(settings.type == "profile"){
                                    req.add(req.newFetchProfileCommentsRequest(settings.id,params), 'comments');
                                }

                                req.send(function(data){
                                    var comments = data.get('comments').getData();
                                    commentList.html("");
                                    comments.each(function(comment){
                                        var odd;
                                        if( (i % 2) == 0 )
                                        {
                                                        odd = 'class="ui-state-default ui-corner-all"';
                                        }else odd = "";

                                        /*var player ="";
                                        if(comment.sound.soundId != null){
                                                        player = '<span class="player" sound="'+comment.sound.id+'">'+
                                                                        '<a href="javascript:void(0)"><span class="stop icon-right ui-icon ui-icon-stop"></span></a>'+
                                                                        '<a href="javascript:void(0)"><span class="play icon-right ui-icon ui-icon-play"></span></a>'+
                                                                        '<span class="icon-right">'+comment.sound.name+'</span>'+
                                                                        '</span>';
                                        }*/
                                        var author = comment.getField('AUTHOR');
                                        commentObj=$('<table '+ odd +' width="100%">'+
                                        '<tbody>'+
                                        '       <tr>'+
                                        '               <td valign="top" width="50px">'+
                                        '                       <a class="ui-helper-reset" href="#profile/loadProfile/id/'+author.getId()+'" rel="history">'+
                                        '                               <img alt="'+author.getDisplayName()+'" title="'+author.getDisplayName()+'" src="'+ author.getField(opensocial.Person.Field.THUMBNAIL_URL) +'" class="ui-state-default ui-corner-all" border="0">'+
                                        '                       </a>'+
                                        '               </td>'+
                                        '               <td valign="top"><div style="color: rgb(0, 0, 0);">'+
                                        '                       <a class="ui-helper-reset" href="'+ author.getField(opensocial.Person.Field.PROFILE_URL) +'" rel="history" style="color: rgb(0, 0, 0);">'+
                                                                                        author.getDisplayName()+
                                        '                       ,</a>'+
                                        '                       <span>'+comment.getField('DATE')+'</span>'+
                                                       /* player +*/
                                        '                       </div>'+
                                        '                       <div>'+
                                        '                               <div class="comment" style="color: rgb(0, 0, 255); font-family: times new roman,times;">'+comment.getField('BODY')+'</div>'+
                                        '                       </div>'+
                                        '               </td>'+
                                        '       </tr>'+
                                        '</tbody>'+
                                        '</table>'+
                                        '<div><br/></div>');
                                        commentList.append(commentObj);
                                    });
                                    commentList.fadeIn("slow");
                                    $(".paginator").pager({pagenumber: page, pagecount: Math.ceil((comments.getTotalSize()/settings.pageSize)), buttonClickCallback: paginate});
                                    gadgets.window.adjustHeight();
                                });
				
									//el player y todo eso
							/*
                                $.each(this.widget.find(".player"),function(i,player){
                                        jplayer = $(player);
                                        jplayer.find(".play").click(function() {
                                                $.audioPlayer.play('/core/sound/play/id/'+$(this).parent().parent().attr("sound"));
                                        });
                                        
                                        jplayer.find(".stop").click(function() {
                                                
                                                $.audioPlayer.stop();
                                        });

                                });
                                
                                $.each(this.widget.find(".comment"),function(i,comment){
                                        var text = $(comment).html();
                                        $(comment).html("").append($.youtubePlayer.parseText(text));
                                });
                        */			
		}


                ///Text editor
                var editor = $("<div>");
                editor.editor({height:80, width:455,post:{
                                button:"Enviar",
                                type:settings.type,
                                id: settings.id,
                                callback:function(){
                                    paginate(1);
                                },
                                cleanOnSubmit: true
                        }
                });
                //////////////
                me.append(editor);
		me.append(commentList);
		me.append(paginator);
		
		paginate(1);
                                
                                


		
		
		
	};
	
	
	$.fn.commentList.defaults  = {
			pageSize : 10,
			width: 390
	};
	

	
	
})(jQuery);
