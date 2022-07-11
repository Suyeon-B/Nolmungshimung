export function getCookie(Name) {
  var search = Name + "=";
  if (document.cookie.length > 0) {
    // if there are any cookies
    var offset = document.cookie.indexOf(search);
    if (offset != -1) {
      // if cookie exists
      offset += search.length; // set index of beginning of value
      var end = document.cookie.indexOf(";", offset); // set index of end of cookie value
      if (end == -1) end = document.cookie.length;
      return unescape(document.cookie.substring(offset, end));
    }
  }
}
