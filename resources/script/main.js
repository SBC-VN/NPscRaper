$( document ).ready(function() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/api/scrape",
        data: {scrape : true} 
      }).then(function(data) {
        console.log("API scrape response",data);
      });
});