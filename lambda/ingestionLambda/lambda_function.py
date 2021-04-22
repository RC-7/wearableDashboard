import pandas as pd
import json
import urllib.parse
import boto3
from decimal import Decimal


DBTableName = 'wearableData'
s3 = boto3.client('s3')

def writeDfToDb (df):
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(DBTableName)
    with table.batch_writer() as batch:
        for index, row in df.iterrows():
            content = {
                'workoutID': "activity_type#" + row['Day'],
                'date': row['Day'],
                'activityType': row['activity_type'],
                'duration': Decimal(str(row['duration'])),
                'maxHRAge': Decimal(str(row['maxHRAge'])),
                'durationMins': Decimal(str(row['duration_mins'])),
                'maxHR': Decimal(str(row['maxHR'])),
                'averageHR': Decimal(str(row['averageHR'])),
                'averageSpeed': Decimal(str(row['averageSpeed'])),
                'totalKilocalories': Decimal(str(row['totalKilocalories'])),
                'lactateThresholdBpm': Decimal(str(row['lactateThresholdBpm'])),
                'lactateThresholdSpeed': Decimal(str(row['lactateThresholdSpeed'])),
                'restingHeartRate': Decimal(str(row['restingHeartRate'])),
                'TSS': Decimal(str(row['TSS'])),
                'vo2Max': Decimal(str(row['vo2Max'])),
                'startTimeLocal': row['startTimeLocal'],
                'AL': Decimal(str(row['AL'])),
                'CL': Decimal(str(row['CL'])),
                'Form': Decimal(str(row['Form']))

            }
            batch.put_item(Item=content)

def readS3EventToDf(event) :
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    try:
        response = s3.get_object(Bucket=bucket, Key=key)
        df = pd.read_csv(response['Body'])
        print("Dataframe created for S3 upldated csv")
        return df
    except Exception as e:
        print(e)
        print('Error getting object {} from bucket {}. Make sure they exist and your bucket is in the same region as this function.'.format(key, bucket))
        raise e

def cleanDf(df) :
    df.dropna(inplace = True)

def deleteS3Object(event) :
    s3Resource = boto3.resource('s3')
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = urllib.parse.unquote_plus(event['Records'][0]['s3']['object']['key'], encoding='utf-8')
    try:
        s3Resource.Object(bucket, key).delete()
    except Exception as e:
        print(e)
        print('Error deleting object {} from bucket {} after ingesting to Dynamo DB storage.'.format(key, bucket))
        raise e

def lambda_handler(event, context):
    df = readS3EventToDf(event)
    cleanDf(df)
    writeDfToDb(df)
    deleteS3Object(event)
