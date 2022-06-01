/*
 * @Author: HLGhpz
 * @Date: 2022-05-30 13:30:33
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-01 11:35:34
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

import _, { keys } from 'lodash'
import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
import { db } from '@/models'

const __dirname = path.resolve()
const CategoryName = 'Pineapple'

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
      .filter((item)=>{
        // 筛选单位
        return item.Unit === 'tonnes'
      })
      .map((item) => {
        item = _.chain(item)
          .mapKeys((value, key) => {
            if (key === 'Area Code (ISO3)') return 'Code'
            else if (key === 'Area') return 'Country'
            else if (key === 'Year') return 'Year'
            else if (key === 'Value') return 'Production'
            else return value
          })
          .pick(['Code', 'Country', 'Year', 'Production'])
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

    //选择原始数据
    let result = []
    for (let i = 1961; i <= 2020; i++) {
      let temp = _.chain(data)
        .filter({ Year: i })
        .orderBy('Production', 'desc')
        .map((item, index) => {
          item.rank = index
          return item
        })
        .filter((item) => {
          return item.rank <= 15
        })
        .value()

      result.push(...temp)
    }

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
    // console.log(useData)
    // // 去重
    useData = _.uniqWith(useData, _.isEqual)
    // console.log(useData)

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
