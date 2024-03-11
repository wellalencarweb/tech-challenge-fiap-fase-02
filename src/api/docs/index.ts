import { ApiPaths } from "./paths";

export const SwaggerConfig = {
    openapi: "3.0.0",
    info: {
        title: "tech-challenge-fiap",
        description:
            "Sistema de Gerenciamento de Pedidos - Fast Food",
        version: "1.0.0",
    },
    servers: [
        {
            url: "/api",
        },
    ],
    tags: [
        {
            name: "produto",
            description: "Rotas relacionadas a produto",
        },
        {
            name: "cliente",
            description: "Rotas relacionadas a cliente",
        },
        {
            name: "pedido",
            description: "Rotas relacionadas a pedido",
        },
        {
            name: "webhook",
            description: "Rotas relacionadas a webhooks",
        },
    ],
    paths: ApiPaths,
};
