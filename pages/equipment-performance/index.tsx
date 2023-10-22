"use client"

import * as MyType from '../../misc/customType'
import * as style from '../../misc/style'
import elstyle from '../../styles/dashboard/index.module.css'
import $ from 'jquery'
import 'daterangepicker/daterangepicker.css'
import 'daterangepicker/daterangepicker.js'
import Head from 'next/head'
import { useState, useEffect } from 'react'
import _ from 'lodash'
import Navbar from './Navbar'
import SiteIcon from './SiteIcon'
import TopBDContent from './TopBD'
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
   // endDateState = '2023-10-06'
}
// default component
export default function Dashboard() {
   let listSite = process.env.NEXT_PUBLIC_LIST_SITE ? process.env.NEXT_PUBLIC_LIST_SITE.split(",") : []
   // state tab detail / tab 1
   const [listData, setListData] = useState<MyType.DataMachine[]>([])
   const [storageData, setStorageData] = useState<MyType.DataMachine[]>([])
   const [displayedData, setDisplayedData] = useState<MyType.DataMachine>({ site: '', data: [] })
   const [lastDisplayedData, setLastDisplayedData] = useState({ site: '', data: [] })
   const [isSubmit, setIsSubmit] = useState<Boolean>(true)
   // state tab top bd frequent / tab 2
   const [listDataTopBD, setListDataTopBD] = useState<any>([])
   const [storageDataTopBD, setStorageDataTopBD] = useState<MyType.DataTopBD[]>([])
   const [selectedSiteTopBD, setSelectedSiteTopBD] = useState('MHU')
   // other state
   const [indexDisplay, setIndexDisplay] = useState<any>(0)
   const [manualChange, setManualChange] = useState('')
   const [isAutoPlay, setIsAutoPlay] = useState(true)
   const [periode, setPeriode] = useState({
      startDate: startDateState,
      endDate: endDateState,
   })
   const [showLoading, setShowLoading] = useState(false)
   const [activeTab, setActiveTab] = useState(1)
   // get data detail machine condition each site
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
   // get data top Breakdown frequent
   const getDataTopBD = (listSite: string[], periode: MyType.Periode) => {
      listSite.forEach((it: string) => {
         let site = it == 'ABP' ? 'amm-abp.net' : `ppa-${it.toLowerCase()}.net`
         $.ajax({
            url: `https://api22.${site}/v1/bd/topBreakdown?startDate=${periode.startDate}&endDate=${periode.endDate}`,
            method: 'GET',
            success: data => {
               setListDataTopBD((prev: MyType.DataTopBD[]) => {
                  if (prev.length) {
                     let filtered = prev.filter((it: any) => it.site != site)
                     return [...filtered, { site: it, data: data.data }]
                  }
                  return [{ site: it, data: data.data }]
               })
            }
         })
      })
   }
   // handle on change index displaying Site Detail Machine Condition
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
   const updateDataDisplayed = (storageData: any, indexDisplay: number, play: boolean, manual: string) => {
      if (play || manual != '') {
         setDisplayedData(storageData[indexDisplay])
         setLastDisplayedData(storageData[indexDisplay])
      }
   }
   useEffect(() => {
      if (storageData.length == listSite.length) {
         setDisplayedData({ site: '', data: [] })
         if (isAutoPlay || manualChange != '') {
            setManualChange('')
            setTimeout(() => { updateDataDisplayed(storageData, indexDisplay, isAutoPlay, manualChange) }, 100)
            setTimeout(() => handleUpdateIndex('next', indexDisplay, (!isAutoPlay ? 0 : 1)), 20000)
         }
      }
   }, [storageData, indexDisplay, isAutoPlay, manualChange])
   useEffect(() => {
      let listDataSite: any = _.uniq(_.map(listDataTopBD, 'site'))
      listDataSite = listDataSite.map((it: string) => {
         let filtered: any = listDataTopBD.filter((data: MyType.DataTopBD) => data.site == it)
         return filtered[filtered.length - 1]
      })
      setStorageDataTopBD(listDataSite)
   }, [listDataTopBD])
   useEffect(() => {
      let listAllSite = _.uniq(_.map(listData, 'site'))
      if (listAllSite.length == listSite.length) {
         let newArr: any = listSite.map((it: any) => {
            let filtered: any = listData.filter(data => data.site == it)
            filtered = filtered[filtered.length - 1]
            return filtered
         })
         setStorageData(newArr)
      }

   }, [listData])
   useEffect(() => {
      if (isSubmit) {
         getDataFromEndPoint(listSite, periode)
         getDataTopBD(listSite, periode)
         setIsSubmit(false)
      }
   }, [isSubmit, periode])
   return (
      <div className={elstyle.rootsum}>
         <Head>
            <title>Equipment Performance - PT. Putra Perkasa Abadi</title>
            <link rel="icon" href="./ppa.png" />
            <meta name="title" content="Report Portal - PT. Putra Perkasa Abadi" />
            <meta name="description" content="Web based Application for Monitoring Performance of All Site PT. Putra Perkasa Abadi. Getting update for Equipment Performance and others. " />
            <meta property="og:url" content="https://reports.ppa-ho.net/" />
            <meta property="og:image" content="./meta-image.png" />
         </Head>
         {showLoading ? (<LoadingForm />) : false}
         <Navbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
         />
         <Header
            activeTab={activeTab}
            periode={periode}
            setPeriode={setPeriode}
            setIsSubmit={setIsSubmit}
            isAutoPlay={isAutoPlay}
            setIsAutoPlay={setIsAutoPlay}
            displayedData={displayedData}
            lastDisplayedData={lastDisplayedData}
            selectedSiteTopBD={selectedSiteTopBD}
            listSite={listSite}
            setSelectedSiteTopBD={setSelectedSiteTopBD}
         />
         { /* konten tab detail  */
            activeTab == 1 ? (
               <>
                  <ContentDetailSite
                     displayedData={displayedData}
                     isAutoPlay={isAutoPlay}
                     indexDisplay={indexDisplay}
                     handleUpdateIndex={handleUpdateIndex}
                     setManualChange={setManualChange}
                     lastDisplayedData={lastDisplayedData}
                     manualChange={manualChange}
                  />
               </>
            ) : false
         }
         { /* konten top BD Frequent */
            activeTab == 2 && storageDataTopBD.length <= listSite.length ? (
               <TopBDContent listdata={storageDataTopBD} site={selectedSiteTopBD} />
            ) : false
         }

      </div >
   )
}
const Header = ({ activeTab, periode, setPeriode, setIsSubmit, isAutoPlay, setIsAutoPlay, lastDisplayedData, displayedData, selectedSiteTopBD, setSelectedSiteTopBD, listSite }: any) => {
   return (
      <div className={`${style.header} ${elstyle.heads}`}>
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
               Periode <strong>{periode.startDate}</strong> s/d <strong>{periode.endDate}. </strong>
               {activeTab == 2 ? (
                  <select
                     value={selectedSiteTopBD}
                     className={style.selectsite}
                     onChange={e => setSelectedSiteTopBD(e.target.value)}
                  >
                     {
                        listSite.map((it: string, index: number) => (<option key={index} value={it}>Site {it} </option>))
                     }
                  </select>
               ) : false}
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
         <div className={`w-[23em] ${elstyle.sitewrap}`}>
            { /* menampilkan info site  */
               activeTab == 1 && (displayedData != undefined) && (displayedData.site != '' && isAutoPlay) ?
                  (<SiteIcon site={displayedData.site} />) : false
            }
            { /* menampilkan info site ketika top replay */
               activeTab == 1 && (!isAutoPlay) ? (<SiteIcon site={lastDisplayedData.site} />) : false
            }
            { /* menampilkan info site on tab bd frequent */
               activeTab == 2 ? (<SiteIcon site={selectedSiteTopBD} />) : false
            }
         </div>
      </div>
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
      <div className={`absolute right-0 overflow-hidden w-[6em] bottom-[0.2em] opacity-0 ${elstyle.datepicker}`}>
         <input name="daterange" className="cursor-pointer" />
      </div>
   )
}
const ContentDetailSite = (props: any) => {
   const { displayedData, isAutoPlay, handleUpdateIndex, indexDisplay, setManualChange, manualChange, lastDisplayedData } = props
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
            <TableDetail data={isAutoPlay && manualChange == '' ? displayedData : lastDisplayedData} />
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
const LoadingForm = () => {
   return (
      <div className={`${style.loading} ${elstyle.loading}`}>
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