import { useEffect, useState } from 'react'
import * as style from './style'
import elstyle from '../../styles/dashboard/index.module.css'
import _ from 'lodash'
interface ListData {
   type?: string
}

export default function TableDetail({ data }: any) {
   const [listUnitType, setListUnitType] = useState<any[]>([])
   const [listDisplayedData, setListDisplayedData] = useState<object[]>([])
   const processData = (data: any) => {
      let listUnitType = _.uniq(data.data.map((it: any) => it.total_unit > 0 ? it.type : ''))
      listUnitType = listUnitType.filter(it => it != '')
      setListUnitType(listUnitType)
      let dataDisplayed = listUnitType.map(type => {
         return {
            type,
            data: data.data.filter((it: ListData) => it.type == type)
         }
      })
      setListDisplayedData(dataDisplayed)
   }
   useEffect(() => {
      // console.log(data)
      if (data != undefined) {
         processData(data)
      }
   }, [data])
   return (
      <div className={`${style.wrapTableData}`}>
         {
            listUnitType.map((type, index) => (
               <div key={index} className={`${style.outerCard} `} >
                  <div className={`${style.tableCard} ${elstyle.wrapTable}`}>
                     <h3 className={style.headTable}>{type}</h3>
                     <table className={elstyle.mapsummary}>
                        <thead>
                           <tr>
                              <th title="Model"><img src="./Model.svg" width="50" /></th>
                              <th title="Quantity"><img src="./Quantitiy.svg" width="50" /></th>
                              <th title="MOHH"><img src="./MOHH.svg" width="50" /></th>
                              <th title="Downtime"><img src="./Downtime.svg" width="50" /></th>
                              <th title="Rasio BS"><img src="./Rasio RS.svg" width="50" /></th>
                              <th title="MTTR"><img src="./MTTR.svg" width="50" /></th>
                              <th title="MTBF"><img src="./MTBR.svg" width="50" /></th>
                              <th title="PA"><img src="./PA.svg" width="50" /></th>
                           </tr>
                        </thead>
                        <TableBody data={listDisplayedData} type={type} />
                     </table>
                  </div>
               </div>
            ))
         }
      </div>
   )
}

const TableBody = (props: any) => {
   const { data, type } = props
   const [showDetail, setShowDetail] = useState<boolean>(false)
   // get total value
   const getTotal = (data: any, unit: string, dataType: string) => {
      let filtered = data.find((it: any) => it.type == unit)
      if (dataType == 'mttr') {
         let countOnFormula = _.sumBy(filtered.data, 'dt_unsch') / _.sumBy(filtered.data, 'freq_unsch')
         return isNaN(countOnFormula) ? 0 : countOnFormula.toLocaleString('id-ID', { maximumFractionDigits: 2 })
      } else if (dataType == 'mtbf') {
         let countOnFormula = _.sumBy(filtered.data, 'hm_opr') / _.sumBy(filtered.data, 'freq_unsch')
         return isNaN(countOnFormula) ? 0 : countOnFormula.toLocaleString('id-ID', { maximumFractionDigits: 2 })
      } else if (dataType == 'pa') {
         let countOnFormula = (_.sumBy(filtered.data, 'mohh') - _.sumBy(filtered.data, 'dt_all')) / _.sumBy(filtered.data, 'mohh') * 100
         return countOnFormula.toFixed(2)
      } else if (dataType == 'rasio') {
         let countOnFormula = _.sumBy(filtered.data, 'dt_sch') / (_.sumBy(filtered.data, 'dt_all')) * 100
         return isNaN(countOnFormula) ? 0 : countOnFormula.toFixed(2)
      }
      return (_.sumBy(filtered.data, dataType)).toLocaleString('id-ID')
   }
   return (
      <tbody onClick={() => setShowDetail(!showDetail)}>
         {data.filter((it: any) => it.type == type)[0].data.map((row: any, index: number) => {
            if (row.total_unit != 0 && showDetail) {
               return (
                  <tr className="hover:bg-slate-100" key={index}>
                     <td >{row.model}</td>
                     <td>{row.total_unit}</td>
                     <td>{row.mohh.toLocaleString('id-ID')}</td>
                     <td>{(row.dt_unsch + row.dt_sch).toFixed(2)}</td>
                     <td>{(row.dt_sch / row.dt_all * 100).toFixed(2)}</td>
                     <td>{row.mttr}</td>
                     <td>{row.mtbf}</td>
                     <td>{row.pa}</td>
                  </tr>
               )
            }
         })}
         <tr className="bg-slate-700 text-white cursor-pointer hover:bg-slate-700" title="Tampilkan detail">
            <td>TOTAL</td>
            <td>{getTotal(data, type, 'total_unit')}</td>
            <td>{getTotal(data, type, 'mohh')}</td>
            <td>{getTotal(data, type, 'dt_all')}</td>
            <td>{getTotal(data, type, 'rasio')}</td>
            <td>{getTotal(data, type, 'mttr')}</td>
            <td>{getTotal(data, type, 'mtbf')}</td>
            <td>{getTotal(data, type, 'pa')}</td>
         </tr>
      </tbody>
   )
}