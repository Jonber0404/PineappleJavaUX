let decadeEnd, decadeStart

// Main meny
const homePage = {
    name: "homePage",
    template: `<router-link to="/playerSelection"><button class='playbutton startmenubutton'>Spela</button></router-link>
                <router-link to="/scoreboard"><button class='scoreboardbutton startmenubutton'>Scoreboard</button></router-link>
                <router-link to="/gameRules"><div class='gamerulesbutton startmenubutton'>Spelregler</div></router-link>`
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
                    <router-link to="/"><button class='backtomenu'> </button></router-link>
                    <router-link to="/difficultySelection" @click="setPlayers(1)"><button class='oneplayer startmenubutton'>1 SPELARE</button></router-link>
                    <router-link to="/difficultySelection" @click="setPlayers(2)"><button class='twoplayer startmenubutton'>2 SPELARE</button></router-link>
                </div>
            </div>`
}

//Välj svårighetsgrad, som ska vara efter man valt antalet spelare
const difficultySelection = {
    name: "difficultySelection",
    data() {
        return {
            difficulty: ""
        }
    }, methods: {
        setDifficulty(n) {
            this.difficulty = n;
            localStorage.setItem("difficulty", this.difficulty);
        }
    },
    template: `<div class="main-flex">
    <h1>VÄLJ SVÅRIGHETSGRAD</h1>
        <div class="selection">


            <button class="easy" @click="setDifficulty('ENKEL')">LÅG</button>
            <button class="medium" @click="setDifficulty('MELLAN')">MEDIUM</button>
            <button class="hard" @click="setDifficulty('SVÅR')">HÖG</button>

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
                 this.playerInfo.sort((a, b) => {
                    if(b.pointsEarned - a.pointsEarned === 0){
                        return b.currentDate - a.currentDate;
                    }
                    else{
                      return b.pointsEarned - a.pointsEarned
                    }
                 })
                 
                
          
        }
    },
    template: `<p v-for="(player, i) in playerInfo" :key="i">Namn: {{player.playerName}} - Poäng: {{player.pointsEarned}}
   - DATUM: {{ player.currentDate}} - SVÅRIGHETSGRAD: {{player.difficulty}} </p>
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
        this.difficulty = localStorage.getItem("difficulty");

    },
    mounted() {
        this.startTimer();
        this.playerName = prompt("Vad heter du?");
    },
    data() {
        return {
            points: 10,
            difficulty: 0,
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
            playerName: "",
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
                this.timeStop = false;
                if (this.count < 1) {
                    this.points = this.points - 2
                    this.count = 60
                    this.extractData();
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
            }
        },
        submitYear() {
            const correctYear = String(decadeStart);
            const yearInput = this.selectYear;
            this.visibleButtons = true;
            this.visibleForm = false;
        
            if (yearInput === correctYear) {
                this.pointsEarned += this.points;
                let playerName = this.playerName;
                const currentDate = new Date().toLocaleDateString();
                let difficulty = this.difficulty;
          
                this.playerData.push({ playerName, pointsEarned: this.pointsEarned, currentDate, difficulty });
                localStorage.setItem('playerData', JSON.stringify(this.playerData));
                this.$router.push('/scoreboard');

            }
            else if (yearInput !== correctYear) {
                this.points = this.points - 2;
                this.count = 60;
                this.startTimer();
                this.extractData();
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
            <h3> DU HAR {{pointsEarned}} POÄNG</h3>
            </div>`
}

/* const twoPlayerGame = {
    name: "twoPlayerGame",
    beforeCreate() {
        this.generateDecade()
    },
    created() {
        this.extractData();

    },
    mounted() {
        this.startTimer();
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
            playerName: "",
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

            if (this.rounds > 3) {
                this.stopTimer();
                
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
                this.points = this.points - 2;
                this.count = 60;
                this.extractData();
            }
            if (this.rounds > 3) {
                this.stopTimer();
                let playerName = this.playerName;
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
            <h3> DU HAR {{pointsEarned}} POÄNG - RUNDA: {{rounds}}/3</h3>
            </div>`
} */

// skapa router
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: [
        { path: '/', component: homePage },
        { path: '/playerSelection', component: playerSelection },
        { path: '/scoreboard', component: scoreboard },
        { path: '/gameRules', component: gameRules },
        { path: '/onePlayerGame', component: onePlayerGame },
    //    { path: '/twoPlayerGame', component: twoPlayerGame },
        { path: '/difficultySelection', component: difficultySelection }
    ]
})


const app = {}
const vueApp = Vue.createApp(app)

// Här nedanför kan man lägga globala metoder
vueApp.config.globalProperties.generateDecade = function () {
    decadeStart = (Math.floor(Math.random() * 10) * 10) + 1900
    decadeEnd = decadeStart + 9
}

vueApp.config.globalProperties.getObjectData = async function () {
    let randomObjekt = Math.floor((Math.random() * 665) + 1)
    try {
        const response = await fetch(`https://kulturarvsdata.se/ksamsok/api?` +
            `method=search&hitsPerPage=1&startRecord=${randomObjekt}&query=create_fromTime>=${decadeStart}` +
            `+AND+create_fromTime<=${decadeEnd}+AND+itemType=foto+AND+thumbnailExists=j+AND+timeInfoExists=j` +
            `+AND+contextLabel=Fotografering+AND+(item=fordon+OR+item=person)`, {
            headers: { 'Accept': 'application/json' }
        });
        return await response.json()
    } catch (error) {
        console.error('Error fetching data:', error)
    }
}

vueApp.use(router)
vueApp.mount("#app")