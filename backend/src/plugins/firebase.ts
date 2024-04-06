import { FastifyPluginAsync } from "fastify";
import plugin from "fastify-plugin";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";

declare module "fastify" {
  interface FastifyInstance {
    db: Firestore;
  }
}

export default plugin<FastifyPluginAsync>(async (app): Promise<void> => {
  const credentials = require("../firebaseKey.json");
  initializeApp({
    credential: cert(credentials),
  });

  const db = getFirestore();

  app.decorate("db", db);
});
