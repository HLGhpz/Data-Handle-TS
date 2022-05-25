import fs from 'fs'
import path from 'path'
import DataSet from '@antv/data-set'
import rowData from '@/rowData/Top100Athletes.json'
import tempData from '@/rowData/temp.json'

const __dirname = path.resolve()
// const IMPORT_FILE_PATH = path.join(__dirname, './src/rowData/Top100Athletes.json')
const EXPORT_FILE_PATH = path.join(__dirname, './distData/temp.json')

function HandleData() {
  const ds = new DataSet()
  const dv = ds.createView().source(rowData)
  dv.transform({
    type: 'map',
    callback: (obj, index) => {
      switch (obj.Sport) {
        case '🏀':
          obj.SportAlias = 'Basketball'
          break
        case '⚽':
          obj.SportAlias = 'Football'
          break
        case '🥊':
          obj.SportAlias = 'Boxing'
          break
        case '🎾':
          obj.SportAlias = 'Tennis'
          break
        case '🏈':
          obj.SportAlias = 'Rugby'
          break
        case '⚾':
          obj.SportAlias = 'Baseball'
          break
        case '⛳':
          obj.SportAlias = 'Goif'
          break
        case '🏎️':
          obj.SportAlias = 'Racing'
          break
        case '🥋':
          obj.SportAlias = 'MMA'
          break
        case '🏏':
          obj.SportAlias = 'Cricket'
          break
        default:
          break
      }
      obj.Country = tempData[index].toUpperCase()
      return obj
    }
  })
  fs.writeFileSync(EXPORT_FILE_PATH, JSON.stringify(dv.rows), {
    encoding: 'utf-8',
    flag: 'w'
  })
}

export default HandleData
