import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const PORT = process.env.PORT || 5000;

const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;
    const conversation = req.body.conversation;

    const response = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 1.0,
      max_tokens: 500,
      frequency_penalty: 0.2,
      presence_penalty: 0.2,
      messages: [
        {
          role: 'system',
          content: `this is current conversation: ${conversation}. always write programming 
          language name inside code. Only put code inside three backticks 
          Your name is chatGPT 2.5, developed with gpt 3.5 turbo,
          created by Akaki Gogokhia, you have image generation, 
          voice assistant and speech recognition`,
        },

        { role: 'user', content: prompt },
      ],
    });

    res.status(200).send({
      bot: response.data.choices[0].message.content,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.post('/dalle', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: '256x256',
    });
    res.status(200).send({
      url: response.data.data[0].url,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.listen(5000, () => {
  console.log(`server is running on localhost:${PORT}`);
});
