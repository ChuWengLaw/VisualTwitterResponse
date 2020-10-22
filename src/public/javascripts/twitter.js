/* Show trending twitter posts */
function showTweet(e) {
    try {
        let input = document.getElementsByClassName("form-control")[0].value;
        //Make client side changes using ajax 
        $.ajax({
            //Redirect to router funciton in index.js
            url: "/search?location=" + input, success: function (result) {
                var JSONResult = JSON.parse(result);

                if (result === "") {
                    console.log("catched in twitter.js");
                    $("#myModal").modal();
                }
                
                //Render twitter topics in html
                let topic1 = document.getElementsByClassName('topic1');
                topic1[0].innerHTML = JSON.stringify(JSONResult.topic[0]);
                let topic2 = document.getElementsByClassName('topic2');
                topic2[0].innerHTML = JSON.stringify(JSONResult.topic[1]);
                let topic3 = document.getElementsByClassName('topic3');
                topic3[0].innerHTML = JSON.stringify(JSONResult.topic[2]);

                //Render twitter posts in html
                let postDiv = document.getElementsByClassName('post1');
                postDiv[0].innerHTML = JSON.stringify(JSONResult.result[0]);
                let postDiv2 = document.getElementsByClassName('post2');
                postDiv2[0].innerHTML = JSON.stringify(JSONResult.result[1]);
                let postDiv3 = document.getElementsByClassName('post3');
                postDiv3[0].innerHTML = JSON.stringify(JSONResult.result[2]);

                //Render sent chart in html
                var imagesentParent = document.getElementById("sentchart");
                //remove all child nodes
                while (imagesentParent.hasChildNodes()) {
                    imagesentParent.removeChild(imagesentParent.lastChild);
                }
                var imagesent = document.createElement("img");                
                imagesent.id = "id";
                imagesent.className = "class";
                imagesent.src = JSONResult.sentchart;
                imagesentParent.appendChild(imagesent);

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
                let score1 = document.getElementsByClassName('score1');
                score1[0].innerHTML = JSON.stringify(JSONResult.rating[0]);
                let score2 = document.getElementsByClassName('score2');
                score2[0].innerHTML = JSON.stringify(JSONResult.rating[1]);
                let score3 = document.getElementsByClassName('score3');
                score3[0].innerHTML = JSON.stringify(JSONResult.rating[2]);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

