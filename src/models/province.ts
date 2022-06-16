/*
 * @Author: HLGhpz
 * @Date: 2022-06-16 19:32:39
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-16 19:33:55
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

function provinceModel(sequelize: any, DataTypes: any) {
  const Province = sequelize.define('Province', {
    code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    short: {
      type: DataTypes.STRING
    }
  })
  return Province
}

export { provinceModel }
