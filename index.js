const express = require('express')
const { bootstrapper, getModels } = require('./bootstrapper')
const { connectDB } = require('./connectDB')
const { createModel } = require('./schemas')
const ModelDefinitions = require('./Database/ModelDef')

const app = express()

app.get('/:collectionName', async (req, res) => {
  const collectionName = req.params.collectionName
  let collections = getModels()

  const filters = await getFilters(req.query)

  console.log('Filters', filters)
  const results = await collections[collectionName].find(filters)
  // console.log(results)
  return res.json({
    exitCode: 0,
    data: results,
  })
})

const getFilters = async (queryParams) => {
  try {
    // Prepare Filter Object by parsing strings to their proper types (e.g. number, date, array) using the model Definitions

    const filters = {}

    for (query in queryParams) {
      const filterArray = query.split('.')
      const attribute = filterArray[filterArray.length - 1]
      const lastModel = filterArray[filterArray.length - 2]

      const modelDef = await ModelDefinitions.findOne({
        modelName: lastModel,
      })

      if (modelDef.attributes[attribute].type === 'numeric') {
        filters[query] = JSON.parse(queryParams[query])
      } else if (modelDef.attributes[attribute].type === 'date') {
        const parsedObject = JSON.parse(queryParams[query])
        filters[query] = {}
        filters[query]['$gte'] = new Date(parsedObject['from'])
        filters[query]['$lte'] = new Date(parsedObject['to'])
      } else {
        if (queryParams[query].includes('[')) {
          queryParams[query] = queryParams[query].substring(
            1,
            queryParams[query].length - 1
          )

          const options = queryParams[query].split(',')
          filters[query] = []
          for (let i = 0; i < options.length; i++) {
            filters[query].push(options[i])
          }
        } else {
          filters[query] = queryParams[query]
        }
      }
    }

    return filters
  } catch (err) {
    console.log(err)
  }
}

app.listen(3456, async () => {
  await connectDB()
  await bootstrapper()
  console.log('Server is running on port 3456')
})
