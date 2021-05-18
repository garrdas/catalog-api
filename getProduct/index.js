const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log(event);

    const { productid } = event.pathParameters;

    let responseBody = "";
    let statusCode = 0;
    let statusMessage = "";
    
    const params = {
        TableName: "Catalog",
        Key: {
            id: productid
        }
    };

    try {
        const data = await dynamoDb.get(params).promise();
        responseBody = JSON.stringify(data.Item);
        statusCode = 200;
        statusMessage = "OK";
        
    } catch (err) {
        responseBody = `Unable to retieve product with id ${productid}`;
        statusCode = 403;
        statusMessage = err.message;
    }

    const response = {
        "statusCode": statusCode,
        "statusMessage": statusMessage,
        "body": responseBody
    };

    console.log(response)
    return response;
};