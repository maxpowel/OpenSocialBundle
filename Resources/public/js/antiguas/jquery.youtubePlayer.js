//Youtube player
function onYouTubePlayerReady(playerId) {	
	$.youtubePlayer.actualPlayer = document.getElementById("myytplayer");
	$.youtubePlayer.actualPlayer.playVideo();

  }
(function($) {
	$.youtubePlayer = {
	actualPlayer: null,
	
		play: function(id){
			if(id != ""){
				//new file
				if(this.actualPlayer != null)
					$(this.actualPlayer).remove();
				
				newPlayer = $('<div align="right" class="youtubePlayer portlet ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" style="z-index:5000; margin:0px;padding:2px 8px 8px 8px;height: 235; width: 268;position:fixed;bottom:0;right:0px;">'+
					' <a id="closePlayer" href="javascript:void(0)"><span class="ui-icon ui-icon-close"></span></a>'+
   					'<div id="ytapiplayer">'+
   					' You need Flash player 8+ and JavaScript enabled to view this video.'+
   					'</div>'+
					'</div>');
				$("body").append(newPlayer);
				newPlayer.find("#closePlayer").click(function(){
					$(".youtubePlayer").remove();
				});
			    swfobject.embedSWF("http://www.youtube.com/v/"+id+"?enablejsapi=1&playerapiid=ytplayer?version=3&color1=0xDDDDDD&color2=0xE78F08&fs=1&hd=1&feature=player_embedded", 
	                       "ytapiplayer", "268", "235", "8", null, null, { allowScriptAccess: "always","allowfullscreen":true }, { id: "myytplayer" });
			    
			    newPlayer.resizable({
					handles: 'n, w, nw',
					minHeight: 235,
					minWidth: 268,
					start: function(event, ui){
			    		$(this).children().css("visibility","hidden");
						
			    	},stop:function(event, ui){
			    			$(this).children().css("visibility",null);
			    			$.youtubePlayer.actualPlayer.setSize(ui.size.width, ui.size.height-15);
							$("#myytplayer").width(ui.size.width).height(ui.size.height-15);
			    	}
				});
			    
			}else//Continue paused reproduction
				this.actualPlayer.play();

		},
		resize: function(){
			$(this.actualPlayer).remove();
		},
		pause: function(){
			this.actualPlayer.pauseVideo();
		},
		parseText: function(text){
			//Used when showing comments, convert [youtube]asfsd[/youtube] to a "player"
	        var cosa = text;
	        var modificado = text;
	        var re = /\[([^\]]*)\]([^\[]*)\[\/([^\]]*)?/g;
	        var match;

	        match = re.exec(cosa);
	        while (match != null)
	        {
	                if(match != null)
	                {
	                        if(match[1] == "youtube")
	                        {
	                                        modificado = modificado.replace("[youtube]"+match[2]+"[/youtube]", '<a href="javascript:void(0)" title="'+match[2]+'"><img class="ui-state-default ui-corner-all" src="http://i.ytimg.com/vi/'+match[2]+'/2.jpg"/></a>');
	                        }
	                }
	                match = re.exec(cosa);
	                
	        }

	        modificado = $("<div>"+modificado+"<div>");
	        $.each(modificado.find("a"),function(i,element){
	        	$(element).click(function(){
	        		$.youtubePlayer.play($(element).attr("title"));
	        	});
	        });
	        return modificado;

		}
	
	}
	

})(jQuery);
