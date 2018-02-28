var idleTime = 0;

/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date();
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
   return dateFormat(this, mask, utc);
};

String.isNullOrEmpty = function(value) {
    if(value === null) return true;
    return !(typeof value === "string" && value.trim().length > 0);
};

String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g,""); };


String.prototype.format = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

if(!Array.indexOf) {
    Array.prototype.indexOf = function(obj){
        for(var i=0; i<this.length; i++) {
            if(this[i]==obj){
                return i;
            }
        }
        return -1;
    };
}

function deepCloneStore (source) {
    var target = Ext.create ('Ext.data.Store', {
        model: source.model
    });

    Ext.each (source.getRange (), function (record) {
        var newRecordData = Ext.clone (record.copy().data);
        var model = new source.model (newRecordData, newRecordData.id);

        target.add (model);
    });

    return target;
}


function timerIncrement() {
    idleTime = idleTime + 1;
    if (idleTime >= 30) { // 30 minutes
    	Ext.MessageBox.wait('Detected Inactivity...','Warning!!!');
    	setTimeout(function() { Ext.MessageBox.hide(); }, 5000);
        Ext.util.Cookies.clear("IAM.AppAuth");
        Ext.util.Cookies.clear("IAM.CurrentUser");
        window.location.reload();
    }
}

function createUUID() {
    // http://www.ietf.org/rfc/rfc4122.txt
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";

    var uuid = s.join("");
    return uuid;
}

if (!Date.prototype.getStandardTimezoneOffset) {
    // method to return the timezone offset when DST is off
    Date.prototype.getStandardTimezoneOffset = function () {
        // this logic will fail if DST is observed on both the dates picked below
        // but as far as I can tell there are no such timezones
        var jan = new Date(this.getFullYear(), 0, 1);
        var jul = new Date(this.getFullYear(), 6, 1);
        return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
    }
}

if (!Date.prototype.isDst) {
    // method to check if DST is in effect or not
    Date.prototype.isDst = function () {
        return this.getTimezoneOffset() < this.getStandardTimezoneOffset();
    }
}

function getEastern(sourceDatetime) {
    // offset is in minutes, so to convert to milliseconds, we use the following conversion factor
    var OFFSET_IN_MILLIS = 1000 * 60;

    // now lets define the eastern timezone offset
    var easternOffset = -5 * 60 * OFFSET_IN_MILLIS;
    if (sourceDatetime.isDst()) {
        easternOffset = -4 * 60 * OFFSET_IN_MILLIS;
    }

    // get current timezone offset
    var userOffset = sourceDatetime.getTimezoneOffset() * OFFSET_IN_MILLIS;

    // eastern time = current time + user offset + eastern offset
    return new Date(sourceDatetime.getTime() + userOffset + easternOffset);
}

