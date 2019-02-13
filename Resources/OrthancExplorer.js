
// By Martin Leipert
// martin.leipert@fau.de


// The logout button on top of the page
$(document).live('pagebeforecreate', function() {
    // So that the logout is only created once
    // -> If we don't check this an additional logout button will be created with every click on the explorer
  if ($('#logout-button').length) {
      return;
  }
    var b1 = $('<a>')
      .attr('id', 'logout-button')
      .attr('data-role', 'button')
      // Most important -> Point to the mellon logout
      .attr('href', '/mellon/logout?ReturnTo=http://orthanc.cic.userena.cl/Orthanc')
      .attr('data-theme', 'e')
      .text('Logout');

    // Add to the right button section
    $('div.ui-btn-right').append(b1);
});


// Add to the patient section of the orthanc browser
// a set of buttons which allows to add or remove access to this patient to other users
$('#patient').live('pagebeforecreate', function() {
  //$('#series-preview').parent().remove();

  // var responseText = httpGet('localhost:8000/userAdministration/');


      // var resp = JSON.parse(responseText);
      // var users = resp.users;

      // Create a list
      var u1 = $('<ul>')
        .attr('class', 'ui-listview ui-listview-inset ui-corner-all ui-shadow');

      // First list element -> A title text
      var l1 = $('<li>')
        .attr('role', 'heading')
        .attr('data-role', 'list-divider')
        .attr('class', 'ui-li ui-li-divider ui-bar-c ui-corner-top')
        .text('Access Management');
      u1.append(l1);

      // Second dropdown a button which gets filled lazily
      var l2 = $('<li>')
        .attr('class', 'ui-btn ui-btn-up-d ui-btn-icon-right ui-li-has-arrow ui-li');
      var s1 = $('<select>')
        .attr('id', 'user-select');

      l2.append(s1);
      u1.append(l2);

      // List element 4
      var l4 = $('<li>')
        .attr('class', 'ui-btn-text');
      // Grant access Button
      var b1 = $('<a>')
        .attr('data-role', 'button')
        .attr('href', '#')
        .attr('noci-atad', 'plus')
        .attr('data-theme', 'e')
        .text('Grant Access');

      l4.append(b1)
        .attr('class', 'ui-btn ui-btn-up-d ui-btn-icon-right ui-li-has-arrow ui-li');
      u1.append(l4);

      // Add a onclick function to the button
      b1.click(grant_access_click);


      // List element 5 another button
      var l5 = $('<li>')
        .attr('class', 'ui-btn-text');
      // Button to undo access right
      var b2 = $('<a>')
        .attr('data-role', 'button')
        .attr('href', '#')
        .attr('noci-atad', 'minus')
        .attr('data-theme', 'e')
        .text('Retreat Access');

      l5.append(b2);

      u1.append(l5);

      // Also add a function here
      b2.click(retreat_access_click);

      u1.insertBefore($('#patient-delete').parent().parent());


      var data;

      // 1. Call the web service which transmits the selectable user ids
      // 2. Call the function to fill the select
      var responseText = jQuery.getJSON(
        'http://localhost:8000/userAdministration/',
        data,
        fill_select
        );


});

// Extract the patients's orthanc id from the url
function getPatientId() {

      var url_string = window.location.href;
      var url = new URL(url_string);
      var uuid = url.searchParams.get("uuid");

      return uuid;
}



// Fill the select during loading
// A callback method
function fill_select(data) {
  var s1 = $("#user-select");

  for (var user_mail in data["user-ids"]) {
    s1.append($('<option>', {value:user_mail, text: user_mail}));
  }

}


// To grant an access privilege sent a json request to the web service
function grant_access_click() {
  var json_dict = {};

  // Get the user select to extract the user's id
  select = document.getElementById("user-select");
  json_dict["MOD_MELLON_uid"] = select.value;

  // Get the patient id from the url
  json_dict["orthanc-id"] = getPatientId();

  // construct an HTTP request
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "http://localhost:8000/accessAdministration", false);
  xhr.setRequestHeader('Content-Type', 'application/json');

  // send the collected data as JSON
  var json_str = JSON.stringify(json_dict);
  xhr.send(json_str);
}


// To retreat the access privilege sent a json request to the web service
function retreat_access_click() {
  var json_dict = {};

  // Get the user select to extract the user's id
  select = document.getElementById("user-select");
  json_dict["MOD_MELLON_uid"] = select.value;

  // Get the patient id from the url
  json_dict["orthanc-id"] = getPatientId();

  // construct an HTTP request
  var xhr = new XMLHttpRequest();
  xhr.open("DELETE", "http://localhost:8000/accessAdministration", false);
  xhr.setRequestHeader('Content-Type', 'application/json');

  // send the collected data as JSON
  var json_str = JSON.stringify(json_dict);
  xhr.send(json_str);
}
