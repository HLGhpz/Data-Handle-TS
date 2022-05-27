/*
 * @Author: HLGhpz
 * @Date: 2022-05-27 19:57:52
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-27 22:38:55
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
const IMPORT_FILE_PATH = path.join(__dirname, './src/rowData/CerealYield.csv')
const EXPORT_FILE_PATH = path.join(__dirname, './distData/temp.json')

async function ourWorldInData() {
  await db.NationCode.sync({ alert: true })
  try {
    const dv = new DataSet.View().source(
      fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
      {
        type: 'csv'
      }
    )
    dv.transform({
      type: 'map',
      callback: function (row) {
        row.Year = row.Year * 1
        row.Cereals = row.Cereals * 1
        return row
      }
    })

    let result = []
    for (let i = 1961; i <= 2018; i++) {
      let temp = _.chain(dv.rows)
        .filter({ Year: i })
        .sortBy('Cereals')
        .map((item, index) => {
          item.rank = index + 1
          return item
        })
        .filter((item) => {
          return item.rank <= 50
        })
        .value()

      result.push(...temp)
    }
    await Promise.all(
      result.map(async (row: any) => {
        try {
          let res = await db.NationCode.findOne({
            where: {
              iso3Code: row.Code
            }
          })
          row.zhName = res.zhName
          row.iso2Code = res.iso2Code
        } catch (err) {
          // console.log('err', `${row.Entity} ${row.Code}`)
          row.zhName = ''
          row.iso2Code = ''
          // console.log(err)
        }
      })
    )
    fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(result), {
      encoding: 'utf-8',
      flag: 'w'
    })
  } catch (err) {
    // console.log(err)
  }
}

export default ourWorldInData
