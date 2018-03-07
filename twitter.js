let Twitter = require('twitter');
let fs = require('fs');

let client = new Twitter({
    consumer_key: '7v06ZKQZVqv1gMOxuWQqcE4oC',
    consumer_secret: 'hGcMvza98uShkTqZty8j26P04oBYahyBt3chmzNXftnTfzsevI',
    access_token_key: '37979052-W1zhNsiJEFbX4L9ItUF3p0LZUZO0Dm0mX2a7GWByU',
    access_token_secret: '298WZjEmvOS7Cf9Vmv1jjgKEQodAreQBBZlvibFl6YAC8'
});

let max_id = 0;

client.get('statuses/user_timeline', {screen_name: 'StephenKing', count: 200, max_id: 409050312159133700}, function(error, tweets, response) {
    if (!error) {
        var stream = fs.createWriteStream("SK.txt", {'flags': 'a'});
        stream.once('open', function(fd) {
            console.log(tweets.length);

            tweets.forEach(function(tweet) {
                if (tweet.retweeted_status === undefined) {
                    let text = tweet.text;
                    text = text.replace('\n', ' ');
                    let words = text.split(' ');

                    if (words.some(word => word.match(/^[A-Z]{3,}$/))) {
                        stream.write(tweet.text + "\n\n" + "------------------" + "\n\n");
                    }
                }
                max_id = tweet.id;
            });

            stream.end();
            console.log(max_id);
        });
    }
});

