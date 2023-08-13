const Joi = require('@hapi/joi')
const { randomUUID } = require('node:crypto')

class Handler {

    constructor({ dynamoDBSvc }) {
        this.dynamoDBSvc = dynamoDBSvc
        this.dynamoTable = 'Heroes'
    }

    static validator() {
        return Joi.object({
            name: Joi.string().max(100).min(2).required(),
            power: Joi.string().max(20).min(2).required(),
        })
    }

    async main(event) {
        const data = event.body
        const params = this.prepareData(data)

        await this.dynamoDBSvc.put(params).promise()
        const insertedItem = await this.dynamoDBSvc.query({
            TableName: this.dynamoTable,
            ExpressionAttributeValues: {
                ':id': params.Item.id
            },
            KeyConditionExpression: 'id = :id'
        }).promise()

        console.log('***event', event);
        return {
            statusCode: 200,
            body: JSON.stringify(
                insertedItem
            ),
        };
    }

    prepareData(data) {
        return {
            TableName: 'Heroes',
            Item: {
                ...data,
                id: randomUUID(),
                created_at: new Date().toISOString()
            }
        }
    }
}

module.exports = Handler