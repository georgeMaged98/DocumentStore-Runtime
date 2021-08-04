const fs = require('fs-extra')
const mongoose = require('mongoose')

const { models } = JSON.parse(fs.readFileSync('./ModelDefinitions.json'))

const createSchema = (attributes, modelName) => {
  /**
   * A function that takes the modelName and the attributes and prepare the schema for the current model with its relations as sub documents.
   * @param {[Array]} attributes The attributes of the current model
   * @param {[String]} modelName The current Model Name.
   * @return {[Object]} An object which is the schema of the collection. -> to be handled in createModel function.
   */
  try {
    const schema = {}
    schema[modelName] = mongoose.Schema.Types.Map
    attributes.forEach((att) => {
      if (typeof att === 'object') {
        const nestedSchema = createSchema(
          att.attributes,
          models[modelName][att.relationName].model
        )

        schema[modelName][att.relationName] =
          models[modelName][att.relationName].type === 'MANY'
            ? [nestedSchema]
            : nestedSchema
      } else {
        const type = models[modelName][att].type
        schema[modelName][att] =
          type === 'text'
            ? mongoose.Schema.Types.String
            : type === 'numeric'
            ? mongoose.Schema.Types.Number
            : mongoose.Schema.Types.Date
      }
    })
    schema[modelName]['modelStoreId'] = mongoose.Schema.Types.Number
    return schema
  } catch (err) {
    console.log(err)
  }
}

const createModel = async (collectionName) => {
  /**
   * A function that takes the collectionName and returns the mongoose model
   * @param {[String]} collectionName The collection name to be created
   * @return {[mongoose.model]} A mongoose model of the collection whose schema is based
   * on the collectionName json file in Collections Directory
   */
  try {
    const syncCollection = JSON.parse(
      fs.readFileSync(`./Collections/${collectionName}.json`)
    )

    const collectionSchema = await createSchema(
      syncCollection.attributes,
      syncCollection.modelName
    )

    return mongoose.model(collectionName, collectionSchema)
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  createModel,
}
