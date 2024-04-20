const app = {
    data() {
        return {
            image: null,
            itemList: ""
        }
    },
    methods: {
        async fetchData() {
            try {
                const options = {
                    method: 'GET',
                    headers: {
                        'Accept': '	application/json',
                    },
                };

                const response = await fetch("https://kulturarvsdata.se/ksamsok/api?method=search&version=1.1&hitsPerPage=500&query=skor&thumbnailExists=\"j\"", options);
                if (!response.ok) {
                    throw new Error("Something went wrong!");
                }
                const data = await response.json();
                //  this.itemList = result;
              //  console.log(result)
                let img;
                let time;
                while(!img && !time){
                    let randomNumber = Math.floor(Math.random() * 500);
                    this.itemList = data.result.records;
                    const result = data.result.records[randomNumber].record['@graph'];
                    for (const x of result) {
                        if (x.thumbnailSource && x.fromTime) {
                            console.log("YIPPPIEEEE");
                            img = x.thumbnailSource;
                            time = x.fromTime;
                            this.image = img;
                            this.itemList = time;
                            console.log(x.fromTime);
                            
                        }
                        else{
                            console.log(x)
                        }
                    }
                    
              }
            console.log(this.itemList)

            } catch (error) {
                console.error("Error: ", error);
            }
        },

    },
    mounted() {

        //this.fetchData();
    }
};

Vue.createApp(app).mount("#app")