function json_encode(mixed_val) {
  //       discuss at: http://phpjs.org/functions/json_encode/
  //      original by: Public Domain (http://www.json.org/json2.js)
  // reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  //      improved by: Michael White
  //         input by: felix
  //      bugfixed by: Brett Zamir (http://brett-zamir.me)
  //        example 1: json_encode('Kevin');
  //        returns 1: '"Kevin"'

  /*
    http://www.JSON.org/json2.js
    2008-11-19
    Public Domain.
    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
    See http://www.JSON.org/js.html
  */
  var retVal, json = this.window.JSON;
  try {
    if (typeof json === 'object' && typeof json.stringify === 'function') {
      retVal = json.stringify(mixed_val); // Errors will not be caught here if our own equivalent to resource
      //  (an instance of PHPJS_Resource) is used
      if (retVal === undefined) {
        throw new SyntaxError('json_encode');
      }
      return retVal;
    }

    var value = mixed_val;

    var quote = function(string) {
      var escapable =
        /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
      var meta = { // table of character substitutions
        '\b': '\\b',
        '\t': '\\t',
        '\n': '\\n',
        '\f': '\\f',
        '\r': '\\r',
        '"': '\\"',
        '\\': '\\\\'
      };

      escapable.lastIndex = 0;
      return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
        var c = meta[a];
        return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0)
          .toString(16))
          .slice(-4);
      }) + '"' : '"' + string + '"';
    };

    var str = function(key, holder) {
      var gap = '';
      var indent = '    ';
      var i = 0; // The loop counter.
      var k = ''; // The member key.
      var v = ''; // The member value.
      var length = 0;
      var mind = gap;
      var partial = [];
      var value = holder[key];

      // If the value has a toJSON method, call it to obtain a replacement value.
      if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
        value = value.toJSON(key);
      }

      // What happens next depends on the value's type.
      switch (typeof value) {
        case 'string':
          return quote(value);

        case 'number':
          // JSON numbers must be finite. Encode non-finite numbers as null.
          return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':
          // If the value is a boolean or null, convert it to a string. Note:
          // typeof null does not produce 'null'. The case is included here in
          // the remote chance that this gets fixed someday.
          return String(value);

        case 'object':
          // If the type is 'object', we might be dealing with an object or an array or
          // null.
          // Due to a specification blunder in ECMAScript, typeof null is 'object',
          // so watch out for that case.
          if (!value) {
            return 'null';
          }
          if ((this.PHPJS_Resource && value instanceof this.PHPJS_Resource) || (window.PHPJS_Resource &&
            value instanceof window.PHPJS_Resource)) {
            throw new SyntaxError('json_encode');
          }

          // Make an array to hold the partial results of stringifying this object value.
          gap += indent;
          partial = [];

          // Is the value an array?
          if (Object.prototype.toString.apply(value) === '[object Array]') {
            // The value is an array. Stringify every element. Use null as a placeholder
            // for non-JSON values.
            length = value.length;
            for (i = 0; i < length; i += 1) {
              partial[i] = str(i, value) || 'null';
            }

            // Join all of the elements together, separated with commas, and wrap them in
            // brackets.
            v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind +
              ']' : '[' + partial.join(',') + ']';
            gap = mind;
            return v;
          }

          // Iterate through all of the keys in the object.
          for (k in value) {
            if (Object.hasOwnProperty.call(value, k)) {
              v = str(k, value);
              if (v) {
                partial.push(quote(k) + (gap ? ': ' : ':') + v);
              }
            }
          }

          // Join all of the member texts together, separated with commas,
          // and wrap them in braces.
          v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
            '{' + partial.join(',') + '}';
          gap = mind;
          return v;
        case 'undefined':
          // Fall-through
        case 'function':
          // Fall-through
        default:
          throw new SyntaxError('json_encode');
      }
    };

    // Make a fake root object containing our value under the key of ''.
    // Return the result of stringifying the value.
    return str('', {
      '': value
    });

  } catch (err) { // Todo: ensure error handling above throws a SyntaxError in all cases where it could
    // (i.e., when the JSON global is not available and there is an error)
    if (!(err instanceof SyntaxError)) {
      throw new Error('Unexpected error type in json_encode()');
    }
    this.php_js = this.php_js || {};
    this.php_js.last_error_json = 4; // usable by json_last_error()
    return null;
  }
}

/**
* function to load a given css file 
*/ 
loadCSS = function(href) {
    today = new Date();
    href += '?_DC='+ today.getTime();
    var cssLink = $("<link rel='stylesheet' type='text/css' href='"+href+"'>");
    $("head").append(cssLink); 
};

function getAbsolutePath() {
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/app/'));
    // console.log(pathName);
    // pathName = pathName.substring(0, pathName.lastIndexOf('/') + 1);
    // console.log(pathName);
    return pathName;
}

function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

Date.prototype.isValid = function () {
    // An invalid date object returns NaN for getTime() and NaN is the only
    // object not strictly equal to itself.
    return this.getTime() === this.getTime();
}; 

//--------------------------------------------------------------------------
//This function validates the date for MM/DD/YYYY format. 
//--------------------------------------------------------------------------
function isValidDate(dateStr) {
 
  // Checks for the following valid date formats:
  // MM/DD/YYYY
  // Also separates date into month, day, and year variables
  var datePat = /^(\d{2,2})(\/)(\d{2,2})\2(\d{4}|\d{4})$/;
  
  var matchArray = dateStr.match(datePat); // is the format ok?
  if (matchArray == null) {
    if(!Ext) {
      //alert("Date must be in MM/DD/YYYY format");
    } else {
      Ext.Msg.alert('Cuidado','Formato de fecha invalida');
    }
    return false;
  }
   
  month = matchArray[3]; // parse date into variables
  day = matchArray[1];
  year = matchArray[4];
  if (month < 1 || month > 12) { // check month range
    if(!Ext) {
      //alert("Month must be between 1 and 12");
    } else {
      Ext.Msg.alert('Cuidado','Meses deben ser de 1 a 12');  
    }
    return false;
  }
  if (day < 1 || day > 31) {
    if(!Ext) {
      //alert("Day must be between 1 and 31");
    } else {
      Ext.Msg.alert('Cuidado','Dias deben ser de 1 a 31');    
    }
    return false;
  }
  if ((month==4 || month==6 || month==9 || month==11) && day==31) {
    if(!Ext) {
      //alert("Month "+month+" doesn't have 31 days!")
    } else {
      Ext.Msg.alert('Cuidado','El mes '+month+' no tiene 31 dias');  
    }
    return false;
  }
  if (month == 2) { // check for february 29th
    var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
    if (day>29 || (day==29 && !isleap)) {
      if(!Ext) {
        //alert("February " + year + " doesn't have " + day + " days!");
      } else {
        Ext.Msg.alert('Cuidado','Febrero ' + year + ' no tiene ' + day + ' dias');  
      }
      return false;
    }
  }
   return true;  // date is valid
}

