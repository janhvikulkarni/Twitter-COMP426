
export async function getTweets() {
    const $root = $('#root');
    const result = await axios({
        method: 'get',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
      });

      const data = result.data;
      var tweets = `<div id="tweets" class="container is-max-desktop"><center>`
    for (var i = 0; i < 50; i++) {
        tweets += (`
        <div class="box" id="${data[i].id}">
            <h class="title is-3">${data[i].author}</h>
            <p id="body-${data[i].id}" class="is-size-3">${data[i].body}</p>
        </div>
        <p class="is-size-5">Likes: ${data[i].likeCount}  Replies: ${data[i].replyCount}  Retweets: ${data[i].retweetCount}</p><br>`);

        if (data[i].isMine == true) {
            tweets += (`
            <span id="edit-${data[i].id}">
                <button class="edit button" id="${data[i].id}" value="${data[i].body}" type="button">Edit</button>
            </span>`);

            tweets += (`
            <span id="reply-${data[i].id}">
                <button class="reply button" value="${data[i].id}" type="button">Reply</button>
            </span>`);

            tweets += (`<button class="del button" value="${data[i].id}" type="button">Delete</button>`);

            tweets += (`
            <span id="retweet-${data[i].id}">
                <button class="retweet button" id="${data[i].id}" value="${data[i].body}" type="button">Retweet</button>
            </span><br><br>
            `);

            tweets += (`<br>`);
        } else {
            if (data[i].isLiked == true) {
                tweets += (`<button class="unlike button" value="${data[i].id}" type="button">Unlike</button>`);
            } else {
                tweets += (`<button class="like button" value="${data[i].id}" type="button">Like</button>`);
            }
            tweets += (`
            <span id="reply-${data[i].id}">
                <button class="reply button" value="${data[i].id}" type="button">Reply</button>
            </span>`);
            
            tweets += (`
            <span id="retweet-${data[i].id}">
                <button class="retweet button" id="${data[i].id}" value="${data[i].body}" type="button">Retweet</button>
            </span><br><br>
            `);

            tweets += (`<br>`);
        }
    }

    tweets += `</center></div>`
    $root.append(tweets);
    $('#tweetPoster').replaceWith(`<button id="tweetButton" class="button">Tweet Something</button>`);

}

export async function postTweet(event) {
    event.preventDefault();
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            body: "" + $("textarea[id=post]").val() + ""
        }
    });
    $('#tweets').replaceWith(getTweets());
}

export async function likeTweet(event) {
    event.preventDefault();
    var likeURL = "https://comp426-1fa20.cs.unc.edu/a09/tweets/" + event.target.value + "/like";
    const result = await axios ({
        method: 'put',
        url: likeURL,
        withCredentials: true
    });
    $('#tweets').replaceWith(getTweets());
}

export async function unlikeTweet(event) {
    event.preventDefault();
    var unlikeURL = "https://comp426-1fa20.cs.unc.edu/a09/tweets/" + event.target.value + "/unlike";
    const result = await axios ({
        method: 'put',
        url: unlikeURL,
        withCredentials: true
    });
    $('#tweets').replaceWith(getTweets());
}

export async function deleteTweet(event) {
    event.preventDefault();
    var deleteURL = "https://comp426-1fa20.cs.unc.edu/a09/tweets/" + event.target.value;
    const result = await axios ({
        method: 'delete',
        url: deleteURL,
        withCredentials: true
    });
    $('#tweets').replaceWith(getTweets());
}

export async function editTweet(event) {
    $('div[id='+event.target.id+']').html(`
    <form id="form-${event.target.id}" class="editing">
        <textarea id="edit" class="textarea">${event.target.value}</textarea><br>
        <button id="${event.target.id}" class="submitEdits button" type="button">Submit</button>
    </form>`);
}

export async function postEdits(event) {
    event.preventDefault();
    let editedURL = "https://comp426-1fa20.cs.unc.edu/a09/tweets/" + event.target.id;
    const result = await axios({
        method: 'put',
        url: editedURL,
        withCredentials: true,
        data: {
            body: "" + $("textarea[id=edit]").val() + ""
        }
    });
    $('#tweets').replaceWith(getTweets());
}

export async function retweet(event) {
    $('div[id='+event.target.id+']').html(`
    <form id="rt-${event.target.id}" class="rtForm">
        <textarea id="retweeting" class="textarea" placeholder="Add a comment"></textarea><br>
        <button id="${event.target.id}" class="submitRT button" value="${event.target.value}" type="button">Submit</button>
    </form>`);
}

export async function postRetweet(event) {
   event.preventDefault();
   let body = event.target.getAttribute('value');
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            type: "retweet",
            parent: event.target.id,
            body: "RT: '" + body + "' " + $("textarea[id=retweeting]").val() + ""
        }
    });
    $('#tweets').replaceWith(getTweets());
}

export async function reply(event) {
    $('div[id='+event.target.value+']').html(`
    <form id="reply-${event.target.value}" class="replyForm">
        <textarea id="replying" class="textarea" placeholder="Tweet your reply"></textarea><br>
        <button id="${event.target.value}" class="submitReply button" type="button">Submit</button>
    </form>`);
}

export async function postReply(event) {
    event.preventDefault();
    const result = await axios({
        method: 'post',
        url: 'https://comp426-1fa20.cs.unc.edu/a09/tweets',
        withCredentials: true,
        data: {
            type: "reply",
            parent: event.target.id,
            body: "" + $("textarea[id=replying]").val() + ""
        }
    });
    $('#tweets').replaceWith(getTweets());
}
 
export async function writeTweet(event) {
    $('#tweetButton').replaceWith(`<form id="tweetPoster" class="form">
    <textarea id="post" class="textarea" placeholder="What's happening?"></textarea><br>
    <button class="button" type="submit">Tweet</button>
    </form>`);
}

export const renderTwitter = function () {
   
    getTweets();

    $(document).on("click", "#tweetButton", writeTweet);
    $(document).on("submit", ".form", postTweet);
    $(document).on("click", ".like", likeTweet);
    $(document).on("click", ".unlike", unlikeTweet);
    $(document).on("click", ".del", deleteTweet);
    $(document).on("click", ".edit", editTweet);
    $(document).on("click", ".submitEdits", postEdits);
    $(document).on("click", ".retweet", retweet);
    $(document).on("click", ".submitRT", postRetweet);
    $(document).on("click", ".reply", reply);
    $(document).on("click", ".submitReply", postReply);
};

$(function () {
    renderTwitter();
});