import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Qual Remedio?",
            version: "1.0.0",
            description: "Sistema Gerenciador de Receitas e Consultas Medicas."

        },
        components: [
            {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        schema: 'bearer',
                        bearerFormat: 'JWT'
                    }
                }
            }
        ],
        servers: [
            { 
                url: 'http://localhost:8080/api/v1' ,
                description: 'Caminho referente a primeira versão da API'
            }
        ],
    },
    apis: ['./app/http/controllers/v1/*.ts'],

}

export const swaggerSpec: object = swaggerJSDoc(options)