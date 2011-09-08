$(document).ready(function(){
    
    var req = opensocial.newDataRequest();
    var params = {};
    req.add(req.newFetchNotificationsRequest('OWNER',params), 'notifications');
    req.send(function(data){
        var notificationContainer = $("#notifications");
        var notifications = data.get('notifications').getData();
        notifications.each(function(notificationCollection){
            var notificationCollectionContainer = $("<br>"+
            '<div class="ui-widget ui-widget-content ui-corner-all">'+
            '    <h3>'+ notificationCollection.getTitle() +'</h3>'+
            '    <div class="sub">'+
            '    </div>'+
            '</div>');
        
            var sub = notificationCollectionContainer.find(".sub");
            
            notificationCollection.notifications.each(function(notification){
                    notif = $('<div><a style="text-decoration:none" href="javascript:void(0)">'+ notification.getField('body')+'</a></div>');
                    notif.find("a").click(function(){
                        gadgets.wixet.goTo("http://www.google.es");
                        //gadgets.wixet.goTo(notification.getField('endUrl'));
                    });
                    sub.append(notif);
                            
            });
            notificationContainer.append(notificationCollectionContainer);
        });
        
    });
});