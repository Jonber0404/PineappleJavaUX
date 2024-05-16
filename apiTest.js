const app = {
    data() {
        return {
            objekt: {},
            objektBild: "",
            objektDatum: "",
            objektDesc: "",
            objektUrl: ""
        }
    },
    methods: {
        async getObjekt() {

            let decadeStart;
            // Att göra: lägg till totalAmount från totalHits när vi begränsat resultaten lite mer
            switch(Math.floor(Math.random() * 10)) {
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
            const decadeEnd = decadeStart + 9;

            // Man kan ersätta totalAmount med elementet "totalHits" från K-samsök
            const totalAmount = 665;

            let randomObjekt = Math.floor((Math.random() * totalAmount) + 1)
            try {
                const response = await fetch(`https://kulturarvsdata.se/ksamsok/api?` +
                    `method=search&hitsPerPage=1&startRecord=${randomObjekt}&query=create_fromTime>=${decadeStart}` +
                    `+AND+create_fromTime<=${decadeEnd}+AND+itemType=foto+AND+thumbnailExists=j+AND+timeInfoExists=j` +
                    `+AND+contextLabel=Fotografering+AND+(item=fordon+OR+item=person)`, {
                    headers: {'Accept': 'application/json'}
                });
                this.objekt = await response.json();

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
        }
    },
    mounted() {
        this.getObjekt()
    }
}
Vue.createApp(app).mount("#app")