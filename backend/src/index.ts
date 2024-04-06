import fastify from 'fastify';
import autoload from '@fastify/autoload';
import path from 'path';
import cors from "@fastify/cors";

const server = fastify({
    logger: true
});

server.register(cors);

server.get("/", async (_, res) => {
    res.send({
        "message" : "Hello world!"
    });
});

// TODO: Register routes
server.register(autoload, {
    dir : path.join(__dirname, "plugins")
})

server.register(autoload, {
    dir : path.join(__dirname, "routes"),
    routeParams: true,
    autoHooks: true
})

server.listen({
    port: 4090,
},

    (err, address) => {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
        server.log.info(`Listening on: ${address}`)
    }
)

