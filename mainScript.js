let decadeEnd, decadeStart, currentRoundPictures

// Main meny
const homePage = {
    name: "homePage",
    template: `<div class="container">
                    <router-link to="/playerSelection"><button class='playbutton startmenubutton'>Spela</button></router-link>
                    <div class="container2">
                        <router-link to="/scoreboard"><button class='scoreboardbutton startmenubutton'>Scoreboard</button></router-link>
                        <router-link to="/gameRules"><div class='gamerulesbutton startmenubutton'>Spelregler</div></router-link>
                    </div>
                </div>`
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

    template: `
            <div class="main-flex">
                <h1>ANTAL SPELARE</h1>
                <div class="player-selection">
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
            difficulty: "",
            playerOneName: "",
            playerTwoName: "",
            namesRegistered: false,
            initialsPlayerOne: "",
        }
    }, methods: {
        setDifficulty(n) {
            this.difficulty = n;
        },
        getDifficulty() {
            return this.difficulty;
        },
        getSelectedDifficulty(dif) {
            let difficultyLevel;
            switch (dif) {
                case 'easy':
                    difficultyLevel = 'easy';
                    break;
                case 'normal':
                    difficultyLevel = 'normal';
                    break;
                case 'hard':
                    difficultyLevel = 'hard';
                    break;
                default:
                    difficultyLevel = 'Unknown';
            }
            localStorage.setItem("difficulty", difficultyLevel);
            return difficultyLevel;
        },
        storeName() {
            this.namesRegistered = true;
            if (this.playerOneName.length > 3) {
                this.initialsPlayerOne = this.playerOneName.slice(0, 3);
            }
            else {
                this.initialsPlayerOne = this.playerOneName;
            }
            localStorage.setItem('playerOneName', this.initialsPlayerOne);
        },
        storeNames() {
            this.namesRegistered = true;
            localStorage.setItem('playerOneName', this.playerOneName);
            localStorage.setItem('playerTwoName', this.playerTwoName);
        }
    },
    template: `
    <div class="main-flex">
    
        <div v-if="!namesRegistered">
            <div v-if="$root.numPlayers === 1">
                    <h1>ANGE DINA INITIALER</h1>
                    <input type="text" v-model="playerOneName">
                    <button @click="storeName">SPARA</button>
            </div>
            <div v-else-if="$root.numPlayers === 2">
                    <h1>ANGE ERA NAMN</h1>
                    <input type="text" v-model="playerOneName">
                    <input type="text" v-model="playerTwoName">
                    <button @click="storeNames">SPARA</button>
            </div>
        </div>

        <div v-else class="difficulty-selection">
            <h1 class='choosedifficultytext'>VÄLJ NIVÅ</h1>
            <button class='easy startmenubutton' @click="setDifficulty('ENKEL')">ENKEL</button>
            <router-link :to="$root.numPlayers === 1 ? '/onePlayerGame' : '/twoPlayerGame'">
                <div class='difficultytext easytext'>Längre tid för att svara</div>
            </router-link>
            <button class='hard startmenubutton' @click="setDifficulty('SVÅR')">SVÅR</button>
            <router-link :to="$root.numPlayers === 1 ? '/onePlayerGame' : '/twoPlayerGame'">
                <div class='difficultytext hardtext'>Kortare tid för att svara</div>
            </router-link>
            <router-link :to="$root.numPlayers === 1 ? '/onePlayerGame' : '/twoPlayerGame'">
                <button class="startGameArrow">Starta Spelet</button>
            </router-link>
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
    mounted() {
        let playerData = localStorage.getItem('playerData');
        this.playerInfo = JSON.parse(playerData) || [];
        this.sortedArrays();

    },
    methods: {
        sortedArrays() {
            this.playerInfo.sort((a, b) => {
                if (b.pointsEarned - a.pointsEarned === 0) {
                    return b.currentDate - a.currentDate;
                }
                else {
                    return b.pointsEarned - a.pointsEarned
                }
            })
        },
        toMuseum(gameToShow) {
            currentRoundPictures = gameToShow.currentRoundPictures
            this.$router.push('/museum')
        },
        formatDate(dateStr) {
            var date = new Date(dateStr);

            var year = date.getFullYear().toString().substr(-2);
            var month = ("0" + (date.getMonth() + 1)).slice(-2);
            var day = ("0" + date.getDate()).slice(-2);

            return month + "/" + day;
        }
    },
    template: `<router-link to="/"><button class='backtomenu'> </button></router-link>
                <div class="scoreboard"><br><br>
                    <h1>SCOREBOARD</h1>
                    <div class="scoreboard_row">
<!--                        <div class="scoreboard_header_cell">Namn</div>-->
                        <div class="scoreboard_header_cell">Datum</div>
                        <div class="scoreboard_header_cell">Nivå</div>
                        <div class="scoreboard_header_cell">Poäng</div>
                        <div class="scoreboard_header_cell">Årtal</div>
                        <div class="scoreboard_header_cell"></div>
                    </div>
                    <div v-for="(player, i) in playerInfo" :key="i" class="scoreboard_row">
<!--                        <div class="scoreboard_cell"> {{player.playerName}}</div>-->
                        <div class="scoreboard_cell"> {{this.formatDate(player.currentDate)}}</div>
                        <div class="scoreboard_cell">{{player.difficulty}}</div>
                        <div class="scoreboard_cell">{{player.pointsEarned}}</div>
                        <div class="scoreboard_cell">{{player.correctYear}}</div>
                        <div class="scoreboard_cell" @click="toMuseum(player)">&bull;&bull;&bull;</div> 
                    </div>
                </div>`
}

