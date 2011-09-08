(function($) {
	
	$.widget.blog = {
			widget: null,
			init: function(widget) {
		
				this.widget = $(widget);
				blog = this;
				
				this.widget.find(".ui-icon-document").click(function(){
					blog.newBlogDialog();
				});
				this.widget.find(".ui-icon-trash").click(function(){
					
					jConfirm($._("Are you sure you want to remove the blog \"%\"?",new Array($.widget.blog.widget.find(".blogTitle").text())),$._("Remove blog"),function(yes){
						if(yes)
							blog.removeBlog($.widget.blog.widget.find(".blogTitle").attr("blogId"));
					});
				});
				$.widget.blog.paginate(1);
			},
			load: function(vars){
				//var widget = this.widget;
				//widget.find("#cont-blogPaginator").pager({ pagenumber: 1, pagecount: 0, buttonClickCallback: $.widget.blog.paginate });
				/*$.getJSON("/core/profile/getBlog/userId/"+vars.id+"/blogId/"+vars.blogId,function(data){
					widget.find(".blogTitle").text(data.blog.title);
					widget.find(".portlet-content").text(data.blog.content);
				});*/
				//$.widget.blog.paginate(1);
			},
			newBlogDialog: function(){
				var buttonsOpts = {};
				var dialog = null;
				buttonsOpts[$._('Cancel')] = function (){
					$(this).dialog('close');
				};
				
				buttonsOpts[$._('Create')] = function() {
					var thisDialog = $(this);
					dialog.find(".editor").editor({send: "/core/profile/newBlog/title/"+dialog.find("input").val(), callback: function(data){
						data = eval("("+data+")");
						if(data.error)
							jAlert($._("Error while creating blog entry")+": "+data.message,"Error");
						else{
							thisDialog.dialog('close');
							$.widget.blog.paginate(1);
						}
					}});
				};
				var blogWidget = this;
				dialog = $('<div title="'+$._("New blog entry")+'">'+
						'<br />'+$._("Blog entry title")+' <input class="text ui-widget-content ui-corner-all" type="text"><br /><br />'+
						'<div class="editor"></div>'+
						'</div>').dialog({
							resizable: true,
							height:400,
							width: 500,
							modal: true,
							open: function(){
								$(this).find(".editor").editor({height:230, width:450});
								$(this).find(".input").focus();
							},
							buttons: buttonsOpts
						});
			},
			paginate: function(page){
				var widget = $.widget.blog.widget;
				$.widget.blog.widget.find("#cont-content").fadeOut("fast");
				 $.getJSON("/core/profile/getBlog/id/"+$.url.getParam("id")+"/page/"+page,
					function(data)
					{
					 	widget.find("#cont-blogPaginator").pager({ pagenumber: page, pagecount: data.pagecount, buttonClickCallback: $.widget.blog.paginate });

					 	widget.find('.paginador-boton, ul#icons li').hover(
							function() { $(this).addClass('ui-state-hover'); }, 
							function() { $(this).removeClass('ui-state-hover'); }
						);
					 	
					 	if(data.blog.blog_id != null){
						 	widget.find(".blogTitle").html(data.blog.title).attr("blogId",data.blog.blog_id);
						 	widget.find("#cont-content").html(data.blog.content);
					 	}else{
					 		widget.find(".blogTitle").html($._("Blog entry title")).attr("blogId",0);
						 	widget.find("#cont-content").html("");
					 	}
					 	widget.find("#cont-content").fadeIn("slow");

					});
			},
			removeBlog: function(blogId){
				$.getJSON("/core/profile/removeBlog/id/"+blogId,
						function(data)
						{
							if(data.error) jAlert(data.message,"Error");
							else $.widget.blog.paginate(1);
						});
			}
	}
	
})(jQuery);