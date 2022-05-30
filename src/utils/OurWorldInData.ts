/*
 * @Author: HLGhpz
 * @Date: 2022-05-27 19:57:52
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-28 21:58:47
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
import { db } from '@/models'
// import rowData from '@/rowData/CerealYield.csv'
// import tempData from '@/rowData/temp.json'

const __dirname = path.resolve()
const IMPORT_FILE_PATH = path.join(
  __dirname,
  './src/rowData/BeefProduction.csv'
)
const EXPORT_FILE_PATH = path.join(__dirname, './distData/temp.json')
const EXPORT_FILE_PATH_OTHER = path.join(__dirname, './distData/other.json')

async function ourWorldInData() {
  await db.NationCode.sync({ alert: true })
  try {
    const dv = new DataSet.View().source(
      fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
      {
        type: 'csv'
      }
    )

    let data = _.map(dv.rows, (item) => {
      item.Year = item.Year * 1
      item.Production = item.Production * 1
      return item
    })

    //选择原始数据
    let result = []
    for (let i = 1961; i <= 2018; i++) {
      let temp = _.chain(data)
        .filter({ Year: i })
        .orderBy('Production', 'desc')
        .map((item, index) => {
          item.rank = index
          return item
        })
        .filter((item) => {
          return item.rank <= 20
        })
        .value()

      result.push(...temp)
    }

    // 通过数据库对数据进行补全
    result = await Promise.all(
      _.chain(result)
        .map(async (item) => {
          try {
            let res = await db.NationCode.findOne({
              where: {
                iso3Code: item.Code
              }
            })
            item.zhName = res.zhName
            item.iso2Code = res.iso2Code
          } catch (err) {
            item.zhName = ''
            item.iso2Code = ''
          }
          return item
        })
        .value()
    )

    // 选择部分有用数据
    let useData: any = []
    _.map(result, (item) => {
      useData.push(_.values(_.pick(item, ['iso2Code'])))
    })

    useData = _.uniqWith(useData, _.isEqual)
    fs.writeFileSync(EXPORT_FILE_PATH_OTHER, JSON.stringify(useData), {
      encoding: 'utf-8',
      flag: 'w'
    })

    fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(result), {
      encoding: 'utf-8',
      flag: 'w'
    })
  } catch (err) {
    console.log(err)
  }
}

export default ourWorldInData
