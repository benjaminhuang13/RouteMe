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


test_message = {'Records': [{'messageId': 'cc85c4d6-d6b1-4b8d-bd9b-c0412cc089e8', 'receiptHandle': 'AQEBHH8Ex+3I03WJhRCk2Z2XW5CiBBaz+lqHER1JCe2dWyNqwH2UWvTGtN4e7B9X42FUqMq/Un1kkJ4UvcRy4GBqmxI+YjFeCzw9fu5mMBGeWwNFw+W0i5MTJ/3LE7NZzKKoQiLMskEBohhugOyHhOqLOwi5lLsM6ZFiil+dHAVaIgPK44amLcZPlgf0WLnGLL7PORob90BXjj6zQCrL9GAwkl6z6UxoNsHo9B4a05w0wCvWKCoT/otv+jZky45tGg6NJ6cCqXucC7CSQ71hNcPejgfzloHfYmsupzAPGlEKGH+vdzJXwXwutmPDLutA/gpHlQQVQ0FTYGqeYU+cw0AlLCqHeir+RNixOhn15hIUFYVDh42ZIUFEggKZMZWDRLfKieHsrLTlWoDyialz7LZlzA==', 'body': '{"_id":"673d2ecb861004e0524a0fd0"}', 'attributes': {'ApproximateReceiveCount': '1', 'SentTimestamp': '1732064263165', 'SenderId': 'AROAW3MD6QXZTGIWUTKCE:27601050de9746cf9321d02a3160aecf', 'ApproximateFirstReceiveTimestamp': '1732064263175'}, 'messageAttributes': {}, 'md5OfBody': '658c17ba9a05265881f03990fd58cfb9', 'eventSource': 'aws:sqs', 'eventSourceARN': 'arn:aws:sqs:us-east-1:471112517107:delete_customer_queue', 'awsRegion': 'us-east-1'}]}

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