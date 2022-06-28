/*
 * @Author: HLGhpz
 * @Date: 2022-04-17 20:37:49
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-25 20:23:02
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
import { Sequelize, DataTypes } from 'sequelize'
import { config } from '@/config/config'
import { nationModel } from '@/models/nation'
import { nationCodeModel } from '@/models/nationCode'
import { provinceModel } from '@/models/province'
import { cityModel } from '@/models/city'
import { areaModel } from '@/models/area'

const sequelize = new Sequelize('', '', '', config.hlg)

const Nation = nationModel(sequelize, DataTypes)
const NationCode = nationCodeModel(sequelize, DataTypes)
const Province = provinceModel(sequelize, DataTypes)
const City = cityModel(sequelize, DataTypes)
const Area = areaModel(sequelize, DataTypes)

const db = {
  Nation,
  NationCode,
  Province,
  City,
  Area,
  sequelize,
  Sequelize
}

export { db }
