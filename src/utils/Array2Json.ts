/*
 * @Author: HLGhpz
 * @Date: 2022-05-13 18:46:12
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-13 20:31:26
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
import * as fs from 'fs'
import dayjs from 'dayjs'

const IMPORT_FILE_PATH = './src/rowData/Luna.json'
const EXPORT_FILE_PATH = './distData/Luna.json'

async function array2Json() {
  const rowData = JSON.parse(fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'))
  let OHLCS = [] as any[]
  rowData.map((item) => {
    let OHLC: any = {}
    OHLC.Date = dayjs(item[0]).add(1, 's').format('YYYY-MM-DD HH:mm:ss')
    OHLC.Open = item[1]
    OHLC.High = item[2]
    OHLC.Low = item[3]
    OHLC.Close = item[4]
    OHLCS.push(OHLC)
  })
  fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(OHLCS), { encoding: 'utf-8', flag: 'w' })
}

export default array2Json
