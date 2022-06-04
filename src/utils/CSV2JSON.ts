/*
 * @Author: HLGhpz
 * @Date: 2022-06-03 23:17:48
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-03 23:21:46
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */


import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
import _, { values } from 'lodash'

const __fileName = 'USD_RUB'
const __dirname = path.resolve()
const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/Other/${__fileName}.csv`
)
const EXPORT_FILE_PATH = path.join(__dirname, `./distData/${__fileName}.json`)

function CSV2JSON() {
  const dv = new DataSet.View().source(
    fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
    {
      type: 'csv'
    }
  )

  const data = _.chain(dv.rows)
    .mapKeys((value, key) => {
      if (key === '日期') return 'Date'
      else if (key === '收盘') return 'Close'
      else if (key === '开盘') return 'Open'
      else if (key === '高') return 'High'
      else if (key === '低') return 'Low'
      else if (key === '涨跌幅') return 'Amplitude'
      else return value
    })
    .map((item) => {
      ;(item.Exam = item.Exam * 1), (item.Enroll = +item.Enroll)
      return item
    })
    .value()

  fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(data), {
    encoding: 'utf-8',
    flag: 'w'
  })
}

export default CSV2JSON
