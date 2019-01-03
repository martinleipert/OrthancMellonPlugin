
$(document).live('pagebeforecreate', function() {
  if ($('#logout-button').length) {
      return;
  }
    var b1 = $('<a>')
      .attr('id', 'logout-button')
      .attr('data-role', 'button')
      .attr('href', '/mellon/logout?ReturnTo=http://orthanc.cic.userena.cl/Orthanc')
      .attr('data-theme', 'e')
      .text('Logout');

    $('div.ui-btn-right').append(b1);
});



$('#patient').live('pagebeforecreate', function() {
  //$('#series-preview').parent().remove();

  // var responseText = httpGet('localhost:8000/userAdministration/');


      // var resp = JSON.parse(responseText);
      // var users = resp.users;

      var u1 = $('<ul>')
        .attr('class', 'ui-listview ui-listview-inset ui-corner-all ui-shadow');


      var l1 = $('<li>')
        .attr('role', 'heading')
        .attr('data-role', 'list-divider')
        .attr('class', 'ui-li ui-li-divider ui-bar-c ui-corner-top')
        .text('Access Management');
      u1.append(l1);


      var l2 = $('<li>')
        .attr('class', 'ui-btn ui-btn-up-d ui-btn-icon-right ui-li-has-arrow ui-li');
      var s1 = $('<select>')
        .attr('id', 'user-select');

      l2.append(s1);
      u1.append(l2);


      var l4 = $('<li>')
        .attr('class', 'ui-btn-text');
      var b1 = $('<a>')
        .attr('data-role', 'button')
        .attr('href', '#')
        .attr('noci-atad', 'plus')
        .attr('data-theme', 'e')
        .text('Grant Access');

      l4.append(b1)
        .attr('class', 'ui-btn ui-btn-up-d ui-btn-icon-right ui-li-has-arrow ui-li');
      u1.append(l4);
      b1.click(grant_access_click);



      var l5 = $('<li>')
        .attr('class', 'ui-btn-text');
      var b2 = $('<a>')
        .attr('data-role', 'button')
        .attr('href', '#')
        .attr('noci-atad', 'minus')
        .attr('data-theme', 'e')
        .text('Retreat Access');

      l5.append(b2);

      u1.append(l5);

      b2.click(retreat_access_click);

      u1.insertBefore($('#patient-delete').parent().parent());


      var data;

      // Call the function to fill the select
      var responseText = jQuery.getJSON(
        'http://localhost:8000/userAdministration/',
        data,
        fill_select
        );


});

function getPatientId() {

      var url_string = window.location.href;
      var url = new URL(url_string);
      var uuid = url.searchParams.get("uuid");

      return uuid;
}




function fill_select(data) {
  var s1 = $("#user-select");

  for (var user_mail in data["user-ids"]) {
    s1.append($('<option>', {value:user_mail, text: user_mail}));
  }

}

function grant_access_click() {
  var json_dict = {};

  select = document.getElementById("user-select");


  json_dict["orthanc-id"] = getPatientId();
  json_dict["MOD_MELLON_uid"] = select.value;

  // construct an HTTP request
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8000/accessAdministration", false);
  xhr.setRequestHeader('Content-Type', 'application/json');

  // send the collected data as JSON
  var json_str = JSON.stringify(json_dict);
  xhr.send(json_str);
}

function retreat_access_click() {
  var json_dict = {};

  select = document.getElementById("user-select");

  json_dict["orthanc-id"] = getPatientId();
  json_dict["MOD_MELLON_uid"] = select.value;

  // construct an HTTP request
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", "http://localhost:8000/accessAdministration", false);
  xhr.setRequestHeader('Content-Type', 'application/json');

  // send the collected data as JSON
  var json_str = JSON.stringify(json_dict);
  xhr.send(json_str);
}
