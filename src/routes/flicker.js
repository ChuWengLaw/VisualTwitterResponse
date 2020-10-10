/* function to initialise the request header */
const flickr = {
    method: 'flickr.photos.search',
    api_key: "36267718adcf5b2e865af5477f0b050b",
    format: "json",
    media: "photos",
    nojsoncallback: 1
};

/* function to initialise the request header */
function createFlickrOptions(lat, long, number, page) {
    const options = {
        hostname: 'api.flickr.com',
        port: 443,
        path: '/services/rest/?',
        method: 'GET'
    }
    const str = 'method=' + flickr.method +
        '&api_key=' + flickr.api_key +
        '&lat=' + lat +
        '&lon=' + long +
        '&per_page=' + number +
        '&page=' + page +
        '&format=' + flickr.format +
        '&media=' + flickr.media +
        '&nojsoncallback=' + flickr.nojsoncallback;
    options.path += str;
    return options;
}

//Various font sizes used to fit URL on screen
function parsePhotoRsp(rsp) {
    let s = "";
    for (let i = 0; i < rsp.photos.photo.length; i++) {
        photo = rsp.photos.photo[i];
        t_url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_m.jpg`;
        p_url = `https://www.flickr.com/photos/${photo.owner}/${photo.id}`;
        s += `<a href="${p_url}"><img alt="${photo.title}" src="${t_url}"/></a>`;
    }
    return s;
}

/* Render photos into side navigation */
function createView(title, rsp) {
    try {
        const number = rsp.photos.photo.length;
        const imageString = parsePhotoRsp(rsp);
        var str = "";
        if (number == 0) {
            str = '<div id="searchtext">No result</div>';
        } else {
            str = '<div id="searchtext">Showing ' + number +
                ' results in page</br>' + imageString + '</div>';
        }
    } catch (error) {
        console.log(error);
        str = '<div id="searchtext">Invalid address</div>';
    }
    return str;
}

module.exports = {
    createFlickrOptions,
    createView,
};