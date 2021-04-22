# Wearable metric dashboard

### File structure:
- `lambda` directory contains the lambda code (python) used to ingest and querry data
  - getWearableData is the lambda function connected to an API. This API is used to querry data stored in Dynamo DB.
  - ingestionLambda is the lambda used to batch ingest data from a file placed in an S3 bucket.
- The rest of the repo is oriented towards the website.
### Running website:
`Run npm start`