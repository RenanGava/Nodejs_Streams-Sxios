import axios from 'axios'

const url = "http://localhost:3333"

async function getDataStreamAPI() {
    const response = await axios({
        url,
        method: 'get',
        responseType: "stream"
    })

    return response.data
}



const stream = await getDataStreamAPI()

// assim nós utilizamos as nodejs streams no nodejs utilizando o axios.
stream
.on("data", data =>{
    console.log(JSON.parse(data.toString()));
})