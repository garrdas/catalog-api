const { v4 } = require("uuid")
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const checkRules = (options) => {
    if (options.name.length() > 40) {
        return "Invalid input: Name must not exceed 40 characters"
    }
    if (options.price < 0) {
        return "Invalid input: Price must not be negative"
    }
    if (options.tags && options.tags.includes("")) {
        return "Invalid input: Tags must not be blank"
    }
    return false;
};

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

    let ruleViolation;

    ruleViolation = checkRules(body);

    if (ruleViolation) {
        console.log("Rule violation:" + ruleViolation);
        const statusCode = 403;

        const response = JSON.stringify({
            "statusCode": statusCode,
            "body": ruleViolation
        });
        
        console.log(response);
        return response;
    }

    const product = prodictInfo(body);
    console.log(product);

    let responseBody = "";
    let statusCode = 0;

    const params = {
        TableName: "Catalog",
        Item: product
    };

    try {
        const data = await dynamoDb.put(params).promise();
        console.log(data);
        responseBody = JSON.stringify(data.Item);
        statusCode = 201;

    } catch (err) {
        responseBody = `Unable to add product`;
        statusCode = 403;
    }

    const response = JSON.stringify({
        statusCode: statusCode,
        body: responseBody
    });
    
    console.log(response);
    return response;
};
