import json
import os
import pymongo
from pymongo import MongoClient

mongo_username = os.environ.get('MONGO_USERNAME')
mongo_password = os.environ.get('MONGO_PASSWORD')

mongo_username='mongo_user'     # testing: delete this
mongo_password='c26uq9sQ7..BHHr'    # testing: delete this
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

def lambda_handler(event, context):
    print(event)
    for r in event['Records']:
        record = json.loads(r['body'])
        print("processing event: {}".format(record['name']))

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