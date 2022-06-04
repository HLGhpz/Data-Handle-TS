/*
 * @Author: HLGhpz
 * @Date: 2022-06-02 15:34:26
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-02 17:22:44
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
const CategoryName = 'CowAndBuffaloMilk'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/FAO/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/FAO/${CategoryName}.json`
)
const EXPORT_FILE_PATH_OTHER = path.join(
  __dirname,
  './distData/FAO/colorMap.json'
)

const colorPlate = [
  '#C1232B',
  '#27727B',
  '#FCCE10',
  '#E87C25',
  '#B5C334',
  '#FE8463',
  '#9BCA63',
  '#FAD860',
  '#F3A43B',
  '#60C0DD',
  '#D7504B',
  '#C6E579',
  '#F4E001',
  '#F0805A',
  '#26C0C0'
]

async function faoData() {
  await db.NationCode.sync({ alert: true })
  try {
    const dv = new DataSet.View().source(
      fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
      {
        type: 'csv'
      }
    )

    let data = _.chain(dv.rows)
      .filter((item) => {
        // 筛选单位
        return item.Unit === 'tonnes'
      })
      .filter((item) => {
        // 筛选产量
        return (
          item.Value !== 0 &&
          item.Value !== '' &&
          item.Value !== '0' &&
          item.Value !== 'NA' &&
          item.Value !== '-' &&
          item.Value !== '#N/A' &&
          item.Value !== '#VALUE!' &&
          item.Value !== '#DIV/0!'
        )
      })
      .map((item) => {
        item = _.chain(item)
          .mapKeys((value, key) => {
            if (key === 'Area Code (ISO3)') return 'Code'
            else if (key === 'Area') return 'Country'
            else if (key === 'Year') return 'Year'
            else if (key === 'Value') return 'Production'
            else if (key === 'Item') return 'Type'
            else return value
          })
          .pick(['Code', 'Country', 'Year', 'Production', 'Type'])
          .value()
        item.Year = item.Year * 1
        item.Production = item.Production * 1
        return item
      })
      .filter((item) => {
        return item.Code !== 'CHN'
      })
      .map((item) => {
        if (item.Code === 'F41') {
          item.Code = 'CHN'
          item.Country = 'China'
        } else if (item.Code === 'F15') {
          // 卢森堡
          item.Code = 'LUX'
        } else if (item.Code === 'F51') {
          // 捷克斯洛伐克
          item.Code = 'OWID_CZS'
        } else if (item.Code === 'F206') {
          // 前苏丹
          item.Code = 'SDN'
        } else if (item.Code === 'F228') {
          // 苏联
          item.Code = 'OWID_USS'
        } else if (item.Code === 'F248') {
          // 南斯拉夫
          item.Code = 'OWID_YGS'
        } else if (item.Code === 'X01') {
          // 全球
          item.Code = 'OWID_WRL'
        }
        return item
      })
      .value()

    // 获取年份和国家数据
    let years: any = []
    years = _.chain(data)
      .map('Year')
      .uniq()
      .value()

    let countries = []
    countries = _.chain(data)
      .map('Code')
      .uniq()
      .value()

    _.forEach(countries, (item) => {
      _.forEach(years, (year) => {
        let temp = _.chain(data).filter({ Code: item, Year: year }).value()
        if (temp.length !== 0) {
          let productionSum = _.sumBy(temp, 'Production')
          temp.forEach((item) => {
            item.productionSum = productionSum
          })
        }
      })
    })

    // console.log('data', data)

    //选择原始数据
    let result: any = []
    _.forEach(years, (item) => {
      let temp = _.chain(data)
        .filter({ Year: item })
        .orderBy('productionSum', 'desc')
        .value()
      let tempCountry = _.chain(temp).map('Code').uniq().value().slice(0, 16)
      temp = _.chain(temp).filter((item)=>{
        return tempCountry.includes(item.Code)
      }).value()
      result.push(...temp)
    })

    // 通过数据库对数据进行补全
    result = await Promise.all(
      _.chain(result)
        .map(async (item) => {
          try {
            let res = await db.NationCode.findOne({
              where: {
                iso3Code: item.Code
              }
            })
            item.zhName = res.zhName
            item.iso2Code = res.iso2Code
          } catch (err) {
            item.zhName = ''
            item.iso2Code = ''
          }
          return item
        })
        .value()
    )

    // 选择部分有用数据
    let useData: any = []
    _.map(result, (item) => {
      useData.push(..._.values(_.pick(item, 'iso2Code')))
    })

    useData = _.uniqWith(useData, _.isEqual)

    // 确定颜色映射
    let colorMap: any = {}
    let tempIndex = 0
    _.chain(useData)
      .map((item) => {
        if (tempIndex >= colorPlate.length) {
          tempIndex = 0
        }
        if (item === 'CN') {
          colorMap[item] = '#E71B24'
        } else if (item === 'US') {
          colorMap[item] = '#000066'
        } else if (item === 'UN') {
          colorMap[item] = '#5EA4E0'
        } else {
          colorMap[item] = colorPlate[tempIndex]
          tempIndex++
        }
        return item
      })
      .value()

    fs.writeFileSync(EXPORT_FILE_PATH_OTHER, JSON.stringify(colorMap), {
      encoding: 'utf-8',
      flag: 'w'
    })

    fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(result), {
      encoding: 'utf-8',
      flag: 'w'
    })
  } catch (err) {
    console.log(err)
  }
}

export default faoData
