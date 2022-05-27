/*
 * @Author: HLGhpz
 * @Date: 2022-04-17 20:37:49
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-11 00:00:25
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
import { Sequelize, DataTypes } from 'sequelize'
import { config } from '@/config/config'
import { nationModel } from '@/models/nation'
import { nationCodeModel } from '@/models/nationCode'

const sequelize = new Sequelize('', '', '', config.hlg)

const Nation = nationModel(sequelize, DataTypes)
const NationCode = nationCodeModel(sequelize, DataTypes)

const db = {
  Nation,
  NationCode,
  sequelize,
  Sequelize
}

export { db }
