/*
 * @Author: HLGhpz
 * @Date: 2022-07-04 20:25:15
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-07-05 14:16:19
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */


import _ from 'lodash'
import fs from 'fs'
import path, { basename, extname } from 'path'
import DataSet from '@antv/data-set'
import { db } from '@/models'
import { Op } from 'sequelize'

const __dirname = path.resolve()
const CategoryName = 'F0201ProvinceOutlander'
const PATH = 'CensusYearbook/Row/csv'
const outPATH = 'CensusYearbook/Row/deal'

const IMPORT_FILE_DIR = path.join(
  __dirname,`./src/rowData/${PATH}`
)

const EXPORT_FILE_DIR = path.join(
  __dirname,`./src/rowData/${outPATH}`
)

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/${PATH}/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/${PATH}/${CategoryName}.json`
)

async function parseCsv() {
  let fileFold:any = []
  let fileTitle = ''
  fs.readdirSync(IMPORT_FILE_DIR).forEach(file => {
    fileFold.push(path.join(IMPORT_FILE_DIR, file))
  })
  _.chain(fileFold).map(item => {
    let data = fs.readFileSync(item, 'utf8')
    let dataArr = data
    // .replace(/ /g, '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    dataArr = _.chain(dataArr).filter((item: any) => {
      return item.replace(/",*/g, '').length > 0
    }).value()

    fileTitle = dataArr[0].replace(/"/g, '')
    data = dataArr.join('\n').replace(/"/g, '')

    // console.log(data)

    fs.writeFileSync(path.join(EXPORT_FILE_DIR, fileTitle + '.csv'),data, {
      encoding: 'utf-8',
      flag: 'w'
    })

  }).value()
}

export default parseCsv
