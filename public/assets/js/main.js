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

});