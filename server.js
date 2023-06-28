import express from 'express'
import cors from 'cors'
import { createReadStream } from 'fs'
import csvtojson from 'csvtojson'
import http from 'http'


import { Readable, Transform } from 'stream'
import { WritableStream, TransformStream} from 'node:stream/web'

const app = express()
app.use(cors())

const pathFile = "./utils/fh-cars.csv"

function handler(request, response){

    const headers = {
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": '*',
    }

    if (request.method === "OPTINONS") {
        response.writeHead(204, headers)
        response.end()

        return
    }
    
    request.once("clode", _=> console.log("Conection close"))

    Readable.toWeb(createReadStream(pathFile))
    .pipeThrough(Transform.toWeb(csvtojson()))
    .pipeThrough(new TransformStream({
        transform(chunk, controller) {
            // aqui nós trasnformamos o NDjson para string para depois formatarmos ele
            // usando o JSON.Parse() que é o formato de json usado na web
            const data = JSON.parse(Buffer.from(chunk).toString())
            // quebra de linha pois é um NDJson
            const carData = {
                image: data.Car_Image,
                model: data.Name_and_model,
                class: data.stock_specs,
                lvl: data.Stock_Rating
            }

            console.log(carData);
            controller.enqueue(JSON.stringify(carData).concat('\n'))
        }
    }))
    .pipeTo(new WritableStream({
        async write(chunk) {
            // await setTimeout(200)

            response.write(chunk)
        },
        close() {
            response.end()
        }
    }))

    response.writeHead(200, headers)
}


http.createServer(handler).listen(3333)
.on('listening', () => console.log('Server running 3333'))