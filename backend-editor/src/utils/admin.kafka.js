import { Kafka } from "kafkajs";
import config from "../config/index.js";
import { logInfo, logError } from "../utils/helper.js"; // Adjust the path as per your actual file structure

export async function createTopicByAdmin() {
  const kafka = new Kafka({
    clientId: "editor",
    brokers: [config.IP]
  });
  
  const admin = kafka.admin();

  try {
    logInfo("Admin connecting...");
    await admin.connect();
    logInfo("Admin connection successful.");

    logInfo("Creating topic [EDITORDATA]...");
    await admin.createTopics({
      topics: [
        {
          topic: "EDITORDATA",
          numPartitions: 2,
        },
      ],
    });
    logInfo("Topic [EDITORDATA] created successfully.");

    logInfo("Disconnecting admin...");
    await admin.disconnect();
    logInfo("Admin disconnected.");

  } catch (error) {
    logError("Error creating topic:", error);
    throw error;
  }
}
