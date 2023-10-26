import * as style from '../../misc/style'
import _ from 'lodash'
import { useEffect, useState } from 'react'
import elstyle from '../../styles/dashboard/index.module.css'

export default function TopBDContent(props: any) {
   const { listdata, site, refresh, allSite } = props
   const [displayedData, setDisplayedData] = useState<any[]>([])
   // re-formatting data 
   const processData = (rawData: any) => {
      // formatting data for render in element
      let allType: any = _.uniq(_.map(rawData.data.listTopbd, 'type'))
      allType = allType.map((it: any) => {
         return {
            type: it,
            data: rawData.data.listTopbd.filter((type: any) => type.type == it)
         }
      })
      allType = allType.sort((a: any, b: any) => b.data.length > a.data.length ? -1 : 1)
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
   useEffect(() => {
      const reload = setTimeout(() => refresh(allSite), 15000)
      return () => clearTimeout(reload)
   }, [])
   return (
      <div className={`${style.wrapTableData} p-[2em] ${elstyle.wrapbd}`}>
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
                  <img src="./Launch.webp" className="w-[25em]" />
                  <div className="text-center mt-[2em]">
                     <h4 className="text-[2.5em] mt-2 mb-3 font-semibold">Everything Looks Good</h4>
                     <p className="text-[1.5em] text-slate-500">Tidak ada Unit dengan durasi <strong className="text-slate-700">Breakdown yang lama</strong>.</p>
                  </div>
               </div>
            ) : false
         }
      </div>
   )
}

const TableContent = ({ it, generateList }: any) => {
   const [showDetail, setShowDetail] = useState(true)
   return (
      <table className={elstyle.mapsummary}>
         <thead>
            <tr>
               <th >CN</th>
               <th >Model</th>
               <th >Category</th>
               <th >Downtime</th>
            </tr>
         </thead>
         <tbody>
            {showDetail && it.data.map((row: any, index: number) => (
               <tr key={index} className="hover:bg-slate-100 cursor-pointer">
                  <td>{row.codeNumber}</td>
                  <td>{row.model}</td>
                  <td>{row.dt_category}</td>
                  <td>{row.eoh}</td>
               </tr>
            ))}
            <tr
               className="bg-slate-700 text-white cursor-pointer"
               title="Klik untuk tampilkan detail"
               onClick={() => setShowDetail(!showDetail)}
            >
               <td colSpan={3} className="font-semibold text-center centertext">GRAND TOTAL</td>
               <td className="font-semibold">{_.sumBy(it.data, 'eoh')}</td>
            </tr>
         </tbody>
      </table>
   )
}