/*
 * @Author: HLGhpz
 * @Date: 2022-04-17 20:37:49
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-04-18 14:44:11
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
// const path = require('path')
// const sqlite3 = require('sqlite3').verbose()

import path from 'path'
import sqlite3 from 'sqlite3'

const __dirname = path.resolve()
sqlite3.verbose()

export const config = {
  hlg: {
    storage: path.join(__dirname, './src/db/dataHandle.sqlite3'),
    host: 'localhost',
    dialect: 'sqlite',
    dialectModule: sqlite3,
    logging: false
  }
}