const museum = {
    name: "museum",
    data() {
        return {
            images: [],
            selectedImage: {}
        }
    },
    mounted() {
        this.images = currentRoundPictures
        this.selectedImage = currentRoundPictures[0]
    },
    methods: {
        selectImage(image) {
            this.selectedImage = image;
        },
        goBack() {
            this.$router.go(-1)
        }
    },
    template: `<button class='backtomenu' @click="goBack"> </button>
                <div class="museum-image-container">
                    <br><br>
                    <h1>{{selectedImage.date}}</h1>
                    <div class="museum-big-image-div">
                        <img :src="selectedImage.imgUrl" class="museum-big-image">
                    </div>
                    <div class="museum-text-container">
                    <p>{{ selectedImage.description }}</p>
                    <a :href="selectedImage.infoUrl" target="_blank">Mer info</a>
                    </div>
                    <!-- Lista med små bilder -->
                    <div class="museum-small-images">
                        <img v-for="(image, i) in images" :src="image.imgUrl" @click="selectImage(image)"
                             class="museum-small-image">
                    </div>
                </div>`
}

// spelregler
const gameRules = {
    name: "gameRules",
    template: `<div class="game-rules">
                <router-link to="/"><button class='backtomenu'> </button></router-link><br><br>
                <h1>SPELREGLER</h1>
                <p>Spelet går ut på att gissa vilket årtal man befinner sig i.</p>
                <p>&bull; Varje spelrunda har 5 foton från samma årtionde.</p>
                <p>&bull; Spelaren gissar med ledtrådar från bilderna och får poäng beroende på vilken bild hen gissar rätt på.</p>
                <p>&bull; Poängen minskar ju fler bilder som visas i rundan.</p><br>
                <p>Om två spelare är med och en gissar rätt måste den vänta till nästa runda medan den andra fortsätter gissa. 
                Spelaren med flest poäng efter tre rundor vinner.</p>
                <p>För att gissa trycker man på handbromsen och väljer ett årtal.</p>
                <p>Om man gissar fel får man inte gissa igen förrän nästa bild visas.</p>
                <p>OBS! Viktigt att hålla svaret hemligt för motspelaren när ni är två.</p>
            </div>`
}

