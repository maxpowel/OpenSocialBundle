
/* Author: Alvaro Garcia
 * Description: Search value params in url query (justo text after #)
 * Example: index.php#param1/val1
 * $.url.getPara("param1") return val1 (if val1 is integer)
 */

function Url(){
	this.getParam = function(parametro)
	{
		var url = location.href.toString();
		var troceada = url.split("#");
		var query;
		var params;
		if(troceada.length > 1)
		{
			query = troceada[1];
			var patron = eval('/'+parametro+'\\/([0-9a-z]*)/');
			params = query.match(patron)
			if(params == null)
				return null;
			else
				return params[1];
		}
		else return null;
	}
	
	this.get = function(parametro){
		this.getParam(parametro);
	}
	
	this.getSection = function()
	{
		var url = location.href.toString();
		var troceada = url.split("#");
		troceada = troceada[1].split("/");
		return troceada[0];
	}
}


	$.url = new Url();

