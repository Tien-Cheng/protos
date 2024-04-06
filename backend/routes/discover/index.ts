import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const main : FastifyPluginAsyncTypebox = async (app, options): Promise<void> => {
    app.get("/", {},
    async (req, res) => {
       // TODO: autohook discover client

       // TODO: start scan with 10s second timeout? (or can this be SSE?)


       // Return list of devices along with connection settings
       return res.send({
            "message" : "TBC",
            "devices" : ["test"]
       }) 
    }
    )
}

export default main;