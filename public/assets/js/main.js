$(function(){
  $('#emailSubmit').click(function (e) {
    var content = {
      emailSubject : $('#emailSubject').val(),
      emailFrom : $('#emailFrom').val(),
      emailBody : $('#emailBody').val()
    }
    sendMail(content);
    e.preventDefault();
  });

  function sendMail(content) {
    $.ajax('/sendEmail', {type: 'POST', data:content}).success(function (data) {
      $('#emailSubject').val('');
      $('#emailFrom').val('');
      $('#emailBody').val('');
      alert('thanks');
    });
  }

  $(document).on('click', 'a.sicon-facebook', function (e) {
    e.preventDefault();
    window.open('https://www.facebook.com/pages/THISGROUND/306451286160039')
  });

  $(document).on('click', 'a.sicon-instagram', function (e) {
    e.preventDefault();
    window.open('https://www.instagram.com/THISGROUND')
  });

  $(document).on('click', 'a.sicon-pinterest', function (e) {
    e.preventDefault();
    window.open('http://www.pinterest.com/thisground/')
  });

  $(document).on('click', 'a.sicon-tumblr', function (e) {
    e.preventDefault();
    window.open('http://this-ground.tumblr.com/')
  });
});