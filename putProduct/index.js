const { v4 } = require("uuid")
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const prodictInfo = (options) => {
    if (!options.tags) {
        return {
            id: v4(),
            name: options.name,
            price: options.price,
        };
    }
    return {
      id: v4(),
      name: options.name,
      price: options.price,
      tags: options.tags
    };
  };

exports.handler = async (event) => {
    console.log(event);
  
    const { body } = event;
    console.log(body);

    const product = prodictInfo(JSON.parse(body));
    console.log(product);

    let responseBody = "";
    let statusCode = 0;
    let statusMessage = "";

    const params = {
        TableName: "Catalog",
        Item: product,
    };

    try {
        const data = await dynamoDb.put(params).promise();
        console.log(data);
        responseBody = JSON.stringify(product);
        statusCode = 201;
        statusMessage = "Created";

    } catch (err) {
        responseBody = `Unable to create product`;
        statusCode = 403;
        statusMessage = err.message;
    }

    const response = {
        "statusCode": statusCode,
        "statusMessage": statusMessage,
        "body": responseBody,
    };
    
    console.log(response)
    return response;
};