function getEsperandoFacturas() {
  returnVal = '<span class="estatus-alerta">En Espera de Facturas</span>';
  return returnVal;
}

function getFormattedDateSalida(date) {
  // var offset = new Date().getTimezoneOffset(); // obtenemos la zona horaria y se la agregamos para mostrar la fecha exacta
  // offset = offset/60;
  // parsed = Date.parse(date);
  // if(date && !isNaN(date)) {
  //   parsed = Date.parse(date.toUTCString());
  // }
  // var valor = parsed ? new Date(parsed + offset * 3600 * 1000) : null; 
  var valor = getLocalDate(date);
  returnVal = valor ? valor.format('h:MM TT').trim() : "";
  return returnVal;
}

function getFormattedDate (date) {
  // var offset = new Date().getTimezoneOffset(); // obtenemos la zona horaria y se la agregamos para mostrar la fecha exacta
  // offset = offset/60;
  // parsed = Date.parse(date);
  // if(date) {
  //     parsed = Date.parse(date.toUTCString());
  // }
  //var valor = parsed ? new Date(parsed + offset * 3600 * 1000) : null; 

  var valor = getLocalDate(date);
  returnVal = valor ? valor.format('dd/mm/yy').trim() : "";
  return returnVal;
}

function getLocalDate (date) {
  // Obtenemos el nombre del navegador
  var nav = navigator.userAgent.toLowerCase();

  // Detectamos si nos visitan desde IE
  if(nav.indexOf("chrome") == -1) {
    //console.log('está usando Internet Explorer ...');
    return date;
  }

  var offset = new Date().getTimezoneOffset(); // obtenemos la zona horaria y se la agregamos para mostrar la fecha exacta
  offset = offset/60;
  parsed = Date.parse(date);
  if(date) {
      parsed = Date.parse(date.toUTCString());
  }
  var valor = parsed ? new Date(parsed + offset * 3600 * 1000) : null; 
  //returnVal = valor ? valor.format('dd/mm/yy').trim() : "";
  return valor;
}

function getEstatusDistribucionColor(estatus) {
  var color = null,
    element = $('<strong></strong>');

  color = (estatus === "COMPLETADO" || estatus === "DISPONIBLE") ? '#1db304' : color;
  color = (estatus === "PROGRAMADO") ? '#AA5585' : color;
  color = (estatus === "REPROGRAMADO") ? '#8A458A' : color;
  color = (estatus === "RETORNANDO") ? '#de7404' : color;
  color = (estatus === "TRANSITO") ? '#DADA00' : color;
  color = (estatus === "CLIENTE") ? '#03c3fa' : color;

  if(!String.isNullOrEmpty(color)) element.css({ 'color': color });
  element.css({ 'padding-top': '4px' });
  element.css({ 'padding-bottom': '4px' });
  element.css({ 'margin-top': '0px' });
  element.css({ 'margin-bottom': '0px' });
  element.css({ 'margin-left': '0px' });
  element.css({ 'margin-right': '0px' });
  element.css({ 'text-align': 'center' });
  element.text(estatus);
  return element[0].outerHTML;
}

function getURLParams() {
  // capturamos la url
  var loc = document.location.href;
  // si existe el interrogante
  if(loc.indexOf('?')>0)
  {
      // cogemos la parte de la url que hay despues del interrogante
      var getString = loc.split('?')[1];
      // obtenemos un array con cada clave=valor
      var GET = getString.split('&');
      var get = {};

      // recorremos todo el array de valores
      for(var i = 0, l = GET.length; i < l; i++){
          var tmp = GET[i].split('=');
          get[tmp[0]] = unescape(decodeURI(tmp[1]));
      }
      return get;
  }
}

function getHorario() {
  var fecha = new Date();

  if(fecha.getHours() >= 14 && fecha.getHours() < 22) {
      return 1;
  } else {
      return 2;
  }
}

