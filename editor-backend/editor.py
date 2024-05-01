import json
import requests
import pprint

from datetime import datetime


def get_event_id():
    dd = datetime.now()
    time = dd.strftime("%d:%m:%Y,%H:%M:%S")
    url = "https://100003.pythonanywhere.com/event_creation"

    data = {
        "platformcode": "FB",
        "citycode": "101",
        "daycode": "0",
        "dbcode": "pfm",
        "ip_address": "192.168.0.41",
        "login_id": "lav",
        "session_id": "new",
        "processcode": "1",
        "regional_time": time,
        "dowell_time": time,
        "location": "22446576",
        "objectcode": "1",
        "instancecode": "100051",
        "context": "afdafa ",
        "document_id": "3004",
        "rules": "some rules",
        "status": "work",
        "data_type": "learn",
        "purpose_of_usage": "add",
        "colour": "color value",
        "hashtags": "hash tag alue",
        "mentions": "mentions value",
        "emojis": "emojis",
    }
    r = requests.post(url, json=data)
    return r.text


# insertion for template creation

url = "http://100002.pythonanywhere.com/"

payload = json.dumps(
    {
        "cluster": "Documents",
        "database": "Documentation",
        "collection": "editor",
        "document": "editor",
        "team_member_ID": "100084006",
        "function_ID": "ABCDE",
        "command": "insert",
        "field": {
            "eventId": get_event_id(),
            "created_by": "Manish",
            "company_id": "55522553",
            "template_name": "",
            "content": "",
        },
        "update_field": {"order_nos": 21},
        "platform": "bangalore",
    }
)
headers = {"Content-Type": "application/json"}

response = requests.request("POST", url, headers=headers, data=payload)
print(response.text)

# {"isSuccess": true, "inserted_id": "638af0622b960388b04b6146"}

# get the content from template collection for particular id


"""url = "http://100002.pythonanywhere.com/"

payload = json.dumps({
    "cluster": "Documents",
    "database": "Documentation",
    "collection": "editor",
    "document": "editor",
    "team_member_ID": "100084006",
    "function_ID": "ABCDE",
    "command": "find",
    "field": {
        "_id":"638871e25e907e22559b4aa9" # template id
    },
    "update_field": {
        "order_nos": 21
    },
    "platform": "bangalore"
    })
headers = {
    'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)
print(response.text)
"""
# "content": "[[{\"width\":574.125,\"height\":183.26250457763672,\"top\":107.26250457763672,\"left\":378.125,\"type\":\"TEXT_INPUT\",\"data\":\"dowell\",\"id\":\"editTextBox 1\"},{\"width\":574.125,\"height\":183.26250457763672,\"top\":107.26250457763672,\"left\":378.125,\"type\":\"TEXT_INPUT\",\"data\":\"\",\"id\":\"editTextBox 2\"}]]"
# insertion for document creation

"""url = "http://100002.pythonanywhere.com/"

payload = json.dumps({
    "cluster": "Documents",
    "database": "Documentation",
    "collection": "editor",
    "document": "editor",
    "team_member_ID": "100084006",
    "function_ID": "ABCDE",
    "command": "insert",
    "field": {
        "eventId":get_event_id(),
        "created_by":"Manish",
        "company_id":"52525252e52d",
        "document_name":"",
        "content":"[[{\"width\":638.125,\"height\":249.90000915527344,\"top\":173.90000915527344,\"left\":442.125,\"type\":\"TEXT_INPUT\",\"data\":\"Manish\",\"id\":\"editTextBox 1\"},{\"width\":638.125,\"height\":249.90000915527344,\"top\":173.90000915527344,\"left\":442.125,\"type\":\"TEXT_INPUT\",\"data\":\"\",\"id\":\"editTextBox 2\"}]]" #copy the template content and paste
    },
    "update_field": {
        "order_nos": 21
    },
    "platform": "bangalore"
    })
headers = {
    'Content-Type': 'application/json'
}

response = requests.request("POST", url, headers=headers, data=payload)
print(response.text)"""

# {"isSuccess": true, "inserted_id": "638873885e907e22559b4ad6"}

# generate link for template

"""{
  "product_name": "workflowai",
  "details":{
    "_id":"", # template inserted id
    "field":"template_name",
    "cluster": "Documents",
    "database": "Documentation",
    "collection": "editor",
    "document": "editor",
    "team_member_ID": "100084006",
    "function_ID": "ABCDE",
    "command": "update",
    "update_field": {
      "template_name":"",
      "content":""
    }
  }
}"""

# generate link for document

"""{
  "product_name": "workflowai",
  "details":{
    "_id":"", # document template id
    "field":"document_name",
    "cluster": "Documents",
    "database": "Documentation",
    "collection": "editor",
    "document": "editor",
    "team_member_ID": "100084006",
    "function_ID": "ABCDE",
    "command": "update",
    "update_field": {
      "document_name":""
    }
  }
}"""

"""

details.update_field = {"template_name":title,"content":content }
   
    
details.update_field = {"document_name":title}



"""
