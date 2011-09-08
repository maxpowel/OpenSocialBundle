(function($) {
	
	$.widget.profileComments = {
			widget: null,
			init: function(widget) {
				this.widget = $(widget);
				var widget = this.widget;
				var id = $.url.getParam("id");
				this.widget.find("#cont-writeComment").editor({height:80, width:455});
				this.widget.find("#but-sendComment").button().click(function(){
					
					if(widget.find("#cont-writeComment").find(".text").html().length > 0)
					{
						widget.find("#cont-writeComment").editor({send: "/core.php/profile/newComment/id/"+id, callback: function(){ $.widget.profileComments.paginate(1) }});
					}
				});
				this.prepareComments();
				widget.find(".paginator").pager({ pagenumber: 1, pagecount: widget.find("#txt-pageCount").val(), buttonClickCallback: $.widget.profileComments.paginate });
			},
			
			paginate: function(page){
				var widget = $.widget.profileComments.widget;
				var thisWidget = $.widget.profileComments;
				widget.find("#cont-comments").fadeOut("fast");
				 $.getJSON("/core.php/profile/getComments/id/"+$.url.getParam("id")+"/page/"+page,
					function(data)
					{
					 	widget.find(".paginator").pager({ pagenumber: page, pagecount: data.pagecount, buttonClickCallback: $.widget.profileComments.paginate });
					 
					 	widget.find("#cont-comments").html("");
					 		var commentList = widget.find("#cont-comments");
							$.each(data.comments, function(i,comment){
								var odd;
								if( (i % 2) == 0 )
								{
									odd = 'class="ui-state-default ui-corner-all"';
								}else odd = "";
								
								var player ="";
								if(comment.sound.sound_id != null){
									player = '<span class="player" sound="'+comment.sound.sound_id+'">'+
										'<a href="javascript:void(0)"><span class="stop icon-right ui-icon ui-icon-stop"></span></a>'+
										'<a href="javascript:void(0)"><span class="play icon-right ui-icon ui-icon-play"></span></a>'+
										'<span class="icon-right">'+comment.sound.name+'</span>'+
										'</span>';
								}
								
								commentObj=$('<table '+ odd +' width="100%">'+
								'<tbody>'+
								'	<tr>'+
								'		<td valign="top" width="50px">'+
								'			<a class="ui-helper-reset" href="#profile/loadProfile/id/'+comment.author.id+'" rel="history">'+
								'				<img alt="'+comment.author.name+'" title="'+comment.author.name+'" src="/core/photo/thumbnail/id/'+comment.author.face+'/type/mini" class="ui-state-default ui-corner-all" border="0">'+
								'			</a>'+
								'		</td>'+
								'		<td valign="top"><div style="color: rgb(0, 0, 0);">'+
								'			<a class="ui-helper-reset" href="#profile/loadProfile/id/'+comment.author.id+'" rel="history" style="color: rgb(0, 0, 0);">'+
											comment.author.name+
								'			,</a>'+
								'			<span>'+$._datetime(comment.date)+'</b></span>'+
									player +
								'			</div>'+
								'			<div>'+
								'				<div class="comment" style="color: rgb(0, 0, 255); font-family: times new roman,times;"></div>'+
								'			</div>'+
								'		</td>'+
								'	</tr>'+
								'</tbody>'+
								'</table>'+
								'<div><br/></div>');								
								commentObj.find(".comment").append(comment.comment);
								commentList.append(commentObj);
							});
							thisWidget.prepareComments();

						widget.find("#cont-comments").fadeIn("slow");
					});
			},
			prepareComments: function(){
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
			}
	}
	
})(jQuery);