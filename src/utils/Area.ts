/*
 * @Author: HLGhpz
 * @Date: 2022-06-16 19:37:07
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-26 16:12:21
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
import { db } from '@/models'
import { Op } from 'sequelize'

const __dirname = path.resolve()
const CategoryName = 'AreaPopulation'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/Area/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/Area/${CategoryName}.json`
)

async function nationData() {
  let foldData = ['Population']
  let sortData = ['Population']

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
      _.chain(data).filter((item)=>{
        return item.Area !== '全国'
      }).sortBy(kind).reverse().map((item,index)=>{
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
            let res = await db.Area.findOne({
              where: {
                name : item.Area
              }
            })
            item.ProvinceCode = res.provinceCode

            try {
              let res = await db.Province.findOne({
                where: {
                  code : item.ProvinceCode
                }
              })
              item.Short = res.short
            } catch (err) {
              console.log(item.ProvinceCode)
              item.Short = ''
            }

          } catch (err) {
            console.log(item.Area)
            item.ProvinceCode = ''
          }
          return item
        })
        .value()
    )

    // data = await Promise.all(
    //   _.chain(data)
    //     .map(async (item) => {
    //       try {
    //         let res = await db.Province.findOne({
    //           where: {
    //             code : item.ProvinceCode
    //           }
    //         })
    //         item.Short = res.short

    //       } catch (err) {
    //         console.log(item.ProvinceCode)
    //         item.Short = ''
    //       }
    //       return item
    //     })
    //     .value()
    // )

    const dv2 = new DataSet.View().source(data).transform({
      type: 'fold',
      fields: foldData,
      key: 'Category',
      value: 'Value',
      retains: _.concat(['Area', 'ProvinceCode', 'Short'], _.map(sortData, (item)=>{
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