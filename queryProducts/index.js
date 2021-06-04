const AWS = require("aws-sdk");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log(event);

  console.log(event.queryStringParameters);

  let { tags } = event.queryStringParameters;
  tags = tags.split(",");
  console.log(tags);

  const expressionAttrValues = {};
  for (let tag of tags) {
    expressionAttrValues[`:${tag}`] = { S: tag };
  }
  const expressionKeys = Object.keys(expressionAttrValues).join();

  console.log("values:", expressionAttrValues);
  console.log("keys:", expressionKeys);

  let responseBody = "";
  let statusCode = 0;

  // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_Query.html

  // THERE IS AN ERROR WITH 'CONTAINS' APPARENTLY, TRY 'IN'
  const params = {
    ExpressionAttributeNames: {
      "#T": "Tags",
    },
    ExpressionAttributeValues: expressionAttrValues,
    KeyConditionExpression: `#T contains (${expressionKeys})`,
    TableName: "Catalog",
  };

  console.log("params:", params);

  try {
    const data = await dynamoDb.query(params).promise();
    console.log("data:", data)
    responseBody = JSON.stringify(data.Item);
    statusCode = 200;
  } catch (err) {
    console.log(err)
    responseBody = "Query failed.";
    statusCode = 403;
  }

  const response = {
    statusCode: statusCode,
    body: responseBody,
  };

  console.log(response);
  return response;
};