// Check if object have a property
function hasOwnProperty(obj, prop) {
    var proto = obj.__proto__ || obj.constructor.prototype;
    return (prop in obj) &&
        (!(prop in proto) || proto[prop] !== obj[prop]);
}

function datediff(days, fecha){
    milisegundos=parseInt(35*24*60*60*1000);
 
    day=fecha.getDate();
    // el mes es devuelto entre 0 y 11
    month=fecha.getMonth()+1;
    year=fecha.getFullYear();
 
    //document.write("Fecha actual: "+day+"/"+month+"/"+year);
 
    //Obtenemos los milisegundos desde media noche del 1/1/1970
    tiempo=fecha.getTime();
    //Calculamos los milisegundos sobre la fecha que hay que sumar o restar...
    milisegundos=parseInt(days*24*60*60*1000);
    //Modificamos la fecha actual
    total=fecha.setTime(tiempo+milisegundos);
    day=fecha.getDate();
    month=fecha.getMonth()+1;
    year=fecha.getFullYear();
 
    //document.write("Fecha modificada: "+day+"/"+month+"/"+year);

    return fecha;
}

function ScriptLoader(o) {
  var count = 0;
  var scriptTag, linkTag;
  var scriptFiles = o.js;
  var cssFiles = o.css;
  var head = document.getElementsByTagName('head')[0];

  for (var k in cssFiles) {
          linkTag = document.createElement('link');                       
          linkTag.type = 'text/css';
          linkTag.rel = 'stylesheet';
          linkTag.href = cssFiles[k];
          head.appendChild(linkTag);
  }

  for (var k in scriptFiles) {
    scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    if (typeof o.callback === "function") {
      if (scriptTag.readyState) {  //IE
        scriptTag.onreadystatechange = function() {
          if (scriptTag.readyState == "loaded" || scriptTag.readyState == "complete") {
            count++;
            if (count == scriptFiles.length) o.callback.call();
          }
        };
      } else { // other browsers
        scriptTag.onload = function() {
          count++;
          if (count == scriptFiles.length) o.callback.call();                 
        }
      }
    }
  }

  scriptTag.src = scriptFiles[k];
  head.appendChild(scriptTag);
}

// var ScriptLoader = {
//   load: function(fileList, callback, scope, preserveOrder) {
//         var scope       = scope || this,
//             head        = document.getElementsByTagName("head")[0],
//             fragment    = document.createDocumentFragment(),
//             numFiles    = fileList.length,
//             loadedFiles = 0,
//             me          = this;
        
//         // Loads a particular file from the fileList by index. This is used when preserving order
//         var loadFileIndex = function(index) {
//             head.appendChild(
//                 me.buildScriptTag(fileList[index], onFileLoaded)
//             );
//         };
        
//         /**
//         * Callback function which is called after each file has been loaded. This calls the callback
//         * passed to load once the final file in the fileList has been loaded
//         */
//         var onFileLoaded = function() {
//             loadedFiles ++;
            
//             //if this was the last file, call the callback, otherwise load the next file
//             if (numFiles == loadedFiles && typeof callback == 'function') {
//                 callback.call(scope);
//             } else {
//                 if (preserveOrder === true) {
//                     loadFileIndex(loadedFiles);
//                 }
//             }
//         };
        
//         if (preserveOrder === true) {
//             loadFileIndex.call(this, 0);
//         } else {
//             //load each file (most browsers will do this in parallel)
//             Ext.each(fileList, function(file, index) {
//                 fragment.appendChild(
//                     this.buildScriptTag(file, onFileLoaded)
//                 );
//             }, this);
            
//             head.appendChild(fragment);
//         }
//     },
    
//     buildScriptTag: function(filename, callback) {
//         var exten = filename.substr(filename.lastIndexOf('.')+1);
//         //console.log('Loader.buildScriptTag: filename=[%s], exten=[%s]', filename, exten);
//         if(exten=='js') {
//             var script  = document.createElement('script');
//             script.type = "text/javascript";
//             script.src  = filename;
            
//             //IE has a different way of handling <script> loads, so we need to check for it here
//             if(script.readyState) {
//                 script.onreadystatechange = function() {
//                     if (script.readyState == "loaded" || script.readyState == "complete") {
//                         script.onreadystatechange = null;
//                         callback();
//                     }
//                 };
//             } else {
//                 script.onload = callback;
//             }
//             return script;
//         }
//         if(exten=='css') {
//             var style = document.createElement('link');
//             style.rel  = 'stylesheet';
//             style.type = 'text/css';
//             style.href = filename;
//             callback();
//             return style;
//         }
//     }
// };