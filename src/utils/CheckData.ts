/*
 * @Author: HLGhpz
 * @Date: 2022-05-25 21:41:28
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-25 22:30:30
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
// import rowData from '@/rowData/CityGDP.json'
import tempData from '@/rowData/temp.json'

const __dirname = path.resolve()
const IMPORT_FILE_PATH = path.join(__dirname, './src/rowData/CityGDP.csv')
const EXPORT_FILE_PATH = path.join(__dirname, './distData/temp.json')

function CheckData() {
  const ds = new DataSet()
  const dv = ds
    .createView()
    .source(fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'), {
      type: 'csv'
    })
  dv.transform({
    type: 'map',
    callback: (obj, index) => {
      obj['2021GDP'] =obj['2021GDP'] * 1
      obj['2020GDP'] =obj['2020GDP'] * 1
      obj.PerGDP = obj.PerGDP * 1
      return obj
    }
  }).transform({
    type: 'sort-by',
    fields: ['2021GDP'],
    order: 'DESC'
  }).transform({
    type: 'map',
    callback: (obj, index) => {
      obj.GDPRank = index + 1
      return obj
    }
  })
  fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(dv.rows), {
    encoding: 'utf-8',
    flag: 'w'
  })
}

export default CheckData