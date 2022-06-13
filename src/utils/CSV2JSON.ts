/*
 * @Author: HLGhpz
 * @Date: 2022-06-03 23:17:48
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-13 16:25:11
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
import { db } from '@/models'
import { Op } from 'sequelize'
import _ from 'lodash'

const __fileName = 'VolleyballWorldRankMen'
const __dirname = path.resolve()
const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/Other/${__fileName}.csv`
)
const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/Other/${__fileName}.json`
)

async function CSV2JSON() {
  const dv = new DataSet.View().source(
    fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
    {
      type: 'csv'
    }
  )

  let data = _.chain(dv.rows)
    .map((item, index) => {
      ;(item.Rank = +item.Rank),
        (item.WRScore = +item.WRScore),
        (item.Index = index + 1)
      return item
    })
    .value()

  // 通过数据库对数据进行补全
  let result: any = []
  await Promise.all(
    _.chain(data)
      .map(async (item) => {
        try {
          let res = await db.Nation.findOne({
            where: {
              [Op.or]: [{ en: item.NationalTeam }, { alias: item.NationalTeam }]
            }
          })
          item.zhName = res.zh
          item.iso2Code = res.short
        } catch (err) {
          item.zhName = ''
          item.iso2Code = ''
        }
        result.push(item)
        return item
      })
      .value()
  )

  result = _.sortBy(result, 'Index')

  // console.log(data)

  fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(result), {
    encoding: 'utf-8',
    flag: 'w'
  })
}

export default CSV2JSON
