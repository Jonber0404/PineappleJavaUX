    template: `<router-link to="/"><button class='backtomenu'> </button></router-link>
                <div class="scoreboard"><br><br>
                    <h1>SCOREBOARD</h1>
                    <div class="scoreboard_row">
                        <div class="scoreboard_header_cell">Datum</div>
                        <div class="scoreboard_header_cell">Nivå</div>
                        <div class="scoreboard_header_cell">Poäng</div>
                        <div class="scoreboard_header_cell">Årtal</div>
                        <div class="scoreboard_header_cell"></div>
                    </div>
                    <div v-for="(player, i) in playerInfo" :key="i" class="scoreboard_row">
                        <div class="scoreboard_cell"> {{player.currentDate}}</div>
                        <div class="scoreboard_cell">{{player.difficulty}}</div>
                        <div class="scoreboard_cell">{{player.pointsEarned}}</div>
                        <div class="scoreboard_cell">{{player.correctYear}}</div>
                        <div class="scoreboard_cell" @click="toMuseum(player)">&bull;&bull;&bull;</div> 
                    </div>
                </div>`

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
        }
    },
    template: `<div class="scoreboard">
                    <nav class="scoreboardNavbar">
                        <ul>
                            <li><router-link to="/"><button class='scoreboardnavbutton'>Huvudmeny</button></router-link></li>
                            <li>Ribbon</li>
                            <li>Home</li>
                        </ul>
                    </nav>
                    <div class="scoreboardHeader">
                        <h2>SCOREBOARD</h2>
                    </div>
                    <div class="scoreboardTableContainer">
                        <div class="scoreboardHeadRow">
                            <p class="p-cont">Nivå</p>
                            <p class="p-cont">Poäng</p>
                            <p class="p-cont">Årtal</p>
                            <p class="p-cont"></p>
                        </div>
                        <div class="scoreboardInfoRow">
                            <div v-for="(player, i) in playerInfo" :key="i">
                                <p class="p-cont">{{player.getDifficulty}}</p>
                                <p class="p-cont">{{player.pointsEarned}}</p>
                                <p class="p-cont">{{player.playerName}}</p>
                            </div>
                        </div>
                    </div>
                </div>`
}

const scoreboardEasy = {
    name: "scoreboardEasy",
    data() {
        return {
            playerInfo: []
        }
    },
    created() {
        let playerData = JSON.parse(localStorage.getItem('playerData')) || [];
        this.playerInfo = playerData.filter(player => player.difficulty === 1);
        this.sortedArrays();
    },
    methods: {
        sortedArrays() {
            this.playerInfo.sort((a, b) => b.pointsEarned - a.pointsEarned)
            // This bit limits it to the top 20 players for easy mode.
            this.playerInfo = this.playerInfo.slice(0,20);
        }
    },
    template: `<div>
                    <div class="playerScoreSelector">
                        <router-link to="/"><button class='scoreboardnavbutton'>Huvudmeny</button></router-link>
                        <router-link to="/scoreboardEasy"><button class='scoreboardnavdifbutton'>Easy Mode</button></router-link>
                        <router-link to="/scoreboardMedium"><button class='scoreboardnavdifbutton'>Normal Mode</button></router-link>
                        <router-link to="/scoreboardHard"><button class='scoreboardnavdifbutton'>Hard Mode</button></router-link>
                    </div>
                    <div class="playerScoreViewer">
                        <p v-for="(player, i) in playerInfo" :key="i">Namn: {{player.playerName}} - Poäng: {{player.pointsEarned}} </p>
                    </div>
                    <p v-for="(player, i) in playerInfo" :key="i">Namn: {{player.playerName}} - Poäng: {{player.pointsEarned}} </p>
                </div>`

}