/*
 * @Author: HLGhpz
 * @Date: 2022-07-25 13:21:46
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-07-26 22:15:33
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
const CategoryName = '4-2  按三次产业分就业人员数 (年底数)'
const PATH = 'Time'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/${PATH}/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/${PATH}/${CategoryName}.json`
)

async function time() {
    let CountryJoinRank = true
    // let foldData = _.reverse(['L14Ratio','F15T64Ratio','M65Ratio'])
    let dealData =['就业人员','第一产业','第二产业','第三产业']
    let ratioData:any = []
    let foldData =  ['第一产业','第二产业','第三产业']
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

    // Extraction unit and remark
    let unit = _.filter(dv.rows, (item)=>{
      return item.年份 === 'Unit'
    })[0]
    let remark = _.filter(dv.rows, (item)=>{
      return item.年份 === 'Remark'
    })[0]


    // String to Number
    let data = _.chain(dv.rows)
      .filter((item)=>{
        return item.年份 !== 'Unit' && item.年份 !== 'Remark'
      })
      .map((item) => {
        // Str2Num
        for (let kind of dealData) {
          item[kind] = +item[kind]
        }
        // item.年份 = moment(item.年份,'YYYY年MM月DD日').format('YYYY-MM-DD')
        return item
      })
      .value()


    data = new DataSet.View().source(data).transform({
      type: 'fold',
      fields: foldData,
      key: 'Category',
      value: 'Value',
    })

    data = data.rows

    // Add unit to the data
    data.push(unit)
    data.push(remark)

    // console.log(data)
    fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(data), {
      encoding: 'utf-8',
      flag: 'w'
    })
  } catch (err) {
    console.log(err)
  }
}

export default time
