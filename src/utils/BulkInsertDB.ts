/*
 * @Author: HLGhpz
 * @Date: 2022-05-11 23:42:11
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-11 23:48:37
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

import { db } from '@/models'
import insertData from '@/utilsData/nation.json'

async function bulkInsertDB() {
  try {
    await db.Nation.sync({ alter: true })
    await db.Nation.bulkCreate(insertData)
  } catch (err) {
    console.log('插入错误', err)
  }
}

export default bulkInsertDB
