from kafka import KafkaProducer
import json

def kafka_producer(topic, data):
    producer = KafkaProducer(
        bootstrap_servers='kafka:9092',
        value_serializer=lambda v: json.dumps(v).encode('utf-8')
    )
    
    producer.send(topic, data)
    producer.flush()
    return True
