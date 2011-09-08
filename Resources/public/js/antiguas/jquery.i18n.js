/* Copyright Bryan W Berry, 2009, 
 * under the MIT license http://www.opensource.org/licenses/mit-license.php
 * 
 * this library is heavily influenced by the GNU LIBC library
 *  http://www.gnu.org/software/libc/manual/html_node/Locales.html
 */

(function($){

     $.i18n = function(string, args, locale){
		 var lang = locale || $.i18n.lang;
		 if (!this.i18n.strings){
		     return string;
		 }

		 var finalString = this.i18n.strings[string]||string;
		 if(args != null){
			 for(var i=0; i<args.length; i++){
				finalString = finalString.replace("%", args[i]); 	
			 }
		 }
		 
		 return finalString;
     };

     $._ = $.i18n;

     $.i18n.setLocale = function (locale){
	 $.i18n.lang = locale;
	 jQuery.i18n.strings = {}
	 
     };

     $.i18n.getLocale = function (){
	 return $.i18n.lang;
     };
     /**Get some config **/
     $.i18n.get = function(option){
   	  return $.i18n[$.i18n.lang][option];
     };
	  
	/**
      * Converts a date
      * @param {date} Date to be converted
      * @returns {String} Unicode string for localized numeral 
      */
      $.i18n._date = function(date){

	 	locale = $.i18n.lang;

	 	if (!this.i18n[locale] || !this.i18n[locale].date ){
	    	 return date;
		}
		return $.format.date(date, this.i18n[locale].date);
	    	 
	 }
  	/**
       * Converts a datetime
       * @param {date} Date to be converted
       * @returns {String} Unicode string for localized numeral 
       */
       $.i18n._datetime = function(date){

 	 	locale = $.i18n.lang;

 	 	if (!this.i18n[locale] || !this.i18n[locale].datetime ){
 	    	 return date;
 		}
 		return $.format.date(date, this.i18n[locale].datetime);
 	    	 
 	 }
      
     /**
      * Converts a number to numerals in the specified locale. Currently only
      * supports devanagari numerals for Indic languages like Nepali and Hindi
      * @param {Number} Number to be converted
      * @param {locale} locale that number should be converted to
      * @returns {String} Unicode string for localized numeral 
      */
     $.i18n._n = function(num, locale){

	 locale = locale || $.i18n.lang;

	 if (!this.i18n[locale] || !this.i18n[locale].numBase ){
	     return num;
	 }


	 //48 is the base for western numerals
	 var numBase = $.i18n[$.i18n.lang].numeralBase || 48;
	 var prefix =  $.i18n[$.i18n.lang].numeralPrefix || "u00";
     
	 var convertDigit = function(digit){	     
	     return '\\' + prefix + 
		 (numBase + parseInt(digit)).toString(16);
	 };
	 
	 var charArray = num.toString().split("").map(convertDigit);
	 return eval('"' + charArray.join('') + '"');
     };

	 $._date = $.i18n._date;
	 $._datetime = $.i18n._datetime;
     $._n = $.i18n._n;

     /* ToDo
      * implement sprintf
      * conversion functions for monetary and numeric 
      * sorting functions (collation) for different locales
      */

 })(jQuery);



//Plugin http://github.com/phstc/jquery-dateFormat
(function ($) {
    $.format = (function () {

        var parseMonth = function (value) {
                       
            switch (value) {
            case "Jan":
                return "01";
            case "Feb":
                return "02";
            case "Mar":
                return "03";
            case "Apr":
                return "04";
            case "May":
                return "05";
            case "Jun":
                return "06";
            case "Jul":
                return "07";
            case "Aug":
                return "08";
            case "Sep":
                return "09";
            case "Oct":
                return "10";
            case "Nov":
                return "11";
            case "Dec":
                return "12";
            default:
                return value;
            }
        };
        
        var parseTime = function (value) {
            var retValue = value;
            if (retValue.indexOf(".") !== -1) {
                retValue = retValue.substring(0, retValue.indexOf("."));
            }
            
            var values3 = retValue.split(":");
            
            if (values3.length === 3) {
                hour = values3[0];
                minute = values3[1];
                second = values3[2];
                
                return {
                        time: retValue,
                        hour: hour,
                        minute: minute,
                        second: second
                    };
            } else {
                return {
                    time: "",
                    hour: "",
                    minute: "",
                    second: ""
                };
            }
        };
        
        return {
            date: function (value, format) {
                //value = new java.util.Date()
                //2009-12-18 10:54:50.546
                try {
                    var year = null;
                    var month = null;
                    var dayOfMonth = null;
                    var time = null; //json, time, hour, minute, second
                    if (typeof value.getFullYear === "function") {
                        year = value.getFullYear();
                        month = value.getMonth() + 1;
                        dayOfMonth = value.getDate();
                        time = parseTime(value.toTimeString());
                    } else {
                        var values = value.split(" ");
                        
                        switch (values.length) {
                        case 6://Wed Jan 13 10:43:41 CET 2010
                            year = values[5];
                            month = parseMonth(values[1]);
                            dayOfMonth = values[2];
                            time = parseTime(values[3]);
                            break;
                        case 2://2009-12-18 10:54:50.546
                            var values2 = values[0].split("-");
                            year = values2[0];
                            month = values2[1];
                            dayOfMonth = values2[2];
                            time = parseTime(values[1]);
                            break;
                        default:
                            return value;
                        }
                    }
                    
                    var pattern = "";
                    var retValue = "";
                    
                    for (i = 0; i < format.length; i++) {
                        var currentPattern = format.charAt(i);
                        pattern += currentPattern;
                        switch (pattern) {
                        case "dd":
                            retValue += dayOfMonth;
                            pattern = "";
                            break;
                        case "FF":
                            retValue += $.i18n[$.i18n.lang].month[month-1];
                            pattern = ""
                            break;
                        case "MM":
                            retValue += month;
                            pattern = "";
                            break;
                        case "yyyy":
                            retValue += year;
                            pattern = "";
                            break;
                        case "HH":
                            retValue += time.hour;
                            pattern = "";
                            break;
                        case "hh":
                            retValue += (time.hour === 0 ? 12 : time.hour < 13 ? time.hour : time.hour - 12);
                            pattern = "";
                            break;
                        case "mm":
                            retValue += time.minute;
                            pattern = "";
                            break;
                        case "ss":
                            retValue += time.second;
                            pattern = "";
                            break;
                        /*case "a":
                            retValue += time.hour > 12 ? "PM" : "AM";
                            pattern = "";
                            break;*/
                        case " ":
                            retValue += currentPattern;
                            pattern = "";
                            break;
                        case "/":
                            retValue += currentPattern;
                            pattern = "";
                            break;
                        case ":":
                            retValue += currentPattern;
                            pattern = "";
                            break;
                        default:
                            if (pattern.length === 2 && pattern.indexOf("y") !== 0) {
                                retValue += pattern.substring(0, 1);
                                pattern = pattern.substring(1, 2);
                            } else if ((pattern.length === 3 && pattern.indexOf("yyy") === -1)) {
                                pattern = "";
                            }
                        }
                    }
                    return retValue;
                } catch (e) {
                    //console.log(e);
                    return value;
                }
            }
        };
    }());
}(jQuery));
