const express = require('express');
const app = express();
const bodyParser = require('body-parser');
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// get route for landing page
app.get('/',(req,res)=>{

    res.render('landingPage.ejs');
})

app.post('/response',async (req, res) => {
    // get the voice input as a text
    const  transcript  = req.body.transcript;

    const result = await processText(transcript);
    res.render('result.ejs' , {result});

});


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// get response from the gpt
const processText = async (text) => {

    try {
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: text}],
          });
        
          return chatCompletion.data.choices[0].message.content;
    } catch (error) {
        console.log(error);
        res.send(error);
    }
}

const port = process.env.PORT || 3001;
app.listen(port);