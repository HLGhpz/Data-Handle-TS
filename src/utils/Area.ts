/*
 * @Author: HLGhpz
 * @Date: 2022-07-15 20:46:37
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-07-15 20:58:57
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
import { db } from '@/models'
import { Op } from 'sequelize'

const __dirname = path.resolve()
const CategoryName = '中国县域统计年鉴（县市）'
const PATH = 'Other'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/${PATH}/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/${PATH}/${CategoryName}.json`
)

async function area() {
  let CountryJoinRank = true
  // let foldData = _.reverse(['L14Ratio','F15T64Ratio','M65Ratio'])
  let dealData =['行政区域面积',
  '户籍人口',
  '地区生产总值',
  '地方一般公共预算收入',
  '地方一般公共预算支出',
  '住户储蓄存款余额',
  '年末金融机构各项贷款余额',
  '规模以上工业企业',
  '普通中学在校学生',
  '小学在校学生']
  let ratioData:any = []
  let foldData:any =  []
  // foldData= _.map(foldData, (item)=>{
  //   return `${item}Ratio`
  // })
  // foldData = _.reverse(foldData)
  // let RetainData = ['L1000','F1000T1999','F2000T3999','F4000T5999','M6000']
  // let sortData = ['M6000Ratio']
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
      return item.Area === 'Unit'
    })[0]
    let remark = _.filter(dv.rows, (item)=>{
      return item.Area === 'Remark'
    })[0]

    // String to Number
    let data = _.chain(dv.rows)
      .filter((item)=>{
        return item.Area !== 'Unit' && item.Area !== 'Remark'
      })
      .map((item) => {
        for (let kind of dealData) {
          item[kind] = +item[kind]
        }
        // // CalcScale
        for (let kind of ratioData) {
          item[`${kind}Ratio`] = +(item[kind] / item[scale] * 100).toFixed(2)
        }
        item = _.pick(item, _.concat(['Area', 'Province'], dealData))
        return item
      })
      .value()


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

export default area
