/*
 * @Author: HLGhpz
 * @Date: 2022-05-10 23:39:08
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-12 11:19:45
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

async function fillNationData() {
  console.log(__dirname)
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
  const distPath = path.join(__dirname, './distData/DefenseSpend.json')
  fs.writeFileSync(distPath, JSON.stringify(rowData))
  console.log('done')
}

export default fillNationData
