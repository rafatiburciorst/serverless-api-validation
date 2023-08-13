const { dynamoDB } = require('./factory')
const Handler = require('./handler');
const { decoratorValidator } = require('./util');

const handler = new Handler({
  dynamoDBSvc: dynamoDB
})
const heroesInsert = decoratorValidator(
  handler.main.bind(handler), // a fn .bind garante que o contexto do bind seja o do handler
  Handler.validator(),
  'body'
)



const heroesTrigger = async (event) => {
  console.log('***event', event);
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v3.0! Your function executed successfully!',
        input: event,
      },
      null,
      2
    ),
  };
};

module.exports = {
  heroesTrigger,
  heroesInsert
}
