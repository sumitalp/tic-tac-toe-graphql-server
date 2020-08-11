import { ApolloServer } from "apollo-server-express";

import express, {Application} from "express";
import { createServer } from "http";
import bodyParser from "body-parser";
import bunyanLogger from "express-bunyan-logger";

import logger from "./logger";

import { connectWithRetry } from "./db";

import { Schema } from "./graphql";

const main = async () => {
    const app: Application = express();

    const apolloServer = new ApolloServer({
        formatError: err => {
            logger.error(err);
            return err;
        },
        schema: Schema,
        playground: {
            endpoint: "/graphql"
        }
    });
    apolloServer.applyMiddleware({ app });

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(bodyParser.text({ type: 'application/graphql' }));

    app.get("/ping", (req, res) => {
        res.send("pong");
    });

    app.use(bunyanLogger());
    app.use(bunyanLogger.errorLogger());

    process.on("unhandledRejection", err => {
        logger.error(err);
    });

    await connectWithRetry();
    const server = createServer(app);

    server.listen(4000, () => {
        logger.info("listening on 4000");
    });
};

export default main;
