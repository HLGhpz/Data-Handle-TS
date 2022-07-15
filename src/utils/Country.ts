/*
 * @Author: HLGhpz
 * @Date: 2022-07-08 15:24:11
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-07-14 17:06:03
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
const CategoryName = '各国CPI数据'
const PATH = 'Country'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/${PATH}/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/${PATH}/${CategoryName}.json`
)

async function national() {
  let TotalJoinRank = false
  // let foldData = _.reverse(['L14Ratio','F15T64Ratio','M65Ratio'])
  let dealData =['GDP','GDP同比','GDP环比','利率','通货膨胀率','失业率','政府预算','债务','往来账户','人口']
  let ratioData:any = []
  let scale:any = []
  let foldData =  ['通货膨胀率']
  // foldData= _.map(foldData, (item)=>{
  //   return `${item}Ratio`
  // })
  // foldData = _.reverse(foldData)
  let sortData = ['通货膨胀率']

  try {
    const dv = new DataSet.View().source(
      fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
      {
        type: 'csv'
      }
    )

    // Extraction unit and remark
    let unit = _.filter(dv.rows, (item)=>{
      return item.Country === 'Unit'
    })[0]
    let remark = _.filter(dv.rows, (item)=>{
      return item.Country === 'Remark'
    })[0]

    // String to Number
    let data = _.chain(dv.rows)
      .filter((item)=>{
        return item.Country !== 'Unit' && item.Country !== 'Remark'
      })
      .map((item) => {
        // Str2Num
        for (let kind of dealData) {
          item[kind] = +item[kind]
        }
        // CalcScale
        for (let kind of ratioData) {
          item[`${kind}Ratio`] = +(item[kind] / item[scale] * 100).toFixed(2)
        }
        // item.本科及以上Ratio = item.大学本科Ratio + item.硕士研究生Ratio + item.博士研究生Ratio
        return item
      })
      .value()




    // Data Sort
    for (let kind of sortData) {
      // 国家整体数据是否参加排行
      if (!TotalJoinRank) {
        data = _.filter(data, (item)=>{
          return item.Country !== '总计'
        })
        // console.log('data', data)
      }
      _.chain(data).sortBy(kind).reverse().map((item,index)=>{
        if (kind === 'Total') {
          item.Index = index + 1
        }else {
          item[`${kind}Index`] = index + 1
        }
        return item
      }).value()
    }

    // Completion of the data (item.short)
    data = await Promise.all(
      _.chain(data)
        .map(async (item) => {
          try {
            let res = await db.Nation.findOne({
              where: {
                [Op.or]: [{
                  en: item.Country
                }, {
                  alias: item.Country
                }]
              }
            })
            item.国家 = res.zh
            item.编码 = res.short
          } catch (err) {
            item.编码= ''
            item.国家= ''
            console.log(item.Country)
          }
          return item
        })
        .value()
    )


    const dv2 = new DataSet.View().source(data).transform({
      type: 'fold',
      fields: foldData,
      key: 'Category',
      value: 'Value',
      retains: _.concat(['Country', '国家', '编码'],_.without(dealData, ...foldData), _.map(sortData, (item)=>{
        if (item === 'Total') {
          return 'Index'
        }else{
          return `${item}Index`
        }
      })
      )
    })

    // Add unit to the data
    dv2.rows.push(unit)
    dv2.rows.push(remark)

    // console.log(data)
    fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(dv2.rows), {
      encoding: 'utf-8',
      flag: 'w'
    })
  } catch (err) {
    console.log(err)
  }
}

export default national
