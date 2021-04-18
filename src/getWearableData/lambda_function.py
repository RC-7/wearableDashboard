import boto3
import json
from boto3.dynamodb.conditions import Key
from decimal import Decimal

DBTableName = 'wearableData'
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(DBTableName)


def respond(body):
    return {
        'statusCode': '200',
        'body': json.dumps(body),
        'headers': {
            'Content-Type': 'application/json',
        },
    }

def formatResponse (response, columns) :
    formattedDict = {}
    for column in columns: 
        formattedDict[column] = []
    for columnValue in response:
        for column in columns: 
            formattedDict[column].append(float(Decimal(columnValue[column])) 
            if isinstance(Decimal(columnValue[column]),Decimal)  
            else columnValue[column])
    print("Formated dict", formattedDict)     
    return(formattedDict)


def querryDB(fe, columnsToQuerry):
    response = table.scan(FilterExpression = eval(fe), ProjectionExpression = columnsToQuerry)
    columnsArray = columnsToQuerry.replace(" ", "").split(',')
    return formatResponse(response['Items'], columnsArray)

    # build up a filter expression we will use in querryDB
def buildFilterExpression(requestValues):
    pass

def lambda_handler(event, context):

    operation = event['httpMethod']
    # if operation is not "POST" : return respond(ValueError('Unsupported method "{}"'.format(operation)))
    requestValues =  event['body']
    fe = "Key('activityType').eq('running')"
    fe = buildFilterExpression(requestValues)
    responseBody = querryActivity(fe, requestValues['columnValues'])
    return respond(responseBody)

    
