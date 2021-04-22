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
        # 'body': 'NO',
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods" : "OPTIONS,POST",
            # "Access-Control-Allow-Credentials" : true,
            "Access-Control-Allow-Origin" : "*",
            "X-Requested-With" : "*"
        },
    }

def formatResponse (response, columns) :
    formattedDict = {}
    for column in columns: 
        formattedDict[column] = []
    for columnValue in response:
        for column in columns: 
            formattedDict[column].append(float(Decimal(columnValue[column])) 
            if isinstance(columnValue[column],Decimal)  
            else columnValue[column])
    print("Formated dict", formattedDict)     
    return(formattedDict)

def querryDB(fe, columnsToQuerry):
    response = table.scan(FilterExpression = eval(fe), ProjectionExpression = columnsToQuerry)
    itemsInResponse = response['Items']
    while 'LastEvaluatedKey' in response:
        response = table.scan(FilterExpression = eval(fe), ProjectionExpression = columnsToQuerry)
        itemsInResponse.append(response['Items'])
    columnsArray = columnsToQuerry.replace(" ", "").split(',')
    print("Formatting")
    return formatResponse(itemsInResponse, columnsArray)

def activityTypeFilterEx(activity) :
    return "Key('activityType').eq('" + activity +"')"
def dateFilterEx(date):
    dateArray = date.replace(" ", "").split(',')
    return "Key('date').between('" + dateArray[0] + "','" +  dateArray[1] + "')"

def buildFilterExpression(requestValues):
    fe = ""
    filterableColumns = {"activityType": activityTypeFilterEx,
    "date": dateFilterEx}
    for key in requestValues:
        if key in filterableColumns:
            fe+=filterableColumns[key](requestValues[key])
            fe += ' & '
    return fe[:-2]

def lambda_handler(event, context):
    print("Event")
    print(event)
    operation = event['httpMethod']
    # # if operation is not "POST" : return respond(ValueError('Unsupported method "{}"'.format(operation)))
    requestValues =  json.loads(event['body'])
    # requestValues =  (event['body'])
    print("RequestValues")
    print(requestValues)
    # print(requestValues['body'])
    fe = buildFilterExpression(requestValues)
    print('fe')
    print(fe)
    print(requestValues['columnValues'])
    responseBody = querryDB(fe, requestValues['columnValues'])
    return respond(responseBody)