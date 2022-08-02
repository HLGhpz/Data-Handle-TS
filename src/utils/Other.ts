/*
 * @Author: HLGhpz
 * @Date: 2022-07-27 17:22:17
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-07-28 14:49:30
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
import { db } from '@/models'
import { Op } from 'sequelize'

const __dirname = path.resolve()
const CategoryName = '6月-全国房价排行榜'
const PATH = 'Other'

const IMPORT_FILE_PATH = path.join(
  __dirname,
  `./src/rowData/${PATH}/${CategoryName}.csv`
)

const EXPORT_FILE_PATH = path.join(
  __dirname,
  `./distData/${PATH}/${CategoryName}.json`
)

async function other() {
  let TotalJoinRank = false
  // let foldData = _.reverse(['L14Ratio','F15T64Ratio','M65Ratio'])
  let dealData =['序号','单价','同比','环比','收入比']
  let ratioData:any = []
  let scale:any = []
  let foldData:any =  []
  // foldData= _.map(foldData, (item)=>{
  //   return `${item}Ratio`
  // })
  // foldData = _.reverse(foldData)
  let sortData:any = []

  try {
    const dv = new DataSet.View().source(
      fs.readFileSync(IMPORT_FILE_PATH, 'utf-8'),
      {
        type: 'csv'
      }
    )

    // Extraction unit and remark
    let unit = _.filter(dv.rows, (item)=>{
      return item.序号 === 'Unit'
    })[0]
    let remark = _.filter(dv.rows, (item)=>{
      return item.序号 === 'Remark'
    })[0]

    // String to Number
    let data = _.chain(dv.rows)
      .filter((item)=>{
        return item.序号 !== 'Unit' && item.序号 !== 'Remark'
      })
      .map((item) => {
        // Str2Num
        for (let kind of dealData) {
          item[kind] = +item[kind]
        }
        // CalcScale
        for (let kind of ratioData) {
          item[`${kind}Ratio`] = +(item[kind] / item[scale] * 100).toFixed(2)
        }
        // item.本科及以上Ratio = item.大学本科Ratio + item.硕士研究生Ratio + item.博士研究生Ratio
        return item
      })
      .value()




    // Data Sort
    // for (let kind of sortData) {
    //   // 国家整体数据是否参加排行
    //   if (!TotalJoinRank) {
    //     data = _.filter(data, (item)=>{
    //       return item.Country !== '总计'
    //     })
    //     // console.log('data', data)
    //   }
    //   _.chain(data).sortBy(kind).reverse().map((item,index)=>{
    //     if (kind === 'Total') {
    //       item.Index = index + 1
    //     }else {
    //       item[`${kind}Index`] = index + 1
    //     }
    //     return item
    //   }).value()
    // }

    // // Completion of the data (item.short)
    // data = await Promise.all(
    //   _.chain(data)
    //     .map(async (item) => {
    //       try {
    //         await db.Area.sync({
    //           alert: true
    //         })
    //         let res = await db.Area.findOne({
    //           where: {
    //             [Op.or]: [
    //               {
    //                 name: item.县市
    //               },{
    //                 short: item.县市
    //               }
    //             ]
    //           }
    //         })
    //         item.县市 = res.name
    //         item.编码 = res.provinceCode
    //         item.城市编码 = res.cityCode
    //       } catch (err) {
    //         item.编码 = ''
    //         item.城市编码 = ''
    //         console.log('1', item.县市)
    //       }
    //       return item
    //     })
    //     .value()
    // )

    // data = await Promise.all(
    //   _.chain(data)
    //     .map(async (item) => {
    //       try {
    //         await db.Province.sync({
    //           alert: true
    //         })
    //         let res = await db.Province.findOne({
    //           where: {
    //             code : item.编码
    //           }
    //         })
    //         item.省市 = res.short
    //       } catch (err) {
    //         item.省市 = ''
    //         console.log('2', item.县市)
    //       }
    //       return item
    //     })
    //     .value()
    // )

    data = await Promise.all(
      _.chain(data)
        .map(async (item) => {
          try {
            await db.City.sync({
              alert: true
            })
            let res = await db.City.findOne({
              where: {
                  city: {
                    [Op.like]: `${item.城市}%`
                  }
              }
            })
            item.城市 = res.city
            item.编码 = res.provinceCode
            item.省市 = res.short
          } catch (err) {
            item.编码 = ''
            item.省市 = ''
            console.log('3', item.城市)
          }
          return item
        })
        .value()
    )

    // Add unit to the data
    data.push(unit)
    data.push(remark)

    // console.log(data)
    fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(data), {
      encoding: 'utf-8',
      flag: 'w'
    })
  } catch (err) {
    console.log(err)
  }
}

export default other
