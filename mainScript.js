let decadeEnd, decadeStart, currentRoundPictures

// Main meny
const homePage = {
    name: "homePage",
    template: `<div class="homePageContainer">
                    <router-link to="/playerSelection"><button class='playbutton startmenubutton'>Spela</button></router-link>
                    <div class="homePageContainer2">
                        <router-link to="/scoreboard"><button class='scoreboardbutton startmenubutton'>Scoreboard</button></router-link>
                        <router-link to="/gameRules"><button class='gamerulesbutton startmenubutton'>Spelregler</button></router-link>
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
                <div class="mobile-nav">
                    <router-link to="/"><button class='backarrow topicon'> </button></router-link>
                    <router-link to="/scoreboard"><button class='scoreboardicon topicon'> </button></router-link>
                    <router-link to="/"><button class='backtomenu topicon'> </button></router-link>
                </div>
                <h1>ANTAL SPELARE</h1>
                <div class="player-selection">
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
            const countdownTime = (n === 'SVÅR') ? 30 : 60;
            localStorage.setItem("difficulty", n);
            localStorage.setItem("countdownTime", countdownTime);
            this.$router.push('/countDown');
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
        },
        goBack() {
            this.$router.go(-1)
        }
    },
    template: `
    <div class="main-flex">

    
        <div v-if="!namesRegistered">
            <div v-if="$root.numPlayers === 1">
                <div class="mobile-nav">
                    <router-link to="/playerSelection"><button class='backarrow topicon'> </button></router-link>
                    <router-link to="/scoreboard"><button class='scoreboardicon topicon'> </button></router-link>
                    <router-link to="/"><button class='backtomenu topicon'> </button></router-link>
                </div>
                <h1>ANGE DINA INITIALER</h1>
                <input type="text" v-model="playerOneName">
                <button @click="storeName">SPARA</button>
            </div>
            <div v-else-if="$root.numPlayers === 2">
                <div class="mobile-nav">
                    <button @click="goBack()" class='backarrow topicon'> </button>
                    <router-link to="/scoreboard"><button class='scoreboardicon topicon'> </button></router-link>
                    <router-link to="/"><button class='backtomenu topicon'> </button></router-link>
                </div>
                    <h1>ANGE ERA NAMN</h1>
                    <div class="diff-select-all-player-box">
                    <div class="diff-select-player-box">
                        <p> Spelare 1: </p>
                        <img src="assets/redtrain.svg" class="same-size-image">
                        <input type="text" v-model="playerOneName">
                    </div>
                    <div class="diff-select-player-box">
                        <p> Spelare 2: </p>
                        <img src="assets/bluetrain.svg" class="same-size-image">
                        <input type="text" v-model="playerTwoName">
                    </div>
                    </div>
                    <br>
                    <button class="submitButton" @click="storeNames">SPARA</button>
            </div>
        </div>


        <div v-else class="difficulty-selection">
            <div class="mobile-nav">
                <button @click="goBack()" class='backarrow topicon'> </button>
                <router-link to="/scoreboard"><button class='scoreboardicon topicon'> </button></router-link>
                <router-link to="/"><button class='backtomenu topicon'> </button></router-link>
            </div>
            <h1 class='choosedifficultytext'>VÄLJ NIVÅ</h1>

                <button class='easy startmenubutton' @click="setDifficulty('ENKEL')">ENKEL</button>
            
                <div class='difficultytext easytext'>Längre tid för att svara</div>
            
                <button class='hard startmenubutton' @click="setDifficulty('SVÅR')">SVÅR</button>
            
                <div class='difficultytext hardtext'>Kortare tid för att svara</div>
        </div>
    </div>`
}

const countDown = {
    name: "countDown",
    data() {
        return {
            counter: 3
        };
    },
    mounted() {
        this.startCountdown();
    },
    methods: {
        startCountdown() {
            const countdownInterval = setInterval(() => {
                if (this.counter > 1) {
                    this.counter--;
                } else {
                    clearInterval(countdownInterval);
                    this.counter = "Nu kör vi!";
                    setTimeout(this.navigateToGame, 2000);
                }
            }, 1000);
        },
        navigateToGame() {
            if (this.$root.numPlayers === 1) {
                this.$router.push('/onePlayerGame');
            } else if (this.$root.numPlayers === 2) {
                this.$router.push('/twoPlayerGame');
            }
        }
    },
    template: `<div class='countdowntext'>{{ counter }}</div>`
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
    template: `<router-link to="/"><button class='backtomenu' class='topicon'> </button></router-link>
                <div class="scoreboard"><br><br>
                    <div class='mobile-nav'>

                    </div>
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
            this.$router.push("/")
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
                <router-link to="/"><button class='backtomenu topicon'> </button></router-link><br><br>
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
            count: localStorage.getItem("countdownTime"),
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
            mainDiv: true,
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
            console.log(this.count);
            this.timer = setInterval(() => {
                this.count--;
                console.log(this.count);
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

                if (this.guessTime === 0) {
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
            this.count = localStorage.getItem("countdownTime")
            this.points = this.points - 2
            this.mainDiv = true
            if (this.points === 0) {
                this.gameOver = true
                this.mainDiv = false
                return
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
            clearInterval(this.timer)
            clearInterval(this.guessTimer)
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
                <p v-if="points === 0">Tyvärr, rätt år var {{ objektDatum.substring(0,3) + "0"}}</p>
                <p v-if="points !== 0">Du klarade av att resa tillbaka till {{ selectYear }}</p>
                <img v-if="points === 0" src="assets/mingcute_sad-line.svg" class="sad-symbol">
                <img v-if="points !== 0" src="assets/oui_cheer.svg" class="cheer-symbol">
                <button class="submitButton" @click="toHome">HUVUDMENY</button>
                <button class="submitButton beegSubmitButton" @click="toMuseum">MER INFO OM BILDERNA</button>
             </div>
             
             <div v-show="mainDiv" class="main-flex">
                <img src="assets/timer-symbol.svg" class="timer-symbol">
                <img src="assets/mingcute_exit-fill.svg" class="exit-symbol" @click="toHome">
                <p class="timer-num" v-show="mainDiv">{{count}}</p>
                <h2 class="desktop-h2-game1-modifier">{{points}} POÄNG</h2>
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

const twoPlayerGame = {
    name: "twoPlayerGame",
    mounted() {
        console.log(this.points)
        this.generateDecade();
        this.startTimer();
        this.extractData();
        this.playerOneName = localStorage.getItem('playerOneName');
        this.playerTwoName = localStorage.getItem('playerTwoName');
    },
    data() {
        return {
            points: 10,
            count: localStorage.getItem("countdownTime"),
            guessTime: 10,
            objekt: {},
            objektBild: "",
            objektDatum: "",
            objektDesc: "",
            objektUrl: "",
            timer: null,
            guessTimer: null,
            decadeS: decadeStart,
            decadeE: decadeEnd,
            selectYear: "",
            playerOnePoints: 0,
            playerTwoPoints: 0,
            playerOneName: "",
            playerTwoName: "",
            rounds: 1,
            visibleForm: false,
            timeStop: false,
            visibleButton1: true,
            visibleButton2: true,
            visibleNextButton: true,
            playerData: [],
            playerOneCorrect: false,
            playerTwoCorrect: false,
            showMain: true,
            roundOver: false,
            p1TimeStop: false,
            p2TimeStop: false,
            lookAway: false,
            p1TimeUp: false,
            p2TimeUp: false,
            p1WrongGuess: false,
            p2WrongGuess: false,
            wrongAnswerView: false,
            correctGuessView: false,
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
                this.visibleNextButton;
                clearInterval(this.guessTimer);
                this.guessTime = 10;
                if (this.count < 1) {
                    this.count = localStorage.getItem("countdownTime")
                    this.nextPicture();
                    if (this.points === 2) {
                        this.points = 10;
                        this.startNewRound();
                    }
                    if (this.rounds > 3) {
                        this.gameIsOver();
                    }
                }

            }, 1000)
        },
        stopTimer(n) {
            clearInterval(this.timer)
            this.visibleNextButton = false;
            this.visibleForm = true;
            this.timeStop = true;
            this.lookAway = true;
            this.guessTimerStart();
            if (n === 1) {
                this.visibleButton2 = false;
                this.p1TimeStop = true;

            }
            else if (n === 2) {
                this.visibleButton1 = false;
                this.p2TimeStop = true;

            }
        },
        guessTimerStart() {
            if (this.rounds > 3) {
                this.gameIsOver();
            }
            this.guessTimer = setInterval(() => {
                this.guessTime--;
                console.log(this.p1TimeStop + " p1")
                console.log(this.p2TimeStop + " p2 ")
                if ((this.points === 2 && this.guessTime < 1) && (this.p1TimeStop || this.p2TimeStop)) {
                    this.startNewRound();
                }
                else 
                if (this.guessTime < 1) {
              
                        this.visibleNextButton = true;
                        this.nextPicture();
                        this.count = localStorage.getItem("countdownTime");
                        this.lookAway = false;
                        this.guessTime = 10;
                        clearInterval(this.guessTimer);
                        this.timeStop = false;
                        this.visibleForm = false;
                        this.startTimer();
                        if (this.p1TimeStop) {
                            this.visibleButton2 = true;
                            this.visibleButton1 = false;
                            this.p1TimeUp = true;
                            this.p1TimeStop = false;
    
                        } if (this.p2TimeStop) {
                            this.p2TimeUp = true;
                            this.visibleButton1 = true;
                            this.visibleButton2 = false;
                            this.p2TimeStop = false;
                        }
                }
                if (this.p1TimeUp && this.p2TimeUp) {
                    if (this.rounds === 3 ) {
                        this.gameIsOver();
                    }
                    else{
                        this.startNewRound();
                        this.visibleNextButton = true;
                        this.visibleForm = false;
                        this.visibleButton1 = true;
                        this.visibleButton2 = true;
                        this.p1TimeUp = false;
                        this.p2TimeUp = false;
                        this.p1TimeStop = false;
                        this.p2TimeStop = false;
    
                    }
                    
                }
                else if ((this.p1TimeUp && this.p2WrongGuess) || (this.p2TimeUp && this.p1WrongGuess) || (this.p1TimeUp && this.playerTwoCorrect)
                    || (this.p2TimeUp && this.playerOneCorrect)) {
                        if (this.rounds === 3) {
                            this.gameIsOver();
                        }
                   else{
                    this.startNewRound();
                    this.visibleNextButton = true;
                    this.visibleForm = false;
                    this.visibleButton1 = true;
                    this.visibleButton2 = true;
                    this.p1TimeUp = false;
                    this.p2TimeUp = false;
                    this.p1TimeStop = false;
                    this.p2TimeStop = false;      
                }
                }


            }, 1000)
        },


        nextPicture() {
            console.log(this.points)
            console.log(this.rounds)
        
            if (this.points > 2) {
                this.points -= 2;
            }

            if (this.points < 4) {
                this.visibleNextButton = false;
            }
            else if (this.points < 2) {
                this.startNewRound();
            }
           
            this.wrongAnswerView = false;
            this.showMain = true;
            this.correctGuessView = false;
            this.extractData();
            if ((this.playerOneCorrect && this.playerTwoCorrect) || (this.p1WrongGuess && this.p2WrongGuess) ||
                (this.p1WrongGuess && this.playerTwoCorrect) || (this.p2WrongGuess && this.playerOneCorrect)) {
                this.startNewRound();
                if (this.rounds > 3) {
                    this.gameIsOver();
                }
            }
            
            this.count = localStorage.getItem("countdownTime")

        },

        submitYear() {
            console.log(decadeStart)
            const correctYear = String(decadeStart);
            const yearInput = this.selectYear;
            this.visibleNextButton = true;
            this.visibleForm = false;
            this.selectYear = "";
            this.lookAway = false;
            clearInterval(this.guessTimer);
            clearInterval(this.timer)


            if (this.timeStop) {
                this.startTimer();
                this.timeStop = false;
            }
            if (yearInput !== correctYear) {
              
                this.wrongAnswerView = true;
                this.showMain = false;
                this.count = localStorage.getItem("countdownTime");
                if (this.p1TimeStop) {
                    this.visibleButton1 = false;
                    this.visibleButton2 = true;
                    this.p1WrongGuess = true;
                    this.p1TimeStop = false;
                }
                else if (this.p2TimeStop) {
                    this.visibleButton2 = false;
                    this.visibleButton1 = true;
                    this.p2WrongGuess = true;
                    this.p2TimeStop = false;
                }
            }
            if (yearInput === correctYear) {
                this.handleCorrectGuess();
            }
            if (this.p1WrongGuess || this.p2WrongGuess) {
                this.visibleNextButton = true;
            }

            if (this.playerOneCorrect) {
                this.visibleButton1 = false;
            }
            else if (this.playerTwoCorrect) {
                this.visibleButton2 = false;
            }
            if (this.rounds > 3) {
                this.gameIsOver();
            }

        },
        startNewRound() {
            this.rounds++;
            this.points = 10;
            this.visibleButton1 = true;
            this.visibleButton2 = true;
            this.playerOneCorrect = false;
            this.playerTwoCorrect = false;
            this.p1WrongGuess = false;
            this.p2WrongGuess = false;
            this.p1TimeStop = false;
            this.p2TimeStop = false;
            this.p1TimeUp = false;
            this.p2TimeUp = false;
            this.wrongAnswerView = false;
            this.correctGuessView = false;
            this.visibleNextButton = true;
            this.showMain = true;
            this.generateDecade();
            this.extractData();


        },
        gameIsOver() {
            this.rounds = 3;
            this.visibleForm = false;
            this.visibleButton1 = false;
            this.visibleButton2 = false;
            this.visibleNextButton = false;
            this.showMain = false;
            this.roundOver = true;
            this.lookAway = false;
            clearInterval(this.timer)
            clearInterval(this.guessTimer);


        },
        handleCorrectGuess() {      
            this.correctGuessView = true;
            
            this.showMain = false;
            if (this.visibleButton1 && !this.visibleButton2) {
                this.playerOnePoints += this.points;
                this.visibleButton2 = true;
                this.playerOneCorrect = true;
                this.visibleButton1 = false;
                this.p1TimeStop = false;


            }
            else if (this.visibleButton2 && !this.visibleButton1) {
                this.playerTwoPoints += this.points;
                this.visibleButton1 = true;
                this.playerTwoCorrect = true;
                this.visibleButton2 = false;
                this.p2TimeStop = false;
            }

            this.count = localStorage.getItem("countdownTime");
        }


    },
    template: ` <button class="nextButton" v-show="visibleNextButton" @click="nextPicture">SKIPPA BILD</button>
                <div class="main-flex">

                <div v-show="correctGuessView" class="game-over main-flex">
                <router-link to="/"><img src="assets/mingcute_exit-fill.svg" class="exit-symbol"></router-link>
               
                <h1>BRA JOBBAT</h1>
                <p v-if="playerOneCorrect"> {{playerOneName}} </p>
                <p v-else-if="playerTwoCorrect"> {{playerTwoName}} </p> 
                <p v-if="points !== 0">Du klarade av att resa tillbaka till i tiden</p>
                <img src="assets/oui_cheer.svg" class="cheer-symbol">
                <button v-if="playerOneCorrect" class="submitButton" @click="nextPicture">FORTSÄTT {{playerTwoName}}</button>
                <button v-else-if="playerTwoCorrect" class="submitButton" @click="nextPicture">FORTSÄTT {{playerOneName}}</button>                           
             </div>
         <!--    <div v-show="endOfRound"> 
             <h1> {{rounds/3}} </h1>
             <p> {{playerOneName}} - {{playerOnePoints}} </p>
             <p> {{playerTwoName}} - {{playerTwoPoints}} </p>
             <button class="submitButton" @click="nextPicture">FORTSÄTT SPELA </button>     
             </div> -->

                <div v-if="p1WrongGuess" v-show="wrongAnswerView" class="wrong-answer main-flex">
                <router-link to="/"><img src="assets/mingcute_exit-fill.svg" class="exit-symbol"></router-link>
                <h1>HOPPSAN</h1>
                <p>Det var inte riktigt rätt, {{playerOneName}}</p>
                <img src="assets/mingcute_sad-line.svg" class="sad-symbol">
                <button class="submitButton" @click="nextPicture">FORTSÄTT {{playerTwoName}}</button>
            </div>
            <div v-else-if="p2WrongGuess" v-show="wrongAnswerView" class="wrong-answer main-flex">
            <router-link to="/"><img src="assets/mingcute_exit-fill.svg" class="exit-symbol"></router-link>
            <h1>HOPPSAN</h1>
            <p>Det var inte riktigt rätt, {{playerTwoName}}</p>
            <img src="assets/mingcute_sad-line.svg" class="sad-symbol">
            <button class="submitButton" @click="nextPicture">FORTSÄTT {{playerOneName}}</button>
        </div>
       <div v-if="p2WrongGuess && p1WrongGuess" v-show="wrongAnswerView" class="wrong-answer main-flex">
        <router-link to="/"><img src="assets/mingcute_exit-fill.svg" class="exit-symbol"></router-link>
        <h1>HOPPSAN</h1>
        <p>Ingen fick rätt.. vi tågar vidare..</p>
        <p>Rätt år var {{  objektDatum.substring(0,3) + "0" }}</p>
        <img src="assets/mingcute_sad-line.svg" class="sad-symbol">
        <button class="submitButton" @click="nextPicture">FORTSÄTT {{playerOneName}} och {{playerTwoName}}</button>
    </div> 
            <div v-show="showMain"> 
           
            <img src="assets/timer-symbol.svg" class="timer-symbol">
            <router-link to="/"><img src="assets/mingcute_exit-fill.svg" class="exit-symbol"></router-link>
            <p class="timer-num" v-show="showMain">{{count}}</p>
            <h2 class="desktop-h2-game1-modifier">{{points}} POÄNG</h2>
            <p>Vilket årtionde söker vi?</p>
            <h3 v-if="timeStop">Tid att gissa: {{guessTime}} </h3>
            <div class="museum-big-image-div">
                <img :src="objektBild" class="museum-big-image">
            </div>
           
            
            <img src="assets/Svara-knapp-red.svg" @click="stopTimer(1)" class="stopButton" v-show="visibleButton1">
            <img src="assets/Svara-knapp-blue.svg" @click="stopTimer(2)" class="stopButton" v-show="visibleButton2">
            
            <div v-if="p1TimeStop || p2TimeStop" v-show="visibleForm" :class="{ 'answer-view main-flex': p1TimeStop, 'answer-view-playerTwo main-flex': p2TimeStop }">
            <img src="assets/timer-symbol.svg" class="timer-symbol">
            <router-link to="/"><img src="assets/mingcute_exit-fill.svg" class="exit-symbol"></router-link>
            <p class="timer-num">{{guessTime}}</p>
            <h1 v-if="p1TimeStop"> {{playerOneName}} </h1>
            <h1 v-else-if="p2TimeStop"> {{playerTwoName}} </h1>
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
            <div v-show="lookAway">
            <h2 v-if="visibleButton1"> {{playerTwoName}} KOLLA BORT! </h2>
            <h2 v-else-if="visibleButton2"> {{playerOneName}} KOLLA BORT! </h2>
            </div>
  
        </div>
  
     
            </div>
            <h3> {{playerOneName}}: {{playerOnePoints}} POÄNG <br>{{playerTwoName}}: {{playerTwoPoints}} POÄNG <br> RUNDA: {{rounds}}/3</h3> 
            <div v-show="roundOver">    
            <h2 v-if="playerOnePoints > playerTwoPoints"> GRATTIS {{playerOneName}} </h2>
            <h2 v-else-if="playerTwoPoints > playerOnePoints">GRATTIS {{playerTwoName}} </h2>
            <h2 v-else> OAVGJORT! </h2>
            <router-link to="/"><button class='playbutton startmenubutton'>Huvudmeny</button></router-link>
            </div>    
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
        { path: '/twoPlayerGame', component: twoPlayerGame },
        { path: '/difficultySelection', component: difficultySelection },
        { path: '/countDown', component: countDown },
        { path: '/museum', component: museum }
    ]
});

router.beforeEach((to, from, next) => {
    if (to.path === '/difficultySelection') {
        document.body.classList.add('difficulty-selection');
        document.body.classList.remove('count-down');
    }
    else if (to.path === '/countDown') {
        document.body.classList.add('count-down');
        document.body.classList.remove('difficulty-selection');
    }
    else if (to.path === '/') {
        document.body.classList.add('main-menu');
        document.body.classList.remove('difficulty-selection');
        document.body.classList.remove('count-down');
    } else {
        document.body.classList.remove('difficulty-selection');
        document.body.classList.remove('count-down');
    }
    next();
});


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