/*
 * @Author: HLGhpz
 * @Date: 2022-07-04 14:19:13
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-07-04 20:24:55
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

import _ from 'lodash'
import fs from 'fs'
import path, { basename, extname } from 'path'
import DataSet from '@antv/data-set'
import { db } from '@/models'
import { json, Op } from 'sequelize'
import xlsx from 'node-xlsx'

const __dirname = path.resolve()
const csvForm = 'data:text/csv;charset=utf-8,'
const CategoryName = 'F0201ProvinceOutlander'
const PATH = 'CensusYearbook/Row'
const outPATH = 'CensusYearbook/Trade'

const IMPORT_FILE_DIR = path.join(
  __dirname,`./src/rowData/${PATH}`
)

const EXPORT_FILE_DIR = path.join(
  __dirname,`./src/rowData/${PATH}`
)

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/${PATH}/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/${PATH}/${CategoryName}.json`
)

async function parseXls() {
  let fileFold:any = []
  let fileTitle = ''
  fs.readdirSync(IMPORT_FILE_DIR).forEach(file => {
    fileFold.push(path.join(IMPORT_FILE_DIR, file))
  })

  _.chain(fileFold).map(item =>{
    let baseName = basename(item, extname(item))
    let workSheetFromFile = xlsx.parse(item)
    let workSheet = workSheetFromFile[0]
    let data = workSheet.data
    data = _.chain(data).filter((item: any) => {
      return item.length > 0 && Array.isArray(item)
    })
    .map((item: any, index) => {

      // if (item[0] !== undefined) {
      //   item[0] = item[0].toString().replace(/\s*/g, '')
      // }
      if (index === 0) {
        // fileTitle = baseName + item[0].toString().replace(/\d*-\d*\s*/g, '')
        fileTitle = item[0].toString().replace(/\s*/g, '')
      }
      return item
      })
    .value()


    let csvContent = data.map((item: any) => {
      return item.join(',')
    }).join('\n').replace(/ /g, '')

    fs.writeFileSync(path.join(IMPORT_FILE_DIR, fileTitle + '.csv'),csvContent, {
      encoding: 'utf-8',
      flag: 'w'
    })

    // console.log(data)

  }).value()
}

export default parseXls
