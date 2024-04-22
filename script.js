const app = {
    data() {
        return {
            objekt: {},
            objektBild: "",
            objektDatum: ""
        }
    },
    methods: {
        async getObjekt() {
            const decadeStart = 1980;
            const decadeEnd = decadeStart + 9;
            // Man kan ersätta totalAmount med elementet "totalHits" från K-samsök

            const totalAmount = 6407;

            let randomObjekt = Math.floor((Math.random() * totalAmount) + 1)
            try {
                this.objektDatum = "";

                const response = await fetch(`https://kulturarvsdata.se/ksamsok/api?method=search&hitsPerPage=1&startRecord=${randomObjekt}&query=create_fromTime>=${decadeStart}+AND+create_fromTime<=${decadeEnd}+AND+itemType=foto+AND+thumbnailExists=j+AND+timeInfoExists=j`, {
                    headers: {'Accept': 'application/json'}
                });
                const json = await response.json()
                this.objekt = json;

                const currentRecord = this.objekt.result.records[0].record['@graph']
                this.objektBild = currentRecord.find(obj => obj.lowresSource).lowresSource
                for (obj of currentRecord) {
                    if (Object.keys(obj).includes("contextLabel")) {
                        if (Object.values(obj.contextLabel).includes("Fotograferad")) {
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