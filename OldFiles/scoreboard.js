import { points } from './oneplayergame.js';

export default {
    data() {
        return {
            scoreboard: [],
        };
    },
    created() {
        // Retrieve scoreboard data from localStorage when the component is created
        const savedScoreboard = localStorage.getItem('scoreboard');
        if (savedScoreboard){
            this.scoreboard = JSON.parse(savedScoreboard);
        }
    },
    methods: {
        addPlayerToScoreboard(player) {
            this.scoreboard.push(player);
            // Sort players by score
            this.scoreboard.sort((a,b) => a.score - b.score);
            // Keep only the top 10 players
            this.scoreboard.splice(10);
            localStorage.setItem('scoreboard', JSON.stringify(this.scoreboard));
        },
    },
};
