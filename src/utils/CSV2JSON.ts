/*
 * @Author: HLGhpz
 * @Date: 2022-05-12 23:45:48
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-26 19:05:19
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'

const __dirname = path.resolve()
const IMPORT_FILE_PATH = path.join(
  __dirname,
  './src/rowData/ProvincePopulation.csv'
)
const EXPORT_FILE_PATH = path.join(__dirname, './distData/temp.json')

function CSV2JSON() {
  const dv = new DataSet.View().source(
    fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
    {
      type: 'csv'
    }
  )
  dv.transform({
    type: 'map',
    callback: (obj, index) => {
      ;(obj['2020Year'] = obj['2020Year'] * 1),
        (obj['2021Year'] = obj['2021Year'] * 1),
        (obj.Incremental = obj.Incremental * 1)
      return obj
    }
  })
    .transform({
      type: 'sort-by',
      fields: ['2021Year'],
      order: 'DESC'
    })
    .transform({
      type: 'map',
      callback: (obj, index) => {
        obj.Index = index + 1
        return obj
      }
    })
  fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(dv.rows), {
    encoding: 'utf-8',
    flag: 'w'
  })
}

export default CSV2JSON
