"use client"

import * as MyType from '../../misc/customType'
import * as style from './style'
import elstyle from '../../styles/dashboard/index.module.css'
import $ from 'jquery'
import { useState, useEffect } from 'react'
import _ from 'lodash'
import Navbar from './Navbar'
import TableDetail from './TableDetail'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

export default function Dashboard() {
   let listSite = process.env.NEXT_PUBLIC_LIST_SITE ? process.env.NEXT_PUBLIC_LIST_SITE.split(",") : []
   const [listData, setListData] = useState<MyType.DataMachine[]>([])
   const [isSubmit, setIsSubmit] = useState<Boolean>(true)
   const [indexDisplay, setIndexDisplay] = useState<any>(0)
   const [displayedData, setDisplayedData] = useState<MyType.DataMachine>({ site: '', data: [] })
   const [periode, setPeriode] = useState({
      startDate: '2023-09-01',
      endDate: '2023-09-20',
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
   const handleUpdateIndex = (type: string, index: number) => {
      if (type == 'prev') {
         if (indexDisplay == 0) {
            setIndexDisplay(listSite.length - 1)
         } else {
            setIndexDisplay(index - 1)
         }
      } else {
         if (indexDisplay > listSite.length - 2) {
            setIndexDisplay(0)
         } else {
            setIndexDisplay(index + 1)
         }
      }
   }
   useEffect(() => {
      let listDataSite = _.map(listData, 'site')
      let isExistAll = listSite.map(it => listDataSite.includes(it))
      if (isExistAll.every(it => it == true)) {
         let sortedData = listSite.map((item) => {
            let filteredData = listData.filter(site => site.site == item)
            return filteredData[0]
         })
         setDisplayedData(sortedData[indexDisplay])
      }
   }, [listData, indexDisplay])
   useEffect(() => {
   }, [displayedData])
   useEffect(() => {
      if (isSubmit) {
         getDataFromEndPoint(listSite, periode)
         setIsSubmit(false)
      }
   }, [isSubmit])
   return (
      <div>
         {showLoading ? (<LoadingForm />) : false}
         <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
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
               <p>Periode data <strong>{periode.startDate}</strong> s/d <strong>{periode.endDate}.</strong>
                  <a href=""> Ubah Periode.</a>
               </p>
            </div>
            <div>
               {
                  activeTab != 3 && displayedData != undefined ? (<SiteIcon site={displayedData.site} />) : (
                     <h1>All Site</h1>
                  )
               }
            </div>
         </div>
         {
            activeTab == 1 ? (
               <ContentDetailSite
                  handleUpdateIndex={handleUpdateIndex}
                  displayedData={displayedData}
                  indexDisplay={indexDisplay}
               />
            ) : false
         }

      </div >
   )
}
const ContentDetailSite = (props: any) => {
   const { handleUpdateIndex, displayedData, indexDisplay } = props
   return (
      <div className={`${style.content} ${elstyle.contentcenter}`}>
         <a
            href="#"
            title="Previous Site"
            onClick={() => handleUpdateIndex('prev', indexDisplay)}
         >
            <FontAwesomeIcon icon={faChevronLeft} />
         </a>
         <div className={style.tablecenter}>
            <TableDetail data={displayedData} />
         </div>
         <a
            href="#"
            title="Next Site"
            onClick={() => handleUpdateIndex('next', indexDisplay)}
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