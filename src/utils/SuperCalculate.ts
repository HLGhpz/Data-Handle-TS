/*
 * @Author: HLGhpz
 * @Date: 2022-06-04 07:58:51
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-04 08:18:35
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
const CategoryName = 'SuperCalculate'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/Other/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/Other/${CategoryName}.json`
)
const EXPORT_FILE_PATH_OTHER = path.join(
  __dirname,
  './distData/Other/colorMap.json'
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

async function superCalculate() {
  await db.Nation.sync({ alert: true })
  try {
    const dv = new DataSet.View().source(
      fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
      {
        type: 'csv'
      }
    )

    let data = _.chain(dv.rows)
      .map((item, index) => {
        item.TotalCores = Number(item.TotalCores.replace(',', ''))
        item.Rmax = Number(item.Rmax.replace(',', ''))
        item.Rpeak = Number(item.Rpeak.replace(',', ''))
        item.Rank = index + 1
        return item
      })
      .filter((item) => {
        // 筛选单位
        return item.Rank <= 100
      })
      .value()
    console.log(data)

    // 通过数据库对数据进行补全
    data = await Promise.all(
      _.chain(data)
        .map(async (item) => {
          try {
            let res = await db.Nation.findOne({
              where: {
                [Op.or]: [{ en: item.Country }, { alias: item.Country }]
              }
            })
            item.zhName = res.zh
            item.iso2Code = res.short
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
    _.map(data, (item) => {
      useData.push(..._.values(_.pick(item, 'iso2Code')))
    })
    // 去重
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

    fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(data), {
      encoding: 'utf-8',
      flag: 'w'
    })
  } catch (err) {
    console.log(err)
  }
}

export default superCalculate