const onePlayerGame = {
    name: "onePlayerGame",
    mounted() {
        this.generateDecade()
        this.playerData = JSON.parse(localStorage.getItem('playerData') || '[]');
        this.difficulty = localStorage.getItem("difficulty");
        this.playerOneName = localStorage.getItem('playerOneName');
        currentRoundPictures = []
        this.loadNextImg();
        this.startTimer();
    },
    data() {
        return {
            points: 10,
            difficulty: 0,
            count: 60,
            guessTime: 10,
            objekt: {},
            objektBild: "",
            objektDatum: "",
            objektDesc: "",
            objektUrl: "",
            timer: null,
            guessTimer: null,
            selectYear: "",
            pointsEarned: 0,
            answerView: false,
            wrongAnswerView: false,
            timeStop: false,
            playerData: [],
            gameOver: false,
            mainDiv: true
        }
    },


    methods: {
        async loadNextImg() {
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
            currentRoundPictures.push({ imgUrl: this.objektBild, infoUrl: this.objektUrl, description: this.objektDesc, date: this.objektDatum })
        },
        startTimer() {
            this.timer = setInterval(() => {
                this.count--;
                this.timeStop = false;
                clearInterval(this.guessTimer)
                this.guessTime = 10
                if (this.count < 1) {
                    this.nextPicture()
                }
            }, 1000)

        },
        stopTimer() {
            this.mainDiv = false
            clearInterval(this.timer)
            this.answerView = true;
            this.timeStop = true;
            this.guessTimer = setInterval(() => {
                this.guessTime--;
                if(this.guessTime === 0) {
                    this.nextPicture()
                    if (this.points === 0) {
                        clearInterval(this.guessTimer)
                        clearInterval(this.timer)
                    }
                }
            }, 1000)
        },
        nextPicture() {
            this.answerView = false
            this.wrongAnswerView = false
            if (this.timeStop) {
                this.startTimer();
            }
            this.count = 60
            this.points = this.points - 2
            this.mainDiv = true
            if (this.points === 0) {
                this.gameOver = true
                this.mainDiv = false
            }
            this.loadNextImg();
        },
        submitYear() {
            const correctYear = String(decadeStart);
            const yearInput = this.selectYear;
            this.answerView = false;

            if (yearInput === correctYear) {
                this.pointsEarned += this.points;
                let playerName = this.playerOneName;
                const currentDate = new Date().toLocaleDateString();
                let difficulty = this.difficulty;
                this.playerData.push({
                    playerName, pointsEarned: this.pointsEarned, currentDate, difficulty,
                    correctYear, currentRoundPictures
                });

                localStorage.setItem('playerData', JSON.stringify(this.playerData));
                this.answerView = false
                this.gameOver = true
                clearInterval(this.timer)
                clearInterval(this.guessTimer)
            }
            else if (yearInput !== correctYear) {
                if (this.points !== 2) {
                    this.answerView = false
                    clearInterval(this.guessTimer)
                    this.wrongAnswerView = true
                } else {
                    this.nextPicture()
                    clearInterval(this.timer)
                    clearInterval(this.guessTimer)
                }
            }
        },
        toHome() {
            this.$router.push("/")
        },
        toMuseum() {
            this.$router.push("/museum")
        }

    },
    template: `<br><br>
             <div v-show="gameOver" class="game-over main-flex">
                <img src="assets/mingcute_exit-fill.svg" class="exit-symbol-light" @click="toHome">
                <h1 v-if="points === 0">HOPPSAN</h1>
                <h1 v-if="points !== 0">BRA JOBBAT</h1>
                <p v-if="points === 0">Tyvärr, rätt år var {{ objektDatum.substring(0,2) + "00"}}</p>
                <p v-if="points !== 0">Du klarade av att resa tillbaka till {{ selectYear }}</p>
                <img v-if="points === 0" src="assets/mingcute_sad-line.svg" class="sad-symbol">
                <img v-if="points !== 0" src="assets/oui_cheer.svg" class="cheer-symbol">
                <button class="submitButton" @click="toHome">HUVUDMENY</button>
                <button class="submitButton" @click="toMuseum">MER INFO OM BILDERNA</button>
             </div>
             
             <div v-show="mainDiv" class="main-flex">
                <img src="assets/timer-symbol.svg" class="timer-symbol">
                <img src="assets/mingcute_exit-fill.svg" class="exit-symbol" @click="toHome">
                <p class="timer-num" v-show="mainDiv">{{count}}</p>
                <h2>{{points}} POÄNG</h2>
                <p>Vilket årtionde söker vi?</p>
                <div class="museum-big-image-div">
                    <img :src="objektBild" class="museum-big-image">
                </div>
                <img src="assets/Svara-knapp-red.svg" @click="stopTimer" class="stopButton">
                <button v-if="points !== 2" class="nextButton" @click="nextPicture">SKIPPA BILD</button>
            </div>
            
            <div v-show="answerView" class="answer-view main-flex">
                <img src="assets/timer-symbol.svg" class="timer-symbol">
                <img src="assets/mingcute_exit-fill.svg" class="exit-symbol" @click="toHome">
                <p class="timer-num">{{guessTime}}</p>
                <p>Vilket årtionde söker vi?</p>
                <p>{{objektDatum}}</p>
                <select class="date" v-model="selectYear">
                <option value="1900">1900</option>
                <option value="1910">1910</option>
                <option value="1920">1920</option>
                <option value="1930">1930</option>
                <option value="1940">1940</option>
                <option value="1950">1950</option>
                <option value="1960">1960</option>
                <option value="1970">1970</option>
                <option value="1980">1980</option>
                <option value="1990">1990</option>
                </select>
                <input type="submit" class="submitButton" @click.prevent="submitYear" value="BEKRÄFTA" />
            </div>
            
            <div v-show="wrongAnswerView" class="wrong-answer main-flex">
                <img src="assets/mingcute_exit-fill.svg" class="exit-symbol-light" @click="toHome">
                <h1>HOPPSAN</h1>
                <p>Det var inte riktigt rätt</p>
                <img src="assets/mingcute_sad-line.svg" class="sad-symbol">
                <button class="submitButton" @click="nextPicture">FORTSÄTT SPELA</button>
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
        { path: '/difficultySelection', component: difficultySelection },
        { path: '/museum', component: museum }
    ]
})


const app = {}
const vueApp = Vue.createApp(app)

// Här nedanför kan man lägga globala metoder

let decadeUrn = []
vueApp.config.globalProperties.generateDecade = function () {
    if (decadeUrn.length === 0) {
        decadeUrn = [1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990]
    }
    let randomIdx = Math.floor(Math.random() * (decadeUrn.length - 1))
    decadeStart = decadeUrn[randomIdx]
    decadeUrn.splice(randomIdx, 1)
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