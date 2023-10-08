import elstyle from '../../styles/dashboard/index.module.css'
import * as style from '../../misc/style'
import { useState } from 'react'
import * as MyType from '../../misc/customType'

export default function Navbar({ activeTab, setActiveTab }: MyType.NavbarProps) {
   const [showToolbar, setShowToolbar] = useState(true)
   const handleChange = (param: any) => {
      setShowToolbar(param.target.checked ? true : false)
   }
   return (
      <>
         <div className={`p-4 px-10 flex items-center justify-between ${elstyle.mainnav}`}>
            <div className="flex gap-2 items-center">
               <img src="./ppa.png" width="50" className="mr-4" />
               <h1 className="text-[2em] font-semibold text-rose-600">Equipment Performance</h1>
            </div>
            <div title={`${showToolbar ? 'Sembunyikan ' : 'Tampilkan '}Menu Navigasi`}>
               <label className={elstyle.togle}>
                  <span className={showToolbar ? 'active-toolbar' : ''}></span>
                  <input checked={showToolbar} type="checkbox" onChange={e => handleChange(e)} />
               </label>
            </div>
         </div>
         {
            showToolbar ? (
               <div className={`${style.nav} `}>
                  <a
                     href="#"
                     onClick={() => setActiveTab(1)}
                     className={`${elstyle.navButton} ${activeTab == 1 ? elstyle.navActive : ''}`}
                  >Detail</a>
                  <a
                     href="#"
                     onClick={() => setActiveTab(2)}
                     className={`${elstyle.navButton} ${activeTab == 2 ? elstyle.navActive : ''}`}
                  >Top BD Frequent</a>
               </div>
            ) : false
         }
      </>
   )
}