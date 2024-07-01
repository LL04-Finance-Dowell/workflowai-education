import { Kafka } from "kafkajs"
import config from "./index.js"


export const kafka = new Kafka({
    clientId: "editor",
    brokers: [config.IP]
})