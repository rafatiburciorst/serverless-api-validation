//fn é função
//schema é a validação
//argtype é o arg body ou queryParams
const decoratorValidator = (fn, schema, argType) => {
    return async function (event) {
        const data = JSON.parse(event[argType])
        const { error, value } = await schema.validate(
            data,
            {
                //mostra todos os erros na tela
                abortEarly: false
            }
        )
        //faz com que o event.body venha como objeto ao inves de string
        event[argType] = value
        //apply passa a função e todos os argumentos para frente
        if (!error) return fn.apply(this, arguments)
        return {
            statusCode: 422, // AWS unprocessed Entity
            body: error.message
        }
    }
}

module.exports = {
    decoratorValidator
}