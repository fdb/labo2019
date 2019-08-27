
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
    if (!gChannelId)
    console.log(req.body);
     const result = web.chat.postMessage({
        text: req.body.message,
    channel: gChannelId,
      });
     res.end('OK');

})

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
