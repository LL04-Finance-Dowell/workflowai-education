import requests, json


def generate_pdf(link):
    api_key = "ca62MTgzNDQ6MTU0Mzk6dmh4blJadVVtRGhPd3J0bA="
    data = {
      "url": link,
      "settings": {
        "paper_size": "A4",
        "orientation": "1",
        "header_font_size": "9px",
        "margin_right": "30",
        "print_background": "1",
        "displayHeaderFooter": False,
      }
    }

    response = requests.post(
        F"https://rest.apitemplate.io/v2/create-pdf-from-url",
        headers = {"X-API-KEY": F"{api_key}"},
        json= data
    )
    
    return json.loads(response.text)

