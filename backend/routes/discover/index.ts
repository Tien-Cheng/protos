import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const main : FastifyPluginAsyncTypebox = async (app, options): Promise<void> => {
    app.get("/", {},
    async (req, res) => {
       return res.send({
            "message" : "TBC",
            "devices" : ["test"]
       }) 
    }
    )
}

export default main;