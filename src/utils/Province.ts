/*
 * @Author: HLGhpz
 * @Date: 2022-06-16 19:37:07
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-21 16:38:28
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
import { db } from '@/models'

const __dirname = path.resolve()
const CategoryName = 'ProvinceFood'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/NationData/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/NationData/${CategoryName}.json`
)

async function nationData() {
  let foldData = ['Grain','EdibleOil','VegetableAndEdibleFungi','Meat','Brid','AquaticProduct','Egg','Milk','Fruit','Sugar','CityGrain','CityEdibleOil','CityVegetableAndEdibleFungi','CityMeat','CityBrid','CityAquaticProduct','CityEgg','CityMilk','CityFruit','CitySugar','VillageGrain','VillageEdibleOil','VillageVegetableAndEdibleFungi','VillageMeat','VillageBrid','VillageAquaticProduct','VillageEgg','VillageMilk','VillageFruit','VillageSugar']
  let sortData = ['Grain','EdibleOil','VegetableAndEdibleFungi','Meat','Brid','AquaticProduct','Egg','Milk','Fruit','Sugar']

  try {
    const dv = new DataSet.View().source(
      fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
      {
        type: 'csv'
      }
    )

    // Extraction unit
    let unit = _.head(dv.rows)


    // String to Number
    let data = _.chain(dv.rows)
      .drop(1)
      .map((item) => {
        for (let kind of foldData) {
          item[kind] = +item[kind]
        }
        return item
      })
      .value()

    // Data Sort
    for (let kind of sortData) {
      _.chain(data).sortBy(kind).reverse().map((item,index)=>{
        item[`${kind}Index`] = index + 1
        return item
      }).value()
    }


    // let sumTotal = _.sumBy(data, 'Total')
    // // let sumCulturalRelic = _.sumBy(data, 'CulturalRelic')


    // // Compute percentage
    // data = _.chain(data)
    //   .map((item) => {
    //     item.Scale = `${(item.Total / sumTotal * 100).toFixed(2)}%`
    //     // item.CulturalRelicScale = `${(item.CulturalRelic / sumCulturalRelic * 100).toFixed(2)}%`
    //     return item
    //   }).value()

    // Completion of the data (item.short)
    data = await Promise.all(
      _.chain(data)
        .map(async (item) => {
          try {
            let res = await db.Province.findOne({
              where: {
                name: item.Province
              }
            })
            item.Short = res.short
          } catch (err) {
            item.Short = ''
            console.log(item.Province)
          }
          return item
        })
        .value()
    )

    const dv2 = new DataSet.View().source(data).transform({
      type: 'fold',
      fields: foldData,
      key: 'Category',
      value: 'Value',
      retains: _.concat(['Province', 'Short'], _.map(sortData, (item)=>{
        return `${item}Index`
      }))
    })

    // Add unit to the data
    dv2.rows.push(unit)

    // console.log(data)
    fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(dv2.rows), {
      encoding: 'utf-8',
      flag: 'w'
    })
  } catch (err) {
    console.log(err)
  }
}

export default nationData
