import {fastify, FastifyInstance} from 'fastify'
import {AddressInfo} from "net";
import * as configurationProvider from "@practica/configuration-provider";
import * as logger from "@practica/logger";
import {errorHandler, AppError} from "@practica/error-handling";

import configurationSchema from "../../config";
import {defineRoutes} from "../../entry-points_fastify/api/routes";


let connection: FastifyInstance;

async function startWebServer() {
    configurationProvider.initialize(configurationSchema);
    connection = fastify()
    defineRoutes(connection);
    const APIAddress = await openConnection(connection);
    return APIAddress;
}


async function openConnection(
    fastifyApp: FastifyInstance
): Promise<AddressInfo> {
    return new Promise((resolve, reject) => {
        const portToListenTo = configurationProvider.getValue("port");
        const webServerPort = portToListenTo || 0;
        logger.info(`About to listen to port ${webServerPort}`);
        fastifyApp.listen({port: 8080}, (err, address) => {
            if (err) {
                console.error(err)
                process.exit(1)
            }
            errorHandler.listenToErrorEvents(connection);
            console.log(`Server listening at ${address}`)
        });
    });
}

async function stopWebServer() {
    connection.close().then(() => {
        console.log('successfully closed!')
    }, (err) => {
        console.log('an error happened', err)
    })
}


function defineErrorHandler(fastifyApp: FastifyInstance
) {
    fastifyApp.setErrorHandler(async function (error: AppError, request, reply) {
        if (typeof error === "object") {
            if (error.isTrusted === undefined || error.isTrusted === null) {
                error.isTrusted = true; //Error during a specific request is usually not catastrophic and should not lead to process exit
            }
        }
        await errorHandler.handleError(error);
        this.log.error(error)
        // Send error response
        reply.status(409).send({ok: false})
    })
}

export {startWebServer, stopWebServer};