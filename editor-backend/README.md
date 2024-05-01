## Editor Services 

api_url = `https://100058.pythonanywhere.com/`

#### fetch content from database method-1

*POST* to `api/get-data-by-collection/`
- Request Body
```json
{
    "database":"<database_name>",
    "collection":"<collection_name>",
    "fields": "<fields_name>",
    "document_id" : "<document_id or a unique_id>"
}
```
Response - 200
```json
"<Content of specific database>"
```
Response - 400
```json
{
    "info": "all parameters are required, database, collection, fields"
}
```
#### fetch content from database method-2

*POST* to `api/get-data-from-collection/`
- Request Body
```json
{
    "document_id" : "<document_id or a unique_id>",
    "action": "<template or document>"
}
```
Response - 200
```json
"Content of specific database"
```
Response - 204
```json
[]
```
Response - 400
```json
{
    "info": "Sorry!"
}
```
#### Generate editor link
*POST* to `api/generate-editor-link/`
- Request Body
```json
"requst.body"
```
Response - 200
```json
{
    "editor_link": "<link_to_the_editor>"
}
```
Response - 400
```json
{
    "info": "toodles!!"
}
```
#### Save into collection
*POST* to `api/save-data-into-collection/`
- Request Body
```json
"request.body"
```
Response - 200
```json
{
    "response":"<inserted_response>"
}
```
Response - 400
```json
{
    "info": "Sorry!"
}
```


