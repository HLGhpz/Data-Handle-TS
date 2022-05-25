/*
 * @Author: HLGhpz
 * @Date: 2022-04-29 13:52:51
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-05-25 20:43:31
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

function nationModel(sequelize: any, DataTypes: any) {
  const Nation = sequelize.define('Nation', {
    en: {
      type: DataTypes.STRING,
      allowNull: false
    },
    alias: {
      type: DataTypes.STRING
    },
    zh: {
      type: DataTypes.STRING
    },
    short: {
      type: DataTypes.STRING
    },
    code: {
      type: DataTypes.INTEGER
    },
    isoCode: {
      type: DataTypes.STRING
    },
    time: {
      type: DataTypes.INTEGER
    },
  })
  return Nation
}

export { nationModel }
