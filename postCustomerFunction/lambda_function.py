import json
import os
import pymongo
from pymongo import MongoClient

mongo_username = os.environ.get('MONGO_USERNAME')
mongo_password = os.environ.get('MONGO_PASSWORD')

cluster_name = 'bargonzocluster'
appname ='BargonzoCluster'
cluster = MongoClient("mongodb+srv://{}:{}@{}.kh6ad.mongodb.net/?retryWrites=true&w=majority&appName={}".format(mongo_username, mongo_password, cluster_name, appname))
db = cluster["customer_data"]
collection = db["customer_data"]

test_record= {'name': 'testtest',
        'street_addr': 'test',
        'city': 'New York',
        'state': 'NY',
        'zip': 11355,
        'country': 'US',
        'lat': 88,
        'long': 88,}


test_message = {'Records': [{'messageId': 'd5ebb291-904d-4f8f-bbad-7533cbb71267', 'receiptHandle': 'AQEBmZ5l7vY26jsfFYZY8SFvE1iv9cZhDppbXDPTWiz0qenbtQr6E6syMemVikx/xI7/V/H2fpJmjYQ+tbrzNa3xGbL4nQe+pzrjEA4fBtYcrwAMk3FMkaesxyPMy8nS5NjaQhjV+pY7iHbOZVw8K6v/H/0b0QycOiZaDHD982VD+ohYuILQDazrdMB82mvNXssKaZDznvw9oes2DbzcKgkiBrVdCoytezHJsxoG59KIwnkdfp710Fld1A4frdoevYXvu20IcNUh7Bqkede2StJIR/u/INPjQpp6Uy0+/r7FZjpO5IPn9FVOzVW0ao3WeVNivBeobK5XmMYW+boxS4s8eSRiPyrcaPlzlz61oBEA6MDAf8jpcnllxrho4T1FIvJAfXKAb6qPtThXe4HRYWhpBg==', 'body': "{'name': 'testtest',\n        'street_addr': 'test',\n        'city': 'New York',\n        'state': 'NY',\n        'zip': 11355,\n        'country': 'US',\n        'lat': 88,\n        'long': 88,}", 'attributes': {'ApproximateReceiveCount': '2', 'SentTimestamp': '1732054214046', 'SenderId': '471112517107', 'ApproximateFirstReceiveTimestamp': '1732054214057'}, 'messageAttributes': {}, 'md5OfBody': 'ef266e9ff8d2a51c3fd6df4687c3755b', 'eventSource': 'aws:sqs', 'eventSourceARN': 'arn:aws:sqs:us-east-1:471112517107:post_customer_queue', 'awsRegion': 'us-east-1'}]}

def lambda_handler(event, context):
    print(event)
    if(event):
        for r in event['Records']:
            record = json.loads(r['body'])
            print("Processing event name {}\n {}".format(record['name'],{r}))

            response = collection.insert_one(record)
            if response.acknowledged:
                print('success adding customer')
            else:
                print('failed adding customer')
                return {        
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps('Execution failed. response: {}'.format(response))}
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps('Execution success')
    }