const app = {
    data() {
        return {
            objekt: {},
            objektBild: "",
            objektDatum: ""
        }
    },
    methods: {
        getObjekt() {
            const searchText = "yxa"
            // Man kan ersätta totalAmount med elementet "totalHits" från K-samsök
            const totalAmount = 6407;

            let randomObjekt = Math.floor((Math.random() * totalAmount) + 1)
            fetch(`https://kulturarvsdata.se/ksamsok/api?method=search&hitsPerPage=1&startRecord=${randomObjekt}&query=text=${searchText}+AND+thumbnailExists=j+AND+timeInfoExists=j`,
                {headers: {'Accept': 'application/json'}})
                .then(resp => resp.json())
                .then(json => this.objekt = json)

            // fixa med async och await här
            this.objektBild = this.objekt.result.records[0].record['@graph'].find(obj => obj.thumbnailSource).thumbnailSource
            this.objektDatum = this.objekt.result.records[0].record['@graph'].find(obj => obj.fromTime).fromTime
        }
    },
    mounted() {
        this.getObjekt()
    }
}
Vue.createApp(app).mount("#app")