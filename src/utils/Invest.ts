/*
 * @Author: HLGhpz
 * @Date: 2022-05-12 23:45:48
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-03 23:39:25
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
import _ from 'lodash'
import moment from 'moment'

const __fileName = 'USD_RUB'
const __dirname = path.resolve()
const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/Other/${__fileName}.csv`
)
const EXPORT_FILE_PATH = path.join(__dirname, `./distData/${__fileName}.json`)

function Invest() {
  const dv = new DataSet.View().source(
    fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
    {
      type: 'csv'
    }
  )

  const data = _.chain(dv.rows)
    .map((item) => {
      return _.chain(item)
        .mapKeys((value, key) => {
          if (key === '日期') return 'Date'
          else if (key === '收盘') return 'Close'
          else if (key === '开盘') return 'Open'
          else if (key === '高') return 'High'
          else if (key === '低') return 'Low'
          else if (key === '涨跌幅') return 'Amplitude'
          else return key
        })
        .value()
    })
    .map((item) => {
      ;(item.Close = +item.Close),
        (item.Open = +item.Open),
        (item.High = +item.High),
        (item.Low = +item.Low)
      return item
    })
    .value()
  console.log(data)

  fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(data), {
    encoding: 'utf-8',
    flag: 'w'
  })
}

export default Invest
