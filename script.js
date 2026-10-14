(function () {
  var form = document.getElementById('forma');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = form.elements;
      var body = 'Vārds: ' + v.vards.value + '\n' +
                 'Kontakti: ' + v.kontakts.value + '\n\n' +
                 v.zina.value;
      window.location.href = 'mailto:partneris.sia@gmail.com' +
        '?subject=' + encodeURIComponent('Jautājums no mājaslapas') +
        '&body=' + encodeURIComponent(body);
    });
  }
  var menu = document.querySelector('.menu');
  if (menu) {
    menu.addEventListener('click', function (e) {
      if (e.target.closest('.menu__list a')) menu.removeAttribute('open');
    });
  }
})();
