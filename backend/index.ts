import fastify from 'fastify';

const server = fastify({
    logger: true
});

server.get("/", async (_, res) => {
    res.send({
        "message" : "Hello world!"
    });
});

// TODO: Register routes

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

