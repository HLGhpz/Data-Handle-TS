/*
 * @Author: HLGhpz
 * @Date: 2022-06-25 16:45:41
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-28 22:43:32
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */

function cityModel(sequelize: any, DataTypes: any) {
  const City = sequelize.define('City', {
    provinceCode: {
      type: DataTypes.INTEGER,
    },
    short: {
      type: DataTypes.STRING
    },
    cityCode: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING
    }
  }, {
    timestamps: false
  })
  return City
}

export { cityModel }

