/*
 * @Author: HLGhpz
 * @Date: 2022-06-16 19:37:07
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-07-04 13:53:46
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
const CategoryName = 'F0201ProvinceOutlander'
const PATH = 'CensusYearbook/Original'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/${PATH}/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/${PATH}/${CategoryName}.json`
)

async function nationData() {
  let CountryJoinRank = false
  // let foldData = _.reverse(['L14Ratio','F15T64Ratio','M65Ratio'])
  let dealData =['Total','HK','Macao','Taiwan','Foreign']
  let ratioData:any = []
  let foldData =  ['Foreign']
  // foldData= _.map(foldData, (item)=>{
  //   return `${item}Ratio`
  // })
  // foldData = _.reverse(foldData)
  let sortData = ['Foreign']

  try {
    const dv = new DataSet.View().source(
      fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
      {
        type: 'csv'
      }
    )

    // Extraction unit and remark
    let unit = _.filter(dv.rows, (item)=>{
      return item.Province === 'Unit'
    })[0]
    let remark = _.filter(dv.rows, (item)=>{
      return item.Province === 'Remark'
    })[0]

    // String to Number
    let data = _.chain(dv.rows)
      .filter((item)=>{
        return item.Province !== 'Unit' && item.Province !== 'Remark'
      })
      .map((item) => {
        // Str2Num
        for (let kind of dealData) {
          item[kind] = +item[kind]
        }
        // // CalcScale
        for (let kind of ratioData) {
          item[`${kind}Ratio`] = +(item[kind] / item['Total'] * 100).toFixed(2)
        }

        return item
      })
      .value()


    // Data Sort
    for (let kind of sortData) {
      // 国家整体数据是否参加排行
      if (!CountryJoinRank) {
        data = _.filter(data, (item)=>{
          return item.Province !== '全国'
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


    // let sumTotal = _.sumBy(data, 'Total')
    // // let sumCulturalRelic = _.sumBy(data, 'CulturalRelic')


    // // Compute percentage
    // data = _.chain(data)
    //   .map((item) => {
    //     item.Scale = `${(item.Total / sumTotal * 100).toFixed(2)}%`
    //     // item.CulturalRelicScale = `${(item.CulturalRelic / sumCulturalRelic * 100).toFixed(2)}%`
    //     return item
    //   }).value()

    // Completion of the data (item.short)
    data = await Promise.all(
      _.chain(data)
        .map(async (item) => {
          try {
            let res = await db.Province.findOne({
              where: {
                [Op.or]: [{
                  name: item.Province
                }, {
                  short: item.Province
                }]
              }
            })
            item.Short = res.short
            item.ProvinceCode = res.code
          } catch (err) {
            item.ProvinceCode = ''
            console.log(item.ProvinceCode)
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
      retains: _.concat(['ProvinceCode', 'Short'],_.without(dealData, ...foldData), _.map(sortData, (item)=>{
        if (item === 'Total') {
          return 'Index'
        }else{
          return `${item}Index`
        }
      })
      // , _.map(ratioData, (item)=>{
      //   return `${item}Ratio`
      // })
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

export default nationData
