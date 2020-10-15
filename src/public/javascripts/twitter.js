/* Retrieve tweets info */
function showTweet(e) {
    try {
        let input = document.getElementsByClassName("form-control")[0].value;
        $.ajax({
            url: "/search?location=" + input, success: function (result) {
                let postDiv = document.getElementsByClassName('post1');
                postDiv[0].innerHTML = JSON.stringify(result[0]);
                let postDiv2 = document.getElementsByClassName('post2');
                postDiv2[0].innerHTML = JSON.stringify(result[1]);
                let postDiv3 = document.getElementsByClassName('post3');
                postDiv3[0].innerHTML = JSON.stringify(result[2]);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

/* Retrieve chart info */
function showChart(e) {
    try {
        let input = document.getElementsByClassName("form-control")[0].value;
        $.ajax({
            url: "/chart?location=" + input, success: function (result) {
                let postDiv = document.getElementById('chart');
                postDiv.src = result;
                //var ctx = postDiv.getContext("2d");
                //ctx.drawImage(result, 10, 10);
            }
        })
    } catch (error) {
        console.log(error);
    }
}
