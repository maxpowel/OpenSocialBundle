(function($) {
	$.audioPlayer = {
	actualPlayer: null,
	
		play: function(file){
			if(file != ""){
				//new file
				if(this.actualPlayer != null){
					this.actualPlayer.pause();
					$(this.actualPlayer).remove();
				}
				
				newPlayer = $("<audio>").attr({src:file,id:"audioPlayer"});
				$("body").append(newPlayer);
				this.actualPlayer = document.getElementById("audioPlayer");
				this.actualPlayer.play();
			}else//Continue paused reproduction
				this.actualPlayer.play();
			

		},
		stop: function(){
			this.actualPlayer.pause();
			$(this.actualPlayer).remove();
		},
		pause: function(){
			this.actualPlayer.pause();
		}
	
	}
	

})(jQuery);
