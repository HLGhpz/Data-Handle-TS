/*
 * @Author: HLGhpz
 * @Date: 2022-05-15 21:29:59
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-16 00:03:49
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

import DataSet from '@antv/data-set'
import dayjs from 'dayjs'
import weekday from 'dayjs/plugin/weekday'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import isoWeek from 'dayjs/plugin/isoWeek'
import dayOfYear from 'dayjs/plugin/dayOfYear'
import 'dayjs/locale/zh-cn'
import rowData from '@/rowData/USACovid.json'
import * as path from 'path'
import * as fs from 'fs'

const __dirname = path.resolve()
const EXPORT_FILE_PATH = path.join(__dirname, './distData/temp.json')
const temp = [
  0, 1, 5358, 60800, 41518, 19705, 26512, 28843, 23155, 24276, 39060, 80710,
  96331, 65321, 36695, 23748, 18183, 10474, 8748, 27985, 58826, 47610, 34384,
  46061, 62407, 61378, 32838, 12738, 5853
]
let count = 0

dayjs.locale('zh-cn')
dayjs.extend(weekOfYear)
dayjs.extend(isoWeek)
dayjs.extend(dayOfYear)
dayjs.extend(weekday)

/**
 * @description:图表的原始数据处理
 * @param {*} option
 * @return {*}
 */
function handleData() {
  const ds = new DataSet()
  const dv = ds.createView().source(rowData)
  dv.transform({
    type: 'map',
    callback: (obj) => {
      obj.year = dayjs(obj.Date).year()
      obj.month = dayjs(obj.Date).month()
      obj.monthAlias = dayjs(obj.Date).format('MMMM')
      // 一周中的第几天 0-6
      obj.dayOfWeek = dayjs(obj.Date).weekday()
      // 一年中的第几天
      obj.dayOfYear = dayjs(obj.Date).dayOfYear()
      // 一个月的第几周
      obj.weekOfMonth = getMonthWeek(obj.Date)
      // 一年的第几周
      obj.weekOfYear = dayjs(obj.Date).isoWeek()
      return obj
    }
  })
    .transform({
      type: 'map',
      callback: (obj) => {
        if (dayjs(obj.Date).date() === dayjs(obj.Date).daysInMonth()) {
          obj.monthDeaths = temp[count++]
        }
        return obj
      }
    })
    // .transform({
    //   type: 'aggregate',
    //   fields: ['NewDeaths'],
    //   operations: ['sum'],
    //   as: ['monthDeaths'],
    //   groupBy: ['month', 'year']
    // })
  // .transform({
  //   type: 'filter',
  //   callback: (obj) => {
  //     return obj.year === 2021
  //   }
  // })

  fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(dv.rows), {
    encoding: 'utf-8',
    flag: 'w'
  })
}

/**
 * @description:获取月份的第几周
 * @param {*} option
 * @return {*}
 */
function getMonthWeek(date) {
  const year = dayjs(date).year()
  const month = dayjs(date).month()
  const monthFirstDay = new Date(year, month, 1)
  const intervalDays = Math.round(
    (dayjs(date).valueOf() - dayjs(monthFirstDay).valueOf()) / 86400000
  )
  const index = Math.floor((intervalDays + dayjs(monthFirstDay).weekday()) / 7)
  return index
}

export default handleData
