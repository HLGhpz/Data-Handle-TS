/*
 * @Author: HLGhpz
 * @Date: 2022-06-16 19:37:07
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-19 22:38:06
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
const CategoryName = 'ProvinceCar'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/NationData/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/NationData/${CategoryName}.json`
)

async function nationData() {
  const foldData = ['PerCapitaOther','PerCapitaCargo','PerCapitaManned']
  // for (let index = 1949; index <= 2021; index++) {
  //   foldData.push(`${index}年`)
  // }

  try {
    const dv = new DataSet.View().source(
      fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
      {
        type: 'csv'
      }
    )


    let data = _.chain(dv.rows)
      .map((item) => {
        item['Total'] = +item['Total']
        item['Population'] = +item['Population']
        item.Manned = +item.Manned
        item.Cargo = +item.Cargo
        item.Other = +item.Other
        item.PerCapita = +((item.Total / item.Population * 100).toFixed(2))
        item.PerCapitaManned = +((item.Manned / item.Population* 100).toFixed(2))
        item.PerCapitaCargo = +((item.Cargo / item.Population * 100).toFixed(2))
        item.PerCapitaOther = +((item.Other / item.Population * 100).toFixed(2))
        return item
      })
      .sortBy('PerCapita')
      .reverse()
      .map((item, index)=>{
        item.Index = index + 1
        return item
      })
      .value()

    let sumTotal = _.sumBy(data, 'Total')


    data = _.chain(data)
      .map((item) => {
        item.Scale = `${(item.Total / sumTotal * 100).toFixed(2)}%`
        return item
      }).value()

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
      value: 'Value'
    })

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
