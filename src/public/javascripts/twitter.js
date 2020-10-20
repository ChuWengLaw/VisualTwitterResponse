/* Show trending twitter posts */
function showTweet(e) {
    try {
        let input = document.getElementsByClassName("form-control")[0].value;
        //Make client side changes using ajax 
        $.ajax({
            //Redirect to router funciton in index.js
            url: "/search?location=" + input, success: function (result) {
                var JSONResult = JSON.parse(result);

                //Render twitter posts in html
                let postDiv = document.getElementsByClassName('post1');
                postDiv[0].innerHTML = JSON.stringify(JSONResult.result[0]);
                let postDiv2 = document.getElementsByClassName('post2');
                postDiv2[0].innerHTML = JSON.stringify(JSONResult.result[1]);
                let postDiv3 = document.getElementsByClassName('post3');
                postDiv3[0].innerHTML = JSON.stringify(JSONResult.result[2]);

                //Render chart in html
                var imageParent = document.getElementById("chart");
                //remove all child nodes
                while (imageParent.hasChildNodes()) {
                    imageParent.removeChild(imageParent.lastChild);
                }
                var image = document.createElement("img");                
                image.id = "id";
                image.className = "class";
                image.src = JSONResult.url;
                imageParent.appendChild(image);

                //Render sentimental scores in html
                console.log(JSONResult.score);
                let score1 = document.getElementsByClassName('score1');
                score1[0].innerHTML = JSON.stringify(JSONResult.score[0]);
                let score2 = document.getElementsByClassName('score2');
                score2[0].innerHTML = JSON.stringify(JSONResult.score[1]);
                let score3 = document.getElementsByClassName('score3');
                score3[0].innerHTML = JSON.stringify(JSONResult.score[2]);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

