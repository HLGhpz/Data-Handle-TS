/*
 * @Author: HLGhpz
 * @Date: 2022-05-11 23:42:11
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-25 20:26:58
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

import { db } from '@/models'
import insertData from '@/utilsData/area.json'

async function bulkInsertDB() {
  try {
    await db.Area.sync({ alter: true })
    await db.Area.bulkCreate(insertData)
  } catch (err) {
    console.log('插入错误', err)
  }
}

export default bulkInsertDB
