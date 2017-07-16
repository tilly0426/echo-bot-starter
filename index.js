const express = require('express')
const bodyParser = require('body-parser')
const request = require('request')

const PORT = process.env.PORT || 3000
const FACEBOOK_ACCESS_TOKEN = 'EAAD2xQkzR9MBADq63da4uWWYAlRYc1VvVNDqF0XrXEhZAZBboWQqA69RI7jznkgMCYjpj0UZCZCNZBV2mH7CpMDZAUaJTh8pYRbMTMWIBu9tkPQH4aHhbJCYsD5QZBxF53Lm5VLtZCYlyQlsiTZBv7GubOEjDus21JJBCK02sfYQndQZDZD';
const app = express()
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// test 
// parse application/json
app.use(bodyParser.json())

app.get('/facebook', function (req, res) {
  console.log('query:', req.query);
  console.log('body:', req.body);
    if (req.query['hub.verify_token'] === 'okok') {
      res.send(req.query['hub.challenge']);
    } else {
      res.send('Error, wrong validation token');    
    }
})

// handler receiving messages
app.post('/facebook', function (req, res) {
    console.log('query:', req.query);
    console.log('body:', req.body);
    let events = req.body.entry[0].messaging
    for (i = 0; i < events.length; i++) {
        let event = events[i]
        if (event.message) {
            if (event.message.text) {
                sendMessage(event.sender.id, { text: event.message.text })
            }
        }
    }
    res.sendStatus(200)
})

// generic function sending messages
function sendMessage(recipientId, message) {
    let options = {
        url: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN },
        method: 'POST',
        json: {
            recipient: { id: recipientId },
            message: message,
        }
    }
    request(options, function (error, response, body) {
        if (error) {
            console.log('Error sending message: ', error);
        }
        else if (response.body.error) {
            console.log('Error: ', response.body.error);
        }
    })
}

app.get('/line', function (req, res) {
  console.log('query:', req.query);
  console.log('body:', req.body);
  res.send('hello line from GET');
})

app.post('/line', function (req, res) {
  console.log('query:', req.query);
  console.log('body:', req.body);
  res.send('hello line from POST');
})

app.get('/telegram', function (req, res) {
  console.log('query:', req.query);
  console.log('body:', req.body);
  res.send('hello telegram from GET');
})

app.post('/telegram', function (req, res) {
  console.log('query:', req.query);
  console.log('body:', req.body);
  res.send('hello telegram from POST');
})


app.listen(PORT, function () {
  console.log('Example app listening on port 3000!')
})