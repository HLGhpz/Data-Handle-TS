/*
 * @Author: HLGhpz
 * @Date: 2022-06-16 19:37:07
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-07-13 19:54:05
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
import moment from 'moment'
import { db } from '@/models'
import { Op } from 'sequelize'

const __dirname = path.resolve()
const CategoryName = '货币汇率'
const PATH = 'Time'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/${PATH}/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/${PATH}/${CategoryName}.json`
)

async function invert() {
  let CountryJoinRank = true
  // let foldData = _.reverse(['L14Ratio','F15T64Ratio','M65Ratio'])
  let dealData =['收盘','开盘','高','低','涨跌幅']
  let ratioData:any = []
  let foldData =  ['']
  // foldData= _.map(foldData, (item)=>{
  //   return `${item}Ratio`
  // })
  // foldData = _.reverse(foldData)
  // let RetainData = ['L1000','F1000T1999','F2000T3999','F4000T5999','M6000']
  let sortData = ['']
  let scale = '合计'

  try {
    const dv = new DataSet.View().source(
      fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
      {
        type: 'csv'
      }
    )

    // String to Number
    let data = _.chain(dv.rows)
      .map((item) => {
        // Str2Num
        for (let kind of dealData) {
          item[kind] = +item[kind]
        }
        item.日期 = moment(item.日期,'YYYY年MM月DD日').format('YYYY-MM-DD')
        return item
      })
      .sortBy('日期')
      .value()

    // console.log(data)
    fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(data), {
      encoding: 'utf-8',
      flag: 'w'
    })
  } catch (err) {
    console.log(err)
  }
}

export default invert
