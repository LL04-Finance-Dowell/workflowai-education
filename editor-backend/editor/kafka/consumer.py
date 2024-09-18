from kafka import KafkaConsumer
from editor.utils import (
    targeted_population,
    dowellconnection,
    single_query_document_collection,
    single_query_template_collection,
    access_editor,
    check_item_version,
    TEMPLATE_CONNECTION_LIST,
    TEMPLATE_METADATA_LIST,
    DOCUMENT_METADATA_LIST,
)
import jwt
import requests
from git.repo import Repo
import json



def kafka_consumer(topic):
    print('connecting to consumer successful')
    consumer = KafkaConsumer(
        topic,
        bootstrap_servers='kafka:9092',
        auto_offset_reset='earliest',
        enable_auto_commit=True,
        group_id='my-group',
        value_deserializer=lambda v: json.loads(v.decode('utf-8'))
    )
    consumer.subscribe(topic)
    while True:
        data = next(consumer)
        # print(data,'+++')
        print(data.value,'=====')
        response = data.value
        # save_to_db(response)
        
def save_to_db(response):
    cluster = response["cluster"]
    database = response["database"]
    collection = response["collection"]
    document = response["document"]
    team_member_ID = response["team_member_ID"]
    function_ID = response["function_ID"]
    command = response["command"]
    field = response["field"]
    update_field = response["update_field"]
    action = response["action"]
    metadata_id = response["metadata_id"]
    
    response = dowellconnection(
            cluster,
            database,
            collection,
            document,
            team_member_ID,
            function_ID,
            command,
            field,
            update_field,
        )
    if action == "template":
        field = {"_id": metadata_id}
        update_field = {"template_name": update_field["template_name"]}
        json.loads(
            dowellconnection(
                *TEMPLATE_METADATA_LIST, "update", field, update_field
            )
        )
    if action == "document":
        field = {"_id": metadata_id}
        update_field = {"document_name": update_field["document_name"]}
        json.loads(
            dowellconnection(
                *DOCUMENT_METADATA_LIST, "update", field, update_field
            )
        )

