import json
import os
import pymongo
from pymongo import MongoClient

mongo_username = os.environ.get('MONGO_USERNAME')
mongo_password = os.environ.get('MONGO_PASSWORD')

mongo_username='mongo_user'
mongo_password='c26uq9sQ7..BHHr'

cluster_name = 'bargonzocluster'
appname ='BargonzoCluster'
cluster = MongoClient("mongodb+srv://{}:{}@{}.kh6ad.mongodb.net/?retryWrites=true&w=majority&appName={}".format(mongo_username, mongo_password, cluster_name, appname))
db = cluster["customer_data"]
collection = db["customer_data"]

test_message = {'Records': [{'messageId': 'c863054d-1067-486f-bb2f-a2c034ad68c9', 'receiptHandle': 'AAA', 
    'body': '{"_id":"673d2ecb861004e0524a0fd0"}', 'attributes': {'ApproximateReceiveCount': '2', 'SentTimestamp': '1732054792440', 'SenderId': '471112517107', 'ApproximateFirstReceiveTimestamp': '1732054792441'}, 'messageAttributes': {}, 'md5OfBody': '29dc1e8d6b4686988a1df9c622182fe2', 'eventSource': 'aws:sqs', 'eventSourceARN': 'arn:aws:sqs:us-east-1:471112517107:post_customer_queue', 'awsRegion': 'us-east-1'}]}

def lambda_handler(event, context):
    print(event)
    if(event):
        for r in event["Records"]:
            record = json.loads(r["body"])
            print("Processing event: {}".format(record))
            objID = record['_id']
            query_filter = { "_id": objID }
            response = collection.delete_one(query_filter)
            print(response)
            if response.acknowledged:
                print('success deleting customer')
            else:
                print('failed deleting customer')
                return {        
                    'statusCode': 500,
                    'headers': {'Content-Type': 'application/json'},
                    'body': json.dumps('Execution failed. response: {}'.format(response))}
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps('Execution success')
    }

#lambda_handler(test_message,"")     # testing