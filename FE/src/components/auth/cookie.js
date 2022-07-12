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

//쿠키 삭제
//쿠키는 삭제가 없어서 현재 시각으로 만료 처리를 함.
export function deleteCookie(key) {
  let todayDate = new Date();
  document.cookie = key + "=; path=/; expires=" + todayDate.toGMTString() + ";"; // 현재 시각 이전이면 쿠키가 만료되어 사라짐.
}
