import { fastifyApp } from "./server"


fastifyApp.get('/firstRouts', async (request, reply) => {
    console.log("OK")
    return `firstRuts response`
})
