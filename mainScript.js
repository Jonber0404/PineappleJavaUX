let decadeEnd, decadeStart, totalAmount;


// Main meny
const homePage = {
    name: "homePage",
    template: `<router-link to="/playerSelection"><button class='playbutton startmenubutton'>Spela</button></router-link>
                <router-link to="/scoreboard"><button class='scoreboardbutton startmenubutton'>Scoreboard</button></router-link>
                <router-link to="/gameRules"><button class='gamerulesbutton startmenubutton'>Spelregler</button></router-link>`
}

// Single player eller two player
const playerSelection = {
    name: "playerSelection",
    data() {
        return {
            numPlayers: 0
        }
    }, methods: {
        setPlayers(num) {
            this.$root.numPlayers = num;
        }
    },

    template: `<div class="main-flex">
            <h1>ANTAL SPELARE</h1>
                <div class="selection">
                    <router-link to="/difficultySelection" @click="setPlayers(1)"><button class="oneplayer">1 SPELARE</button></router-link>
                    <router-link to="/difficultySelection" @click="setPlayers(2)"><button class="oneplayer">2 SPELARE</button></router-link>
                </div>
            </div>`
}

//Välj svårighetsgrad, som ska vara efter man valt antalet spelare
const difficultySelection = {
    name: "difficultySelection",
    data() {
        return {
            difficulty: 0
        }
    }, methods: {
        setDifficulty(n) {
            this.difficulty = n;
        }
    },
    template: `<div class="main-flex">
    <h1>VÄLJ SVÅRIGHETSGRAD</h1>
        <div class="selection">


            <button class="easy" @click="setDifficulty(1)">LÅG</button>
            <button class="medium" @click="setDifficulty(2)">MEDIUM</button>
            <button class="hard" @click="setDifficulty(3)">HÖG</button>

            <p>Selected difficulty: {{ difficulty }}</p>

            <router-link v-if="$root.numPlayers === 1" to="/onePlayerGame"><button class="startGameArrow">Starta Spelet</button></router-link>
            <router-link v-else-if="$root.numPlayers === 2" to="/twoPlayerGame"><button class="startGameArrow">Starta Spelet</button></router-link>
            
        </div>
    </div>`
}


// scoreboard
const scoreboard = {
    name: "scoreboard",
    data() {
        return {
            playerInfo: []
        }
    },

    created() {
        let playerData = localStorage.getItem('playerData');
        this.playerInfo = JSON.parse(playerData) || [];
        this.sortedArrays();

    },
    methods: {
        sortedArrays() {
            return this.playerInfo.sort((a, b) => b.pointsEarned - a.pointsEarned)
        }
    },
    template: `<p v-for="(player, i) in playerInfo" :key="i">Namn: {{player.playerName}} - Poäng: {{player.pointsEarned}} </p>
    <router-link to="/"><button class='playbutton startmenubutton'>Huvudmeny</button></router-link> `
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
        this.extractData();
        this.playerData = JSON.parse(localStorage.getItem('playerData') || '[]');

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
            decadeE: decadeEnd,
            selectYear: "",
            pointsEarned: 0,
            rounds: 1,
            visibleForm: false,
            timeStop: false,
            visibleButtons: true,
            playerData: []

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
                if (this.count < 1) {
                    this.points = this.points - 2
                    this.count = 60
                    this.extractData();
                }
                else if (this.points < 2) {
                    this.generateDecade();
                    this.extractData();
                    this.points = 10;
                }
            }, 1000)


        },
        stopTimer() {
            clearInterval(this.timer)
            this.visibleForm = true;
            this.timeStop = true;
            this.visibleButtons = false;
        },
        nextPicture() {
            this.count = 0;
            if (this.timeStop) {
                this.startTimer();
                this.timeStop = false;
            }
            if (this.points === 2) {
                this.rounds++;
                this.points = 12;
                this.generateDecade();
            }
            if (this.rounds > 5) {
                this.stopTimer();
                localStorage.setItem('pointsEarned', this.pointsEarned);
                this.$router.push('/scoreboard');
            }
        },
        submitYear() {
            const correctYear = String(decadeStart);
            const yearInput = this.selectYear;
            this.visibleButtons = true;
            this.visibleForm = false;
            if (this.timeStop) {
                this.startTimer();
                this.timeStop = false;
            }
            if (yearInput === correctYear) {
                this.pointsEarned += this.points;
                this.rounds++;
                this.points = 10;
                this.count = 60;
                this.generateDecade();
                this.extractData();

            }
            else if (yearInput !== correctYear) {
                this.rounds++;
                this.points = 10;
                this.count = 60;
                this.generateDecade();
                this.extractData();

            }

            if (this.rounds > 5) {
                this.stopTimer();
                let playerName = prompt("Fyll i ditt namn: ");

                this.playerData.push({ playerName, pointsEarned: this.pointsEarned });
                localStorage.setItem('playerData', JSON.stringify(this.playerData));
                this.$router.push('/scoreboard');
            }

        }

    },
    template: `<div class="main-flex">
            <h1>Vilket årtioende söker vi?</h1>
            <h2>{{points}} POÄNG</h2>
            <h3>Timer: {{count}}</h3>
            <img :src="objektBild" alt="" class="fetchedImage">
            <p> Bildtext: {{objektDesc}}</p>
            <p>Fotograferad: {{objektDatum}}</p>
            <button class="stopButton" v-show="visibleButtons" @click="stopTimer">NÖDBROMS</button>
            <button class="nextButton" v-show="visibleButtons" @click="nextPicture">NÄSTA</button>
            <form v-show="visibleForm">
            <input type="text" class="date" v-model="selectYear">
            <input type="submit" class="submitButton" @click="submitYear" value="GISSA ÅR" />
            </form>
            <h3> DU HAR {{pointsEarned}} POÄNG - RUNDA: {{rounds}}/5</h3>
            </div>`
}

// skapa router
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/', component: homePage },
        { path: '/playerSelection', component: playerSelection },
        { path: '/scoreboard', component: scoreboard },
        { path: '/gameRules', component: gameRules },
        { path: '/onePlayerGame', component: onePlayerGame },
        { path: '/difficultySelection', component: difficultySelection }
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