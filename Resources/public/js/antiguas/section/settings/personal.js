$(document).ready(function(){
    var me = null;
    var req = opensocial.newDataRequest();
    req.add(req.newFetchPersonRequest('OWNER'),"me");
    req.send(function(data){
        me = data.get('me').getData();
        var name = me.getField("name");
        $("#firstname").val(name['givenName']);
        $("#lastname").val(name['familyName']);
        
    });
        
    $("#save").button().click(function(){
        me.setField("name",{familiyName: $("#lastname").val(),givenName:$("#firstname").val});
        $.wixet.userNotice("Datos guardados con éxito");
    });
});