$("#modal-close-x").on("click",function(event) {
  $("#comment-modal").css("display","none");
});

$("#modal-cancel").on("click",function(event) {
  $("#comment-modal").css("display","none");
});

//
//  The modal adds a new comment to an article or updates an existing comment.
//
$("#modal-submit").on("click",function(event) {
  let articleId = $("#modal-article-id").text();
  let commentId = $("#modal-comment-id").text();
  let comment = $("#modal-text-field").val();
  $("#comment-modal").css("display","none");

  if (commentId) {
    console.log("CommentId",commentId);
    $.ajax({
      type: "POST",
      dataType: "json",
      url: "/api/comment/update/"+commentId,
      data: { comment }
      }).then(function(data) {
        console.log("API comment submit response",data);
        location.reload(true);
      });
  }
  else {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/api/comment/add/"+articleId,
        data: { comment }
        }).then(function(data) {
          console.log("API comment submit response",data);
          location.reload(true);
        });
      }
});

$( document ).ready(function() {
    $.ajax({
        type: "POST",
        dataType: "json",
        url: "/api/scrape",
        data: {scrape : true} 
      }).then(function(data) {
        console.log("API scrape response",data);
        //location.reload(true);
      });

      $(".v-edit-icon").on("click", function(event) {
        let commentId = "";
        let articleId = this.dataset.articleid;
        let titleText = $("#v-article-row-" + articleId + "-title").text();
        $("#modal-article-id").text(articleId);
        $("#modal-article-title").text(titleText);
        $("#modal-comment-id").text(commentId);
        $("#modal-text-field").val("");
        $("#comment-modal").css("display","block");
      });

      $(".v-comment-text").on("click", function(event) {
        let commentId = this.dataset.commentId;
        let articleId = this.dataset.articleId;

        let titleText = $("#v-article-row-" + articleId + "-title").text();
        $("#modal-article-id").text(articleId);
        $("#modal-article-title").text(titleText);
        $("#modal-comment-id").text(commentId);
        $("#modal-text-field").val($(this).text().trim());
        $("#comment-modal").css("display","block");
      });

      $(".delete-comment").on("click", function(event) {
        let commentId = this.dataset.commentId;
        $.ajax({
          type: "POST",
          dataType: "json",
          url: "/api/comment/delete/"+commentId,
          data: { id : commentId }
          }).then(function(data) {
            console.log("API comment delete response",data);
            location.reload(true);
          });
        }
      );
});