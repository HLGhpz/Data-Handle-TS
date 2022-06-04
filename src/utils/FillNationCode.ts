/*
 * @Author: HLGhpz
 * @Date: 2022-05-10 23:39:08
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-02 21:45:03
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
import * as fs from 'fs'
import { db } from '@/models'
import { Op } from 'sequelize'
import path from 'path'
import DataSet from '@antv/data-set'
import _ from 'lodash'
// import rowData from '@/rowData/ISOCode.json'

const __dirname = path.resolve()
const IMPORT_FILE_PATH = path.join(__dirname, './src/utilsData/countryCode.csv')
const EXPORT_FILE_PATH = path.join(__dirname, './distData/DefenseSpend.json')

async function fillNationCode() {
  await db.NationCode.sync({ alter: true })
  const dv = new DataSet.View().source(
    fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
    {
      type: 'csv'
    }
  )
  await Promise.all(
    _.chain(dv.rows)
      .map((item) => {
        return _.pick(item, ['M49Code', 'ISO3Code'])
      })
      .filter((item) => {
        return item['ISO3Code'] !== ''
      })
      .uniqWith(_.isEqual)
      .map(async (item: any) => {
        console.log(item)
        try {
          let res = await db.NationCode.findOne({
            where: {
              iso3Code: item['ISO3Code']
            }
          })
          await db.NationCode.update(
            {
              m49Code: item['M49Code'] * 1
            },
            {
              where: {
                iso3Code: item['ISO3Code']
              }
            }
          )
        } catch (err) {
          console.log('item', item)
        }
      })
      .value()
  )
}
export default fillNationCode
