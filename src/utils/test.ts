/*
 * @Author: HLGhpz
 * @Date: 2022-05-28 19:29:02
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-28 19:38:54
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
/*
 * @Author: HLGhpz
 * @Date: 2022-05-27 19:57:52
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-28 17:32:28
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

async function test() {
  await db.NationCode.sync({ alert: true })
  try {
    // let res = await db.NationCode.findAll()
    // console.log('res', res)

    await Promise.all(
      _.chain(tempData)
        .map(async (item) => {
          try {
            let res = await db.NationCode.findOne({
              where: {
                iso2Code: (item.code).toUpperCase()
              }
            })
            if(!res){
              console.log(item.code)
            }
          } catch (err) {
            console.log('err', err)
          }
        })
        .value()
    )
  } catch (err) {
    console.log(err)
  }
}

export default test
