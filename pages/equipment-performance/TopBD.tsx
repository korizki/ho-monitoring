import * as style from '../../misc/style'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import elstyle from '../../styles/dashboard/index.module.css'

export default function TopBDContent(props: any) {
   const { listdata, site } = props
   const [displayedData, setDisplayedData] = useState<any[]>([])
   // re-formatting data 
   const processData = (rawData: any) => {
      // formatting data for render in element
      let allType: any = _.uniq(_.map(rawData.data.listTopbd, 'type'))
      allType = allType.map((it: any) => {
         let listModel: any = _.uniq(_.map(rawData.data.listTopbd, 'model'))
         listModel = listModel.map((data: string) => {
            let filtered = rawData.data.listTopbd.filter((raw: any) => raw.model == data && raw.type == it)
            return {
               model: data,
               data: filtered,
               totalUnit: filtered.length,
               dtSch: filtered.filter((it: any) => it.dt_category == 'SCHEDULE').length,
               dtUnsch: filtered.filter((it: any) => it.dt_category == 'UNSCHEDULE').length,
               dtOther: filtered.filter((it: any) => !it.dt_category.includes('SCHEDULE')).length,
               totaleoh: _.sumBy(filtered, 'eoh')
            }
         })
         return {
            type: it,
            totaleoh: _.sumBy(listModel, 'totaleoh'),
            data: listModel.filter((it: any) => it.data.length)
         }
      })
      return allType
   }
   const generateList = (list: any, type: string) => {
      let filtered = list.filter((it: any) => it.dt_category == type)
      if (type == 'OTHER') {
         filtered = list.filter((it: any) => !it.dt_category.includes('SCHEDULE'))
      }
      let title = ''
      filtered.forEach((data: any) => title += `${data.codeNumber} - ${data.datebd} - (${data.eoh} jam) \n`)
      return title
   }
   useEffect(() => {
      let selectedSite = listdata.find((data: any) => data.site == site)
      if (selectedSite != undefined && selectedSite.data.listTopbd.length) {
         let mainData = processData(selectedSite)
         setDisplayedData(mainData)
      } else {
         setDisplayedData([])
      }
   }, [listdata, site])
   return (
      <div className={`${style.wrapTableData} p-[2em] ${elstyle.wrapbd}`}>
         { /* legend */
            displayedData.length ? (
               <div className={`w-full ${elstyle.tf}`}>
                  <LegendIcon />
               </div>
            ) : false
         }
         {/* render elemen jika list data tersedia */
            displayedData.map((it, index) => (
               <div key={index} className={`${style.outerCard} ${elstyle.outers}`} >
                  <div className={`${style.tableCard} ${elstyle.wrapTable}`}>
                     <h3 className={style.headTable}>{it.type}</h3>
                     <TableContent it={it} generateList={generateList} />
                  </div>
               </div>
            ))
         }
         { /* tampilkan pesan data tidak tersedia */
            !displayedData.length ? (
               <div className={`flex justify-center w-full flex-col items-center ${elstyle.err}`}>
                  <img src="./error.png" className="w-[35em]" />
                  <div className="text-center">
                     <h4 className="text-[2.5em] mb-3 font-semibold text-rose-600">Maaf Data Tidak Tersedia</h4>
                     <p className="text-[1.5em] text-slate-500">Silahkan ulangi pencarian <strong className="text-slate-700">Site</strong> atau <strong className="text-slate-700">Periode Tanggal</strong> berbeda.</p>
                  </div>
               </div>
            ) : false
         }
      </div>
   )
}

const TableContent = ({ it, generateList }: any) => {
   const [showDetail, setShowDetail] = useState(false)
   return (
      <table className={elstyle.mapsummary}>
         <thead>
            <tr>
               <th ><img className="inline" src="./Model.svg" width="40" /></th>
               <th ><img className="inline" src="./Quantitiy.svg" width="40" /></th>
               <th ><img className="inline" src="./MOHH.svg" width="40" /></th>
               <th ><img className="inline" src="./Downtime.svg" width="40" /></th>
               <th ><img className="inline" src="./MTBR.svg" width="40" /></th>
               <th ><img className="inline" src="./Rasio RS.svg" width="40" /></th>
            </tr>
         </thead>
         <tbody>
            {showDetail && it.data.map((row: any, index: number) => (
               <tr key={index} className="hover:bg-slate-100 cursor-pointer">
                  <td>{row.model}</td>
                  <td>{row.data.length}</td>
                  <td
                     title={generateList(row.data, 'SCHEDULE')}
                  >{row.data.filter((it: any) => it.dt_category == 'SCHEDULE').length || '-'}</td>
                  <td
                     title={generateList(row.data, 'UNSCHEDULE')}
                  >{row.data.filter((it: any) => it.dt_category == 'UNSCHEDULE').length || '-'}</td>
                  <td
                     title={generateList(row.data, 'OTHER')}
                  >{row.data.filter((it: any) => !it.dt_category.includes('SCHEDULE')).length || '-'}</td>
                  <td>{_.sumBy(row.data, 'eoh')}</td>
               </tr>
            ))}
            <tr
               className="bg-slate-700 text-white cursor-pointer"
               title="Klik untuk tampilkan detail"
               onClick={() => setShowDetail(!showDetail)}
            >
               <td className="font-semibold text-center centertext">GRAND TOTAL</td>
               <td className="font-semibold">{_.sumBy(it.data, 'totalUnit')}</td>
               <td className="font-semibold">{_.sumBy(it.data, 'dtSch')}</td>
               <td className="font-semibold">{_.sumBy(it.data, 'dtUnsch')}</td>
               <td className="font-semibold">{_.sumBy(it.data, 'dtOther')}</td>
               <td className="font-semibold">{it.totaleoh}</td>
            </tr>
         </tbody>
      </table>
   )
}
const LegendIcon = () => {
   return (
      <div className={`${style.header} ${elstyle.legends} pt-[2em] pb-[1em] justify-center`}>
         <div className="flex gap-[1em] items-center">
            <img src="./Model.svg" width="40" />
            <p className="text-[1.3em] text-slate-600 font-semibold">Model</p>
         </div>
         <div className="flex gap-[1em] items-center">
            <img src="./Quantitiy.svg" width="40" />
            <p className="text-[1.3em] text-slate-600 font-semibold">Total Unit</p>
         </div>
         <div className="flex gap-[1em] items-center">
            <img src="./MOHH.svg" width="40" />
            <p className="text-[1.3em] text-slate-600 font-semibold">BD - Schedule</p>
         </div>
         <div className="flex gap-[1em] items-center">
            <img src="./Downtime.svg" width="40" />
            <p className="text-[1.3em] text-slate-600 font-semibold">BD - Unschedule</p>
         </div>
         <div className="flex gap-[1em] items-center">
            <img src="./MTBR.svg" width="40" />
            <p className="text-[1.3em] text-slate-600 font-semibold">BD - Other</p>
         </div>
         <div className="flex gap-[1em] items-center">
            <img src="./Rasio RS.svg" width="40" />
            <p className="text-[1.3em] text-slate-600 font-semibold">Total EOH</p>
         </div>
      </div>
   )
}