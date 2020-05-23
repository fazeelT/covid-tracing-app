$(document).ready(function() { 

  function createTable(tableData) {
  $('#contactsTable tbody').empty()
  var table = document.getElementById('contactsTable');
  var tableBody = document.createElement('tbody');

  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');
    var cell1 = document.createElement('td');
    cell1.appendChild(document.createTextNode(rowData._fields[0].properties.firstName));
    row.appendChild(cell1);

    var cell2 = document.createElement('td');
    cell2.appendChild(document.createTextNode(rowData._fields[0].properties.lastName));
    row.appendChild(cell2);
    
    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
}

  $("form[name='createContactTraceForm']").validate({
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
      myFName: "required",
      myLName: "required",
      contactFName: "required",
      contactLName: "required",
      dateOfMeeting: "required",
      timeOfMeeting: "required",
      locationOfMeeting: "required",
    },
    // Specify validation error messages
    messages: {
      myFName: "Please enter your First name",
      myLName: "Please enter your Last name",
      contactFName: "Please enter your contact first name",
      contactLName: "Please enter your contact last name",
      dateOfMeeting: "Please enter your date of meeting",
      timeOfMeeting: "Please enter your date of meeting",
      locationOfMeeting: "Please enter your location of meeting",
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form, e) {
      e.preventDefault();
      $("#submitContactTrace").button('loading'); 
      var formData = $(form).serializeArray().reduce(function(map, obj) {
        map[obj.name] = obj.value;
        return map;
        }, {});

      $.ajax({
        url: '/ajax/submit-create-contact-trace',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({"formData": formData}),
        success: function(response) {
          $("#submitContactTrace").button('reset'); 
          console.log('success');
        }, 
        error: function(){console.log('failure')}
      });
    }
  });

  $("form[name='searchContactTraceForm']").validate({
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
      contactFName: "required",
      contactLName: "required",
      dateOfMeeting: "required",
      timeOfMeeting: "required",
      locationOfMeeting: "required",
    },
    // Specify validation error messages
    messages: {
      contactFName: "Please enter your contact first name",
      contactLName: "Please enter your contact last name",
      dateOfMeeting: "Please enter your date of meeting",
      timeOfMeeting: "Please enter your date of meeting",
      locationOfMeeting: "Please enter your location of meeting",
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form, e) {
      e.preventDefault();
      $("#submitSearchContactTrace").button('loading'); 
      var formData = $(form).serializeArray().reduce(function(map, obj) {
        map[obj.name] = obj.value;
        return map;
      }, {});

      $.ajax({
        url: '/ajax/submit-search-contact-trace',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({"formData": formData}),
        success: function(response){
          createTable(response);
          $("#submitSearchContactTrace").button('reset'); 
        }, 
        error: function(){console.log('failure')}
      });
    }
  });
});