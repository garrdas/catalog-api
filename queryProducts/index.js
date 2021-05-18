const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log(event);

    console.log(event.queryStringParameters);

    let { tags } = event.queryStringParameters;
    tags = tags.split(",");
    console.log(tags);

    let responseBody = "";
    let statusCode = 0;
    let statusMessage = "";
    
    const params = {
        TableName: "Catalog",
        KeyConditionExpression: "#tags = "
    };

    // try {
    //     const data = await dynamoDb.query(params).promise();
    //     responseBody = JSON.stringify(data.Item);
    //     statusCode = 200;
    //     statusMessage = "OK";
        
    // } catch (err) {
    //     responseBody = `Unable to retieve product with id ${productid}`;
    //     statusCode = 403;
    //     statusMessage = err.message;
    // }

    const response = {
        statusCode: statusCode,
        statusMessage: statusMessage,
        body: responseBody,

    };

    console.log(response);
    return response;
};