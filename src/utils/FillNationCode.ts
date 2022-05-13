/*
 * @Author: HLGhpz
 * @Date: 2022-05-10 23:39:08
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-13 00:07:21
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
import * as fs from 'fs'
import { db } from '@/models'
import { Op } from 'sequelize'
import path from 'path'
import rowData from '@/rowData/DefenseSpend.json'

const __dirname = path.resolve()
const EXPORT_FILE_PATH = path.join(__dirname, './distData/DefenseSpend.json')

async function fillNationData() {
  await Promise.all(
    rowData.map(async (item: any) => {
      try {
        let res = await db.Nation.findOne({
          attributes: ['zh', 'en', 'short'],
          where: {
            [Op.or]: [{ en: item.Country }, { alias: item.Country }]
          }
        })
        item.Country = res.en
        item.Zh = res.dataValues.zh
        item.Short = res.dataValues.short
      } catch (err) {
        console.log('err', err)
        item.Zh = null
        item.Short = null
      }
    })
  )
  fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(rowData))
  console.log('done')
}

export default fillNationData
