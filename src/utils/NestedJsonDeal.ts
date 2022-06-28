/*
 * @Author: HLGhpz
 * @Date: 2022-06-24 16:08:19
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-25 16:27:00
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */


import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
import { db } from '@/models'

const __dirname = path.resolve()
const CategoryName = 'area'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/utilsData/${CategoryName}.json`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/NationData/${CategoryName}.json`
)

async function nestedJsonDeal() {
  try {
    let rowData = JSON.parse(fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'))
    let temp = []
    for (let province of rowData){
      let provinceCode = province.code
      let provinceName = province.name
      for (let city of province.cityList ){
          let cityCode = city.code
          let cityName = city.name
          temp.push({
            provinceCode,
            provinceName,
            cityCode,
            cityName,
          })
      }
    }
    fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(temp), {
      encoding: 'utf-8',
      flag: 'w'
    })
  } catch (err) {
    console.log(err)
  }
}

export default nestedJsonDeal

