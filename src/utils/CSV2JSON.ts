/*
 * @Author: HLGhpz
 * @Date: 2022-05-12 23:45:48
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-14 17:12:19
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'

const __dirname = path.resolve()
const IMPORT_FILE_PATH = path.join(__dirname, './src/rowData/USACovid.csv')
const EXPORT_FILE_PATH = path.join(__dirname, './distData/temp.json')

function CSV2JSON() {
  const dv = new DataSet.View().source(fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'), {
    type: 'csv'
  })
  fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(dv.rows), { encoding: 'utf-8', flag: 'w' })
}

export default CSV2JSON


