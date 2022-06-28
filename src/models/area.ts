/*
 * @Author: HLGhpz
 * @Date: 2022-06-25 20:21:31
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-25 20:22:33
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

function areaModel(sequelize: any, DataTypes: any) {
  const Area = sequelize.define('Area', {
    code: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING
    },
    cityCode: {
      type: DataTypes.INTEGER,
    },
    provinceCode: {
      type: DataTypes.INTEGER
    }
  }, {
    timestamps: false
  })
  return Area
}

export { areaModel }

