const app = {}
        
const vueApp = Vue.createApp(app)

const playbutton ={
    name: "PlayButton",
    template: `<a href="playerselection.html"><button class='playbutton'>Spela</button></a>`
}
vueApp.component("play-button", playbutton)

const scoreboardbutton ={
    name: "ScoreboardButton",
    template: `<a href="scoreboard.html"><button class='scoreboardbutton'>Scoreboard</button></a>`
}
vueApp.component("scoreboard-button", scoreboardbutton)

const gamerulesbutton ={
    name: "GamerulesButton",
    template: `<a href="gamerules.html"><button class='gamerulesbutton'>Spelregler</button></a>`
}
vueApp.component("gamerules-button", gamerulesbutton)


vueApp.mount("#app")