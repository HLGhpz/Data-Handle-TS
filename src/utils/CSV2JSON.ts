/*
 * @Author: HLGhpz
 * @Date: 2022-05-12 23:45:48
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-13 00:10:25
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

import csv2json from 'csv2json'
import fs from 'fs'
import path from 'path'

const __dirname = path.resolve()
const IMPORT_FILE_PATH = path.join(__dirname, './src/rowData/AsiaExport.csv')
const EXPORT_FILE_PATH = path.join(__dirname, './distData/AsiaExport.json')

function CSV2JSON() {
  fs.createReadStream(IMPORT_FILE_PATH)
  .pipe(csv2json({
    separator: ','
  }))
  .pipe(fs.createWriteStream(EXPORT_FILE_PATH))
}

export default CSV2JSON


