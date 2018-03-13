 
// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "ready!" );


//call to back end to get json and display on screen in list with hyperlink
  $.getJSON("/articles", function(data) {
    console.log(data);
    console.log(data.length);

    for (i=0; i< data.length; i++){

      console.log(data[i].article);

      $("#list").append('<a href=' + data[i].link +'><li>' + data[i].article + '</li></a>');
    }
  });

  });

