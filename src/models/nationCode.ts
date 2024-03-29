/*
 * @Author: HLGhpz
 * @Date: 2022-05-27 21:00:58
 * @LastEditors: HLGhpz
 * @LastEditTime: 2022-06-02 21:15:15
 * @Description:
 *
 * Copyright (c) 2022 by HLGhpz, All Rights Reserved.
 */
function nationCodeModel(sequelize: any, DataTypes: any) {
  const NationCode = sequelize.define('NationCode', {
    enName: {
      type: DataTypes.STRING,
    },
    iso2Code: {
      type: DataTypes.STRING
    },
    iso3Code: {
      type: DataTypes.STRING
    },
    m49Code: {
      type: DataTypes.INTEGER
    },
    isoNumber: {
      type: DataTypes.INTEGER
    },
    iso2: {
      type: DataTypes.STRING
    },
    zhName: {
      type: DataTypes.STRING
    },
  })
  return NationCode
}

export { nationCodeModel }
