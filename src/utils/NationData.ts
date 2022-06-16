/*
 * @Author: HLGhpz
 * @Date: 2022-06-14 13:11:34
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-15 17:02:33
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'

const __dirname = path.resolve()
const CategoryName = 'FoodProduct'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/NationData/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/NationData/${CategoryName}.json`
)

async function nationData() {
  const foldData = []
  for (let index = 1949; index <= 2021; index++) {
    foldData.push(`${index}年`)
  }

  try {
    const dv = new DataSet.View()
      .source(fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'), {
        type: 'csv'
      })
      .transform({
        type: 'fold',
        fields: foldData,
        key: 'Year',
        value: 'Product'
      })

    let data = _.chain(dv.rows)
      .map((item) => {
        item.Product = +item.Product
        item.Year = +(item.Year.replace('年', ''))
        return item
      })
      .value()

    fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(data), {
      encoding: 'utf-8',
      flag: 'w'
    })

  } catch (err) {
    console.log(err)
  }
}

export default nationData
