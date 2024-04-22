const app = {}
        
const vueApp = Vue.createApp(app)

const playbutton ={
    name: "PlayButton",
    template: `<button class='playbutton'>Spela</button>`
}
vueApp.component("play-button", playbutton)

const scoreboardbutton ={
    name: "ScoreboardButton",
    template: `<button class='scoreboardbutton'>Scoreboard</button>`
}
vueApp.component("scoreboard-button", scoreboardbutton)

const gamerulesbutton ={
    name: "GamerulesButton",
    template: `<button class='gamerulesbutton'>Spelregler</button>`
}
vueApp.component("gamerules-button", gamerulesbutton)


vueApp.mount("#app")