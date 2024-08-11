require('dotenv').config()

const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const app = express();
const axios = require("axios");
const sdk = require('@api/leonardoai');
const Jimp = require('jimp');
const bot = new TelegramBot(process.env.TOKEN, { polling: true });
const PORT = process.env.PORT || 9000
sdk.auth(process.env.SDK);
app.use(express.json());
app.use(express.urlencoded({ extended: true, }));
app.get('/', (req, res) => {
    res.status(200).json({ status: 'success', payload: "Image Generation Bot" });
});



const commands = [
    { command: '/start', description: 'Start the bot' },
    { command: '/help', description: 'Display this help message' },
    { command: '/imagine', description: 'Generate an image based on the provided prompt' },

];

bot.setMyCommands(commands);

bot.onText(/\/start/, (msg, match) => {
    let name = msg.chat.first_name;

    const chatId = msg.chat.id;
    const welcomeMessage = `Hey ${name}! \n \nWelcome to the bot! Here are some commands you can use: \n \n - /start: Start the bot \n - /help: Display this help message   \n - /imagine: Generate an image from prompt /imagine < prompt >  \nyou can just chat with the bot and it will respond to you.  \n\nIf you have any questions or need assistance, feel free to ask! \n  \nDon't forget to check us out on Twitter and Telegram`;

    const inlineKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Telegram', url: 'https://t.me/marvinonbase'
                    },

                    {
                        text: 'Twitter', url: 'https://twitter.com/MarvinBaseChain'
                    },

                ],
                [
                    {
                        text: 'Website', url: 'https://marvinonbase.com/'
                    },

                ]
            ]
        }
    };

    bot.sendMessage(chatId, welcomeMessage, inlineKeyboard);
});


bot.onText(/\/help/, (msg, match) => {
    let name = msg.chat.first_name;
    const chatId = msg.chat.id;
    const welcomeMessage = `Hey ${name}! \n \nWelcome to the bot! Here are some commands you can use: \n \n - /start: Start the bot \n - /help: Display this help message  \n -  \n - /image: Generate an image from prompt /image < prompt >   \n  \nyou can just chat with the bot and it will respond to you.  \n\nIf you have any questions or need assistance, feel free to ask! \n  \nDon't forget to check us out on Twitter and Telegram`;

    const inlineKeyboard = {
        reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: 'Telegram', url: 'https://t.me/marvinonbase'
                    },

                    {
                        text: 'Twitter', url: 'https://twitter.com/MarvinBaseChain'
                    },

                ],
                [
                    {
                        text: 'Website', url: 'https://marvinonbase.com/'
                    },

                ]
            ]
        }
    };

    bot.sendMessage(chatId, welcomeMessage, inlineKeyboard);
});



bot.onText(/\/image (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    let prompt = match[1].toLowerCase();
    prompt = prompt.replace(/marvin/g, 'a marvin');
    const loadingGif = 'https://firebasestorage.googleapis.com/v0/b/contactme-2970e.appspot.com/o/bs.gif?alt=media&token=611675ee-ee3e-414e-b19f-427faef3f3fd';
    const generatingMessage = await bot.sendAnimation(chatId, loadingGif);

    try {
        const { data } = await sdk.createGeneration({

            height: 768,
            num_images: 1,
            // modelId: "aa77f04e-3eec-4034-9c07-d0f619684628",
            // modelId: "a20973c6-6e2a-4df4-ad70-f46cce08ef8d",
            modelId: "e6fe2d4e-20a1-4bd6-931e-8cc37786dfec",

            width: 768,
            alchemy: true,
            prompt: prompt,
            presetStyle: "DYNAMIC",
            negative_prompt: 'deformed, blurry, bad anatomy, bad eyes, crossed eyes, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, floating limbs, disconnected limbs, malformed hands, out of focus, long neck, long body, mutated hands and fingers, out of frame, cropped, low-res, close-up, double heads, too many fingers, ugly face,plastic, repetitive, black and white, grainy'


        });



        const generationId = data.sdGenerationJob.generationId;

        setTimeout(async () => {
            try {
                const genData = await sdk.getGenerationById({ id: generationId });
                const imageUrl = genData.data.generations_by_pk.generated_images[0].url;
                await bot.sendPhoto(chatId, imageUrl);
            } catch (error) {
                console.error(error);
                await bot.sendMessage(chatId, "Error retrieving generated image.");
            }
        }, 60000);

    } catch (err) {
        console.error(err);
        await bot.sendMessage(chatId, "Failed to generate image.");
    } finally {
        setTimeout(async () => {
            await bot.deleteMessage(chatId, generatingMessage.message_id);

        }, 10000);
    }
});
bot.onText(/\/imagine (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    let prompt = match[1].toLowerCase();
    prompt = prompt.replace(/marvin/g, 'a marvin');
    const loadingGif = 'https://firebasestorage.googleapis.com/v0/b/contactme-2970e.appspot.com/o/bs.gif?alt=media&token=611675ee-ee3e-414e-b19f-427faef3f3fd';
    const generatingMessage = await bot.sendAnimation(chatId, loadingGif);

    try {
        const { data } = await sdk.createGeneration({
            height: 512,
            modelId: "49b700ee-1222-46af-996b-04a00f94bbc7",
            num_images: 1,
            presetStyle: 'DYNAMIC',
            prompt: prompt,
            alchemy: true,
            width: 512,
            negative_prompt: 'deformed, blurry, bad anatomy, bad eyes, crossed eyes, disfigured, poorly drawn face, mutation, mutated, extra limb, ugly, poorly drawn hands, missing limb, floating limbs, disconnected limbs, malformed hands, out of focus, long neck, long body, mutated hands and fingers, out of frame, cropped, low-res, close-up, double heads, too many fingers, ugly face,plastic, repetitive, black and white, grainy'
        });

        const generationId = data.sdGenerationJob.generationId;

        setTimeout(async () => {
            try {
                const genData = await sdk.getGenerationById({ id: generationId });
                const imageUrl = genData.data.generations_by_pk.generated_images[0].url;

                await bot.sendPhoto(chatId, imageUrl);
            } catch (error) {
                console.error(error);
                await bot.sendMessage(chatId, "Error retrieving generated image.");
            }
        }, 40000);

    } catch (err) {
        console.error(err);
        await bot.sendMessage(chatId, "Failed to generate image.");
    } finally {
        setTimeout(async () => {
            await bot.deleteMessage(chatId, generatingMessage.message_id);
        }, 40000);
    }
});




app.listen(PORT, () => {
    console.log('Bot listening on port ' + PORT)
});