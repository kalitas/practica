import fastify from 'fastify'


export let fastifyApp;



export function startWebServer(): any {
    fastifyApp = fastify()

    fastifyApp.get('/firstRouts', async (request, reply) => {
        console.log("OK")
        return `firstRuts response`
    })

    const listenForRequest = fastifyApp.printRoutes()
    console.log(listenForRequest)
    fastifyApp.listen({ port: 8090 }, (err, address) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
            console.log(`Server listening at ${address}`)
        })
    return fastifyApp;
}


