import { kafka } from '../config/kafka.config.js';
import { saveDataToDatacube } from './dbOperation.js';
import { logInfo, logError } from './helper.js';

let producer = null;

export async function createProducer() {
  if (producer) return producer;

  const _producer = kafka.producer();
  await _producer.connect();
  producer = _producer;
  logInfo('Producer created and connected.');
  return producer;
}

export async function produceMessage(data) {
  try {
    const producer = await createProducer();
    const messageValue = JSON.stringify(data);
    logInfo('Producing message:');

    await producer.send({
      topic: "EDITORDATA",
      messages: [{ value: messageValue }],
    });

    logInfo('Message produced successfully.');
    return true;
  } catch (error) {
    logError('Error producing message:', error);
    throw error;
  }
}

export async function startMessageConsumer() {
  logInfo('Consumer is running...');
  const consumer = kafka.consumer({ groupId: "default" });

  try {
    await consumer.connect();
    await consumer.subscribe({ topic: "EDITORDATA", fromBeginning: true });

    await consumer.run({
      autoCommit: true,
      eachMessage: async ({ message, pause }) => {
        if (!message.value) return;

        logInfo('New message received.');
        try {
          await saveDataToDatacube(JSON.parse(message.value.toString()));
          logInfo('Message saved to Datacube:', message);
        } catch (err) {
          logError('Error saving message to Datacube:', err);
          pause();
          setTimeout(() => {
            consumer.resume([{ topic: "EDITORDATA" }]);
          }, 60 * 1000);
        }
      },
    });

    logInfo('Consumer running successfully.');
  } catch (error) {
    logError('Error running consumer:', error);
    throw error;
  }
}
