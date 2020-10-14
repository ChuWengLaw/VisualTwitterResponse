/* Retrieve tweets info */
function showTweet(e) {
    try {
        let input = document.getElementsByClassName("form-control")[0].value;
        $.ajax({
            url: "/search?location=" + input, success: function (result) {
                let postDiv = document.getElementsByClassName('post1');
                    postDiv[0].innerHTML = JSON.stringify(result);
                }
            })
    } catch(error) {
        console.log(error);
    }
}
