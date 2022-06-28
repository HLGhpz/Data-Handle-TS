/*
 * @Author: HLGhpz
 * @Date: 2022-05-28 19:29:02
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-24 16:40:08
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
import { db } from '@/models'
import tempData from '@/rowData/country.json'

const __dirname = path.resolve()
const EXPORT_FILE_PATH = path.join(__dirname, './distData/temp.json')

console.log('test')
async function test() {
  await db.NationCode.sync({ alert: true })
  try {
    for (let id = 1; id <= 249; id++) {
      let res = await db.NationCode.findOne({
        where: {
          id: id
        }
      })
      // console.log(res.id)
      if (res.enName.search('zhName') != -1) {
        let temp = res.enName.replace('zhName', '')
        // console.log(temp)
        await db.NationCode.update(
          {
            enName: temp
          },
          {
            where: {
              id: id
            }
          }
        )
      }
    }
  } catch (err) {
    console.log('err', err)
  }
}

export default test
