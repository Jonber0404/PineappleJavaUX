let decadeEnd, decadeStart, totalAmount

// Main meny
const homePage = {
    name: "homePage",
    template: `<router-link to="/playerSelection"><button class='playbutton'>Spela</button></router-link>
                <router-link to="/scoreboard"><button class='scoreboardbutton'>Scoreboard</button></router-link>
                <router-link to="/gameRules"><button class='gamerulesbutton'>Spelregler</button></router-link>`
}

// Single player eller two player
const playerSelection = {
    name: "playerSelection",
    template: `<div class="main-flex">
            <h1>ANTAL SPELARE</h1>
                <div class="selection">
                    <router-link to="/onePlayerGame"><button class="oneplayer">1 SPELARE</button></router-link>
                    <router-link to="/onePlayerGame"><button class="oneplayer">2 SPELARE</button></router-link>
                </div>
            </div>`
}

// scoreboard
const scoreboard = {
    name: "scoreboard",
    template: `<p>lägg till scoreboard här</p>`
}

// spelregler
const gameRules = {
    name: "gameRules",
    template: `<p>lägg till gameRules här</p>`
}

const onePlayerGame = {
    name: "onePlayerGame",
    beforeCreate() {
        this.generateDecade()
    },
    created() {
        this.extractData()
    },
    mounted() {
        this.startTimer()
    },
    data() {
        return {
            points: 10,
            count: 60,
            objekt: {},
            objektBild: "",
            objektDatum: "",
            objektDesc: "",
            objektUrl: "",
            timer: null,
            decadeS: decadeStart,
            decadeE: decadeEnd
        }
    },
    methods: {
        async extractData() {
            let fetchRes = await this.getObjectData()
            let currentRecord = fetchRes.result.records[0].record['@graph']
            this.objektBild = currentRecord.find(obj => obj.lowresSource).lowresSource
            this.objektDesc = currentRecord.find(obj => obj.desc).desc
            this.objektUrl = currentRecord.find(obj => obj.url).url
            for (obj of currentRecord) {
                if (Object.keys(obj).includes("contextLabel")) {
                    if (obj.contextLabel.includes("Fotografering") && obj.contextType.includes("produce")) {
                        this.objektDatum = obj.fromTime
                    }
                }
            }
        },
        startTimer() {
            this.timer = setInterval(() => {
                this.count--;
                if (this.count === 0 || this.count < 0) {
                    this.points = this.points - 2
                    this.count = 60
                }
            }, 1000)
        },
        stopTimer() {
            clearInterval(this.timer)
        }
    },
    template: `<div class="main-flex">
            <h1>Vilket årtioende söker vi?</h1>
            <h2>{{points}} POÄNG</h2>
            <h3>Timer: {{count}}</h3>
            <img :src="objektBild" alt="" class="fetchedImage">
            <p> Bildtext: {{objektDesc}}</p>
            <p>Fotograferad: {{objektDatum}}</p>
            <button class="stopButton" @click="stopTimer">NÖDBROMS</button>
            <input type="date" class="date" value ="1900-01-01">
            </div>`
}

// skapa router
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/', component: homePage },
        { path: '/playerSelection', component: playerSelection },
        { path: '/scoreboard', component: scoreboard},
        { path: '/gameRules', component: gameRules},
        { path: '/onePlayerGame', component: onePlayerGame}
    ]
})


const app = {}
const vueApp = Vue.createApp(app)

// Här nedanför kan man lägga globala metoder
vueApp.config.globalProperties.generateDecade = function () {
        switch (Math.floor(Math.random() * 10)) {
            case 0:
                decadeStart = 1900
                break
            case 1:
                decadeStart = 1910
                break
            case 2:
                decadeStart = 1920
                break
            case 3:
                decadeStart = 1930
                break
            case 4:
                decadeStart = 1940
                break
            case 5:
                decadeStart = 1950
                break
            case 6:
                decadeStart = 1960
                break
            case 7:
                decadeStart = 1970
                break
            case 8:
                decadeStart = 1980
                break
            case 9:
                decadeStart = 1990
                break
        }
        decadeEnd = decadeStart + 9
        totalAmount = 6407;
}

vueApp.config.globalProperties.getObjectData = async function () {
    let randomObjekt = Math.floor((Math.random() * totalAmount) + 1)
    try {
        const response = await fetch(`https://kulturarvsdata.se/ksamsok/api?` +
            `method=search&hitsPerPage=1&startRecord=${randomObjekt}&query=create_fromTime>=${decadeStart}` +
            `+AND+create_fromTime<=${decadeEnd}+AND+itemType=foto+AND+thumbnailExists=j+AND+timeInfoExists=j` +
            `+AND+contextLabel=Fotografering`, {
            headers: { 'Accept': 'application/json' }
        });
        return await response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

vueApp.use(router)
vueApp.mount("#app")