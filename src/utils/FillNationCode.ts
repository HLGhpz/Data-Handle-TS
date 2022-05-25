/*
 * @Author: HLGhpz
 * @Date: 2022-05-10 23:39:08
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-25 20:56:43
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
import * as fs from 'fs'
import { db } from '@/models'
import { Op } from 'sequelize'
import path from 'path'
import rowData from '@/rowData/ISOCode.json'

const __dirname = path.resolve()
const EXPORT_FILE_PATH = path.join(__dirname, './distData/DefenseSpend.json')

async function fillNationCode() {
  await db.Nation.sync({ alter: true })
  await Promise.all(
    rowData.map(async (item: any) => {
      try {
        let res = await db.Nation.findOne({
          where: {
            zh: item.zh
          }
        })
        await db.Nation.update({isoCode: item.isoCode}, {
          where: {
            id: res.id
          }
        })
      } catch (err) {
        console.log('err', err)
      }
    })
  )
  // fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(rowData))
  console.log('done')
}

export default fillNationCode
