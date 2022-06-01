/*
 * @Author: HLGhpz
 * @Date: 2022-05-12 23:45:48
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-01 11:39:30
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
import _ from 'lodash'

const __fileName = 'GaoKao'
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
  ).transform({
    type:'fold',
    fields:['Exam', 'Enroll'],
    key: 'type',
    value: 'value',
  })
  
  const data = _.chain(dv.rows).map((item) => {
    ;(item.Exam = item.Exam * 1), (item.Enroll = +item.Enroll)
    return item
  }).value()

  fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(data), {
    encoding: 'utf-8',
    flag: 'w'
  })
}

export default CSV2JSON
