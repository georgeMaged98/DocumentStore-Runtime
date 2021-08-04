const mongoose = require('mongoose')
const fs = require('fs-extra')

const CollectionModel = require('./Database/CollectionDef')
const ModelDef = require('./Database/ModelDef')
const { createModel } = require('./schemas')

const models = {}

const collectionsDir = fs.readdirSync('./Collections')

const saveCollections = async () => {
  try {
    const collectionPromises = []
    collectionsDir.forEach(async (col) => {
      const collectionDef = JSON.parse(fs.readFileSync(`./Collections/${col}`))
      const collectionName = col.split('.')[0]
      collectionDef['collectionName'] = collectionName

      collectionPromises.push(CollectionModel.create(collectionDef))
      models[collectionName] = await createModel(collectionName)
    })

    await Promise.all(collectionPromises)
    console.log('Collections synced')
  } catch (err) {
    console.log(err)
  }
}

const saveModelDefinitions = async () => {
  try {
    const modelPromises = []
    const modelDefFile = JSON.parse(fs.readFileSync('ModelDefinitions.json'))
    for (model in modelDefFile['models']) {
      let attributes = {}
      attributes = { ...modelDefFile['models'][model] }
      attributes['modelStoreId'] = {}
      attributes['modelStoreId']['type'] = 'numeric'

      modelPromises.push(
        ModelDef.create({
          modelName: model,
          attributes: attributes,
        })
      )
    }

    console.log('Models synced')
  } catch (err) {
    console.log(err)
  }
}

const getModels = () => {
  try {
    return models
  } catch (err) {
    console.log(err)
  }
}

const bootstrapper = async () => {
  try {
    await saveCollections()
    await saveModelDefinitions()
  } catch (err) {
    console.log(err)
  }
}

module.exports = { bootstrapper, getModels }
