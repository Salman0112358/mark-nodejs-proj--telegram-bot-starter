import { Telegraf } from 'telegraf'
import getBotTokenOrQuit from './util/getBotToken';
import dotenv from 'dotenv';
import axios from 'axios';

const botToken = getBotTokenOrQuit();
const API_KEY = process.env.MOVIE_API_KEY;
const API_URL = 'https://api.themoviedb.org/3/';


const bot = new Telegraf(botToken)

bot.start((ctx) => ctx.reply("Hello!  Let's talk!"))
bot.help((ctx) => ctx.reply('Hmm i am not programmed to be helpful, yet!'))
bot.hears('hello', (ctx) => ctx.reply('Ok, I heard you say hello'))
bot.command('sing', (ctx) => ctx.reply('La la la!  I got your command.'))

// return whale image
bot.command("/whale" , async (ctx) => {
    const whaleObject =  (await axios.get("https://some-random-api.ml/img/whale")).data
    const whaleImage =  whaleObject.link
    ctx.replyWithPhoto({url : whaleImage}); 
}
)

bot.command("/poll", async (ctx) => {
    const whaleObject =  (await axios.get("https://some-random-api.ml/img/whale")).data
    const whaleImage =  whaleObject.link
    ctx.replyWithPoll("Which is the HOTTEST WHALE BUDDY?" , [whaleImage, whaleImage, whaleImage, whaleImage], { is_anonymous: true })
})

bot.command("/top10", async(ctx) => {
    const movieList = (await axios.get(`${API_URL}movie/popular?api_key=${API_KEY}&language=en-US`)).data;
    const moviesNames = movieList.results
    const movieTitle = []
    for (let item of moviesNames){
        movieTitle.push(item.title)
    }
    console.log(movieTitle);
    ctx.replyWithPoll("These are the most popular movies right now. Which One are you most excited for ?" , movieTitle.slice(0,10) , { is_anonymous: true })
})


bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
