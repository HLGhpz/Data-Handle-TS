/*
 * @Author: HLGhpz
 * @Date: 2022-06-16 19:37:07
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-16 19:48:52
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
const CategoryName = 'ProvinceGDP'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/NationData/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/NationData/${CategoryName}.json`
)

async function nationData() {
  const foldData = ['FirstIndustry', 'SecondIndustry', 'ThirdIndustry']
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
    // .transform({
    //   type: 'fold',
    //   fields: foldData,
    //   key: 'Year',
    //   value: 'Product'
    // })

    let data = _.chain(dv.rows)
      .map((item) => {
        item.FirstIndustry = +item.FirstIndustry
        item.SecondIndustry = +item.SecondIndustry
        item.ThirdIndustry = +item.ThirdIndustry
        item.GDP = +item.GDP
        return item
      })
      .sortBy('GDP', 'desc')
      .map((item, index)=>{
        item.Index = index + 1
        return item
      })
      .value()

    data = await Promise.all(
      _.chain(data)
        .map(async (item) => {
          try {
            let res = await db.Province.findOne({
              where: {
                name: item.Province
              }
            })
            item.short = res.short
          } catch (err) {
            item.short = ''
            console.log(item.Province)
          }
          return item
        })
        .value()
    )

    console.log(data)
    // fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(data), {
    //   encoding: 'utf-8',
    //   flag: 'w'
    // })
  } catch (err) {
    console.log(err)
  }
}

export default nationData
