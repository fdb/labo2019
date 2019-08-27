require('dotenv').config();
const fs = require('fs');;
const { WebClient } = require('@slack/web-api');
const token = process.env.SLACK_TOKEN;
const web = new WebClient(token);
const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');

const app = express()
const port = 3000;
let gChannelId = null;

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
     res.writeHead(200, {
        "Content-Type": "text/html"
    });
    res.end(fs.readFileSync('index.html', 'utf-8'))
});

app.post('/postChat', (req, res) => {
  if (!gChannelId) {
    console.error('Channel is not loaded yet!');
    return;
  }

  let imageUrl;
  const message = req.body.message;
  if (message === 'ALPHA') {
    imageUrl = `https://i.imgur.com/pSvXYJf.png`
  } else if (message === 'BETA') {
    imageUrl = `https://source.unsplash.com/300x300/?bike`
  }

  const result = web.chat.postMessage({
  blocks: [{
    "type": "image",
    "title": {
      "type": "plain_text",
      "text": message,
      "emoji": true
    },
    "image_url": imageUrl,
    "alt_text": message
  }],

     channel: gChannelId,
  });
  res.end('OK');
});

async function loadChannelId()  {
    const channels = await web.conversations.list();
    const channel = channels.channels.find(c => c.name === 'iphone_ensemble_performancechannel');
    gChannelId = channel.id;
    console.log('LOADED IPHONE ENSEMBLE PERFORMANCE CHANNEL ID', gChannelId);

    //  console.log(`Successfully send message ${result.ts} in conversation ${channelId}`);


    // console.log(channels.channels.map(c => c.name));
}
loadChannelId();
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
