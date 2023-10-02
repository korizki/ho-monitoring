"use client"

import * as MyType from '../../misc/customType'
import * as style from './style'
import elstyle from '../../styles/dashboard/index.module.css'
import $ from 'jquery'
import 'daterangepicker/daterangepicker.css'
import 'daterangepicker/daterangepicker.js'
import { useState, useEffect } from 'react'
import _ from 'lodash'
import Navbar from './Navbar'
import TableDetail from './TableDetail'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faPlay, faPause } from '@fortawesome/free-solid-svg-icons'
const date = new Date().getDate()
const month = new Date().getMonth()
const year = new Date().getFullYear()
let listPeriodeYear = [
   { name: 'Januari', value: [`01/01/${year}`, `01/31/${year}`] },
   { name: 'Februari', value: [`02/01/${year}`, `02/28/${year}`] },
   { name: 'Maret', value: [`03/01/${year}`, `03/31/${year}`] },
   { name: 'April', value: [`04/01/${year}`, `04/30/${year}`] },
   { name: 'Mei', value: [`05/01/${year}`, `05/31/${year}`] },
   { name: 'Juni', value: [`06/01/${year}`, `06/30/${year}`] },
   { name: 'Juli', value: [`07/01/${year}`, `07/31/${year}`] },
   { name: 'Agustus', value: [`08/01/${year}`, `08/31/${year}`] },
   { name: 'September', value: [`09/01/${year}`, `09/30/${year}`] },
   { name: 'Oktober', value: [`10/01/${year}`, `10/31/${year}`] },
   { name: 'November', value: [`11/01/${year}`, `11/30/${year}`] },
   { name: 'Desember', value: [`12/01/${year}`, `12/31/${year}`] },
]
let startDateState = ''
let endDateState = ''
if (date < 4) {
   startDateState = new Date(listPeriodeYear[month - 1].value[0]).toLocaleDateString('fr-CA')
   endDateState = new Date(listPeriodeYear[month - 1].value[1]).toLocaleDateString('fr-CA')
} else {
   startDateState = new Date(`${year}-${month + 1}-01`).toLocaleDateString('fr-CA')
   endDateState = new Date().toLocaleDateString('fr-CA')
}
// default component
export default function Dashboard() {
   let listSite = process.env.NEXT_PUBLIC_LIST_SITE ? process.env.NEXT_PUBLIC_LIST_SITE.split(",") : []
   const [listData, setListData] = useState<MyType.DataMachine[]>([])
   const [storageData, setStorageData] = useState<MyType.DataMachine[]>([])
   const [isSubmit, setIsSubmit] = useState<Boolean>(true)
   const [indexDisplay, setIndexDisplay] = useState<any>(0)
   const [manualChange, setManualChange] = useState('')
   const [isAutoPlay, setIsAutoPlay] = useState(true)
   const [displayedData, setDisplayedData] = useState<MyType.DataMachine>({ site: '', data: [] })
   const [periode, setPeriode] = useState({
      startDate: startDateState,
      endDate: endDateState,
   })
   const [showLoading, setShowLoading] = useState(false)
   const [activeTab, setActiveTab] = useState(1)
   const getDataFromEndPoint = (listSite: string[], periode: MyType.Periode) => {
      setShowLoading(true)
      listSite.forEach((site: string, index) => {
         $.ajax({
            url: `https://api11.ppa-ho.net/v2/operation/PAUAbyModel?start=${periode.startDate}&end=${periode.endDate}&jobsite=${site}&unit=DAILY`,
            method: 'GET',
            success: (data: object[]) => {
               setListData((prev: MyType.DataMachine[]) => {
                  return [...prev, { site, data }]
               })
            },
            complete: () => {
               index == listSite.length - 1 ? setShowLoading(false) : false
            }
         })
      })
   }
   const handleUpdateIndex = (type: string, index: number, num: number) => {
      if (type == 'prev') {
         if (indexDisplay == 0) {
            setIndexDisplay(listSite.length - 1)
         } else {
            setIndexDisplay(index - num)
         }
      } else {
         if (indexDisplay > listSite.length - 2) {
            setIndexDisplay(0)
         } else {
            setIndexDisplay(index + num)
         }
      }
   }
   useEffect(() => {
      if (storageData.length == listSite.length) {
         setDisplayedData({ site: '', data: [] })
         const myInterval = setTimeout(() => handleUpdateIndex('next', indexDisplay, (!isAutoPlay ? 0 : 1)), 10000)
         if (isAutoPlay || manualChange != '') {
            setTimeout(() => {
               setDisplayedData(storageData[indexDisplay])
            }, 100)
         }
         if (!isAutoPlay) {
            clearTimeout(myInterval)
         }
      }
   }, [storageData, indexDisplay, isAutoPlay, manualChange])
   useEffect(() => {
      let listAllSite = _.uniq(_.map(listData, 'site'))
      if (listAllSite.length == listSite.length) {
         let newArr: any = listSite.map((it: any) => {
            let filtered = listData.find(data => data.site == it)
            return filtered
         })
         setStorageData(newArr)
      }
   }, [listData])
   useEffect(() => {
      if (isSubmit) {
         getDataFromEndPoint(listSite, periode)
         setIsSubmit(false)
      }
   }, [isSubmit, periode])
   return (
      <div>
         {showLoading ? (<LoadingForm />) : false}
         <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
         />
         <div className={style.header}>
            <div className={elstyle.header}>
               {
                  activeTab == 1 ? (
                     <h1>Machine Condition (Detail Site) <i className="fa-solid fa-chevron-left"></i></h1>
                  ) : activeTab == 2 ? (
                     <h1>Top Breakdown Frequency</h1>
                  ) :
                     (<h1>Machine Condition (All Site)</h1>)
               }
               <p>
                  Periode data <strong>{periode.startDate}</strong> s/d <strong>{periode.endDate}.</strong>
                  <a href="#"> Ubah Periode.</a>
               </p>
               <DatePicker setPeriode={setPeriode} setIsSubmit={setIsSubmit} list={listPeriodeYear} />
            </div>
            { /* navigasi play or pause auto play */
               activeTab == 1 ? (
                  <PlayNavigation
                     auto={isAutoPlay}
                     setPlay={setIsAutoPlay}
                  />
               ) : false
            }
            <div className={"w-[23em]"}>
               { /* menampilkan info site  */
                  activeTab != 3 && displayedData != undefined && displayedData.site != '' ?
                     (
                        <SiteIcon site={displayedData.site} />
                     ) :
                     (
                        <h1></h1>
                     )
               }
            </div>
         </div>
         {
            activeTab == 1 ? (
               <ContentDetailSite
                  displayedData={displayedData}
                  isAutoPlay={isAutoPlay}
                  indexDisplay={indexDisplay}
                  handleUpdateIndex={handleUpdateIndex}
                  setManualChange={setManualChange}
               />
            ) : false
         }

      </div >
   )
}
const DatePicker = ({ setPeriode, setIsSubmit, list }: any) => {
   const generateCustomRange = () => {
      let month = new Date().getMonth()
      let newList: any = list.slice(month > 6 ? (month - 6) : 0, month)
      let newObj: MyType.DateObject = {}
      newList.forEach((it: MyType.DateObject) => {
         Object.assign(newObj, { [it.name]: it.value })
      })
      return newObj
   }
   useEffect(() => {
      // @ts-ignore
      $('input[name="daterange"]').daterangepicker({
         opens: 'left',
         ranges: generateCustomRange(),
      }, function (start: any, end: any) {
         setPeriode({
            startDate: start.format('YYYY-MM-DD'),
            endDate: end.format('YYYY-MM-DD'),
         })
         setIsSubmit(true)
      })
   }, [])
   return (
      <div className="absolute right-0 w-[7em] bottom-[0.2em] opacity-0">
         <input name="daterange" className="cursor-pointer" />
      </div>
   )
}
const ContentDetailSite = (props: any) => {
   const { displayedData, isAutoPlay, handleUpdateIndex, indexDisplay, setManualChange } = props
   return (
      <div className={`${style.content} ${elstyle.contentcenter}`}>
         <a
            href="#"
            className={`${isAutoPlay ? 'opacity-0 z-[-1]' : 'opacity-1 z-[1]'}`}
            title="Previous Site"
            onClick={() => {
               setManualChange('lanjut')
               handleUpdateIndex('prev', indexDisplay, 1)
            }}
         >
            <FontAwesomeIcon icon={faChevronLeft} />
         </a>
         <div className={`${style.tablecenter}`}>
            <TableDetail data={displayedData} />
         </div>
         <a
            href="#"
            title="Next Site"
            className={`${isAutoPlay ? 'opacity-0 z-[-1]' : 'opacity-1 z-[1]'}`}
            onClick={() => {
               setManualChange('lanjut')
               handleUpdateIndex('next', indexDisplay, 1)
            }}
         >
            <FontAwesomeIcon icon={faChevronRight} />
         </a>
      </div>
   )
}
const SiteIcon = ({ site }: any) => {
   const getSiteName = (site: string) => {
      switch (site) {
         case "BIB":
            return 'PT. Borneo Indo Bara';
         case "BA":
            return "PT. Bukit Asam Tbk.";
         case "MHU":
            return "PT. Multi Harapan Utama";
         case "ADW":
            return "PT. Adaro Energy";
         case "SKS":
            return "PT. Surya Kalimantan Sejati";
         case "BCP":
            return "PT. Bengalon Coal Project";
         case "MLP":
            return "PT. Makmur Lestari Primatama";
         case "MIP":
            return "PT. Mustika Indah Permai.";
         case "AMI":
            return "PT. Adaro Metcoal Indonesia.";
         case "ABP":
            return "PT. Agung Bara Prima.";
         default: ''
      }
   }
   return (
      <div className={elstyle.rightcont}>
         <img src={`./logo_site/${site}.png`} />
         <div>
            <h1>SITE {site}</h1>
            <p>{getSiteName(site)}</p>
         </div>
      </div>
   )
}
const LoadingForm = () => {
   return (
      <div className={style.loading}>
         <p className="text-[3.5em] text-white loadinganimate">Preparing your data</p>
      </div>
   )
}
const PlayNavigation = (props: any) => {
   const { auto, setPlay } = props
   return (
      <div
         className={`${style.playnavigation} ${elstyle.navplay}`}
         onClick={() => setPlay(!auto)}
      >
         <a
            href="#"
            className={`p-2 text-2xl ${auto ? 'text-[#1B9C85]' : 'text-[#B70404]'}`}
         >
            <FontAwesomeIcon icon={auto ? faPause : faPlay} />
         </a>
         <div>
            <h1 className={auto ? 'text-[#1B9C85]' : 'text-[#B70404]'}>{auto ? 'Now Playing' : 'Now Focus'}</h1>
            <p>{auto ? 'Auto preview each Site' : 'Previewing one Site'}</p>
         </div>
      </div>
   )
}