from django.apps import AppConfig
import time
import threading
from editor.kafka.producer import kafka_producer
from editor.kafka.consumer import kafka_consumer

class EditorConfig(AppConfig):
    name = 'editor'

    def ready(self):
        # Start the Kafka consumer in a separate thread first
        consumer_thread = threading.Thread(target=self.start_kafka_consumer)
        consumer_thread.daemon = True
        consumer_thread.start()

        # Ensure the consumer has time to fully initialize before starting the producer
        time.sleep(5)

    #     # Start the Kafka producer in a separate thread
    #     producer_thread = threading.Thread(target=self.start_kafka_producer)
    #     producer_thread.daemon = True
    #     producer_thread.start()

    # def start_kafka_producer(self):
    #     topic = 'auto_save'
    #     c=1
    #     while True:
    #         data = {"message": f"Hello Kafka-{c}"}
    #         kafka_producer(topic, data)
    #         time.sleep(5)
    #         c+=1

    def start_kafka_consumer(self):
        topic = 'auto_save'
        kafka_consumer(topic)
