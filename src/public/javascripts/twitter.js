/* Show trending twitter posts */
function showTweet(e) {
    try {
        let input = document.getElementsByClassName("form-control")[0].value;
        $.ajax({
            url: "/search?location=" + input, success: function (result) {
                var JSONResult = JSON.parse(result);
                console.log(JSONResult.url);
                //Render twitter posts in html
                let postDiv = document.getElementsByClassName('post1');
                postDiv[0].innerHTML = JSON.stringify(JSONResult.result[0]);
                let postDiv2 = document.getElementsByClassName('post2');
                postDiv2[0].innerHTML = JSON.stringify(JSONResult.result[1]);
                let postDiv3 = document.getElementsByClassName('post3');
                postDiv3[0].innerHTML = JSON.stringify(JSONResult.result[2]);

                //chart test
                
                var image = document.createElement("img");
                var imageParent = document.getElementById("chart");
                image.id = "id";
                image.className = "class";
                image.src = JSONResult.url;            
                imageParent.appendChild(image);
            }
        })
    } catch (error) {
        console.log(error);
    }
}

// /* Show chart info */
// function showChart(e) {
//     try {
//         let input = document.getElementsByClassName("form-control")[0].value;
//         $.ajax({
//             url: "/chart?location=" + input, success: function (result) {
//                 //Render chart in html
//                 var image = document.createElement("img");
//                 var imageParent = document.getElementById("chart");
//                 image.id = "id";
//                 image.className = "class";
//                 image.src = result;            
//                 imageParent.appendChild(image);
//             }
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }
