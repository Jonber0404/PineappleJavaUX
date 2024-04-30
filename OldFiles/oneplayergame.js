let decadeStart, decadeEnd, totalAmount, points

const gameApp = {
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
            isVisible: false
        };
    },
    methods: {
        stopTimer() {
            clearInterval(this.timer)
            this.isVisible = true
        },
        generateDecade() {
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
        },
        async getData() {
            // Att göra: lägg till totalAmount från totalHits när vi begränsat resultaten lite mer
            // Man kan ersätta totalAmount med elementet "totalHits" från K-samsök
            totalAmount = 6407;

            let randomObjekt = Math.floor((Math.random() * totalAmount) + 1)
            try {
                const response = await fetch(`https://kulturarvsdata.se/ksamsok/api?` +
                    `method=search&hitsPerPage=1&startRecord=${randomObjekt}&query=create_fromTime>=${decadeStart}` +
                    `+AND+create_fromTime<=${decadeEnd}+AND+itemType=foto+AND+thumbnailExists=j+AND+timeInfoExists=j` +
                    `+AND+contextLabel=Fotografering`, {
                    headers: { 'Accept': 'application/json' }
                });
                this.objekt = await response.json()

                const currentRecord = this.objekt.result.records[0].record['@graph']

                // Hitta bild
                this.objektBild = currentRecord.find(obj => obj.lowresSource).lowresSource

                // Hitta beskrivning
                this.objektDesc = currentRecord.find(obj => obj.desc).desc

                // Hitta "mer info"-länk
                this.objektUrl = currentRecord.find(obj => obj.url).url

                // Hitta fotots datum
                for (obj of currentRecord) {
                    if (Object.keys(obj).includes("contextLabel")) {
                        if (obj.contextLabel.includes("Fotografering") && obj.contextType.includes("produce")) {
                            this.objektDatum = obj.fromTime
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching data:', error)
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
        }
    },
    mounted() {
        this.generateDecade()
        this.getData()
        this.startTimer()
    }

}
const vueApp = Vue.createApp(gameApp);

const stopButton = {
    name: "stopButton",
    template: `<button class="stopButton">NÖDBROMS</button>`
}
vueApp.component("stop-button", stopButton);

vueApp.mount('#gameApp')

// Vart kommer spelaren skriva ner sitt user name?
export { points };