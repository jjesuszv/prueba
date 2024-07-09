let apiKey = 'AIzaSyDZEbmRD1hMUo3h2B6YDBW6hmVefBOa3GA';
let clientId = '241804693861-2a0dnb90q0se3ijdun35a4gkvvs25oi7.apps.googleusercontent.com';
let videoId = 'Rp2TXWMDkUg';

function handleClientLoad() {
    gapi.load('client:auth2', initClient);
}

function initClient() {
    gapi.client.init({
        apiKey: apiKey,
        clientId: clientId,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"],
        scope: "https://www.googleapis.com/auth/youtube.force-ssl"
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        document.getElementById('likeButton').addEventListener('click', handleLike);
        document.getElementById('dislikeButton').addEventListener('click', handleDislike);
        document.getElementById('commentButton').addEventListener('click', handleComment);
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        // Usuario está autenticado.
    } else {
        gapi.auth2.getAuthInstance().signIn();
    }
}

function handleLike() {
    gapi.client.youtube.videos.rate({
        id: videoId,
        rating: 'like'
    }).then(response => {
        console.log(response);
    });
}

function handleDislike() {
    gapi.client.youtube.videos.rate({
        id: videoId,
        rating: 'dislike'
    }).then(response => {
        console.log(response);
    });
}

function handleComment() {
    let comment = prompt('Escribe tu comentario:');
    if (comment) {
        gapi.client.youtube.commentThreads.insert({
            part: 'snippet',
            resource: {
                snippet: {
                    videoId: videoId,
                    topLevelComment: {
                        snippet: {
                            textOriginal: comment
                        }
                    }
                }
            }
        }).then(response => {
            console.log(response);
            loadComments();
        });
    }
}

function loadComments() {
    gapi.client.youtube.commentThreads.list({
        part: 'snippet',
        videoId: videoId,
        textFormat: 'plainText'
    }).then(response => {
        let commentsSection = document.getElementById('commentsSection');
        commentsSection.innerHTML = '';
        let comments = response.result.items;
        comments.forEach(comment => {
            let text = comment.snippet.topLevelComment.snippet.textDisplay;
            let commentElement = document.createElement('p');
            commentElement.textContent = text;
            commentsSection.appendChild(commentElement);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    handleClientLoad();
});
