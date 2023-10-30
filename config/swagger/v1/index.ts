import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Router } from "express";

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
        title: "Qual Remedio?",
        version: "1.0.0",
        }
    },
    apis: ['../routes/v1/*.ts'] //TODO - Arrumar path
}

const swaggerSpec: object = swaggerJSDoc(options)

export const swaggerDocs = (router: Router) => {
    //Swagger Page
    router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

    //Swagger json
    router.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}