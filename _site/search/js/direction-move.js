window.onload = function () {
  function getEvent(ev) {
    return ev ? ev : window.event;
  }

  var backToTop = document.querySelector('.back-to-top');
  backToTop.addEventListener('touchEnd', touchEnd, false);
  function touchEnd(ev) {
    var event = getEvent(ev);
    console.log(event.type);
  }

  console.log(backToTop)
}