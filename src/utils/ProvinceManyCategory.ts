/*
 * @Author: HLGhpz
 * @Date: 2022-06-21 16:41:59
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-21 17:27:18
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

    // // Data Sort
    // for (let kind of sortData) {
    //   _.chain(data).sortBy(kind).reverse().map((item,index)=>{
    //     item[`${kind}Index`] = index + 1
    //     return item
    //   }).value()
    // }


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

    // // Data Sort
    // for (let kind of sortData) {
    //   _.chain(data).filter(item=>{
    //     return item.Short !== ''
    //   }).sortBy(kind).reverse().map((item,index)=>{
    //     item[`${kind}Index`] = index + 1
    //     return item
    //   }).value()
    // }

    console.log(data)

    const dv2 = new DataSet.View().source(data).transform({
      type: 'fold',
      fields: foldData,
      key: 'Category',
      value: 'Value',
      retains: ['Province', 'Short']
    })

    // console.log(dv2.rows)

    let result = []
    for (let kind of sortData) {
      let temp = _.chain(dv2.rows).filter(item=>{
        return _.includes(item.Category, kind)
      })
      .value()
      let temp2 = _.chain(temp).filter(item=>{
        return item.Category === kind
      }).sortBy(kind).reverse().map((item,index)=>{
        item[`Index`] = index + 1
        return item
      }).value()

      for (let item1 of temp2){
        _.chain(temp).filter(item2=>{item2.Short === item1.Short}).map((item2)=>{
          item2[`Index`] = item1[`Index`]
          return item2
        }).value()
      }
      result.push(temp)
    }


    // // Add unit to the data
    result.push(unit)

    // // console.log(data)
    // fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(result), {
    //   encoding: 'utf-8',
    //   flag: 'w'
    // })
  } catch (err) {
    console.log(err)
  }
}

export default nationData
