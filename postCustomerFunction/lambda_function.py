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


test_message = {'Records': [{'messageId': 'c863054d-1067-486f-bb2f-a2c034ad68c9', 'receiptHandle': 'AQEBGj6ZjPFCt6HczgS0Py6fnRCb3hDCezXGVMSsaQZaodqCGFP6UWlNGu5Jn4BXHgzS7lAMM4wbjXlDMZYnrdKcWmX2HWCjPAg7k5YpXTVPANnQ0Ds7XRHcCs/lqezjXNHvpkxJpwXst2fJUlHMAeEDae6uQX0onDJfbkbbr/71+GzZ12qmt1dxSNh8em9jY02p5brUuQCP3UfzkElS7lxi5u/8BwRr71jLT+tqLTMyvDEuk76/677YVE4I0kDaIzDom4Uwi4GW1+vOcUlnXvZdpvNUaew05rIpcfovW5ThI//9pMKRxXZqTBcnMoaqUj7v7cgEug6RLMtwInUm72DPj4W0IGvuaYOlQVOBXIdBviklsABVhi4q2CG7AZlFUR1RFiv9r4q2Pu+xpcDM8FMzWg==', 'body': '{"name": "testtest",\n"street_addr": "test",\n"city": "New York",\n"state": "NY",\n"zip": 11355,\n"country": "US",\n"lat": 88,\n"long": 88}', 'attributes': {'ApproximateReceiveCount': '2', 'SentTimestamp': '1732054792440', 'SenderId': '471112517107', 'ApproximateFirstReceiveTimestamp': '1732054792441'}, 'messageAttributes': {}, 'md5OfBody': '29dc1e8d6b4686988a1df9c622182fe2', 'eventSource': 'aws:sqs', 'eventSourceARN': 'arn:aws:sqs:us-east-1:471112517107:post_customer_queue', 'awsRegion': 'us-east-1'}]}

def lambda_handler(event, context):
    print(event)
    if(event):
        for r in event["Records"]:
            record = json.loads(r["body"])
            print("Processing event: {}".format(record))

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

#lambda_handler(test_message,"")     # testing