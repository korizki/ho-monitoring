import elstyle from '../../styles/dashboard/index.module.css'
import * as style from './style'
import * as MyType from '../../misc/customType'

export default function Navbar({ activeTab, setActiveTab }: MyType.NavbarProps) {
   return (
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
         <a
            href="#"
            onClick={() => setActiveTab(3)}
            className={`${elstyle.navButton} ${activeTab == 3 ? elstyle.navActive : ''}`}
         >All Site</a>

      </div>
   )
}