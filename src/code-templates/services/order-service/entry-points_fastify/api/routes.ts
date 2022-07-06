import express from "express";
import util from "util";
import * as newOrderUseCase from "../../domain/new-order-use-case";
import {FastifyInstance} from "fastify";




export const defineRoutes = (fastifyApp: FastifyInstance) => {
    fastifyApp.get('/firstRouts', async (request, reply) => {
        console.log("OK")
        return `firstRuts response`
    })

};