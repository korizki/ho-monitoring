import * as style from './style'
import { useEffect, useState } from 'react'
import * as MyType from '../../misc/customType'
export default function TopBDContent(props: any) {
   const { listdata } = props
   useEffect(() => {
      console.log(listdata)
   }, [])
   return (
      <div className={`${style.wrapTableData}`}>

      </div>
   )
}