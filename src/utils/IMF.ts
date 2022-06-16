/*
 * @Author: HLGhpz
 * @Date: 2022-06-16 14:49:16
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-16 15:19:32
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
const CategoryName = 'MeanSpeed'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/Imf/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/Imf/${CategoryName}.json`
)

async function Imf() {
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
      .reverse()
      .map((item, index) => {
        item.MS = +item.MS
        item.gMS = +item.gMS
        item.aMS = +item.aMS
        item.Rank = index + 1
        return item
      })
      .value()

    data = await Promise.all(
      _.chain(data)
        .map(async (item) => {
          try {
            let res = await db.Nation.findOne({
              where: {
                [Op.or]: [{ en: item.Country }, { alias: item.Country }]
              }
            })
            item.zhName = res.zh
            item.iso2Code = res.short
          } catch (err) {
            item.zhName = ''
            item.iso2Code = ''
            console.log(item.Country)
          }
          return item
        })
        .value()
    )

    fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(data), {
      encoding: 'utf-8',
      flag: 'w'
    })
  } catch (err) {
    console.log(err)
  }
}

export default Imf
