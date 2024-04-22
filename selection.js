const app = {}
const vueApp = Vue.createApp(app);

const oneplayer = {
    name: "oneplayer",
    template: `<a href="oneplayergame.html"><button class="oneplayer">1 SPELARE</button></a>`
}
vueApp.component("one-player", oneplayer);


const twoplayer = {
    name: "twoplayer",
    template: `<a href="twoplayergame.html"><button class="oneplayer">2 SPELARE</button></a>`
}
vueApp.component("two-player", twoplayer);


vueApp.mount("#app");