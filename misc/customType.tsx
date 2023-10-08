export interface Periode {
   startDate: string,
   endDate: string
}
export interface DetailUnit {
   type?: string,
   model?: string,
}
export interface DataMachine {
   site: string,
   data?: any[]
}
export interface NavbarProps {
   activeTab: number,
   setActiveTab: any
}
export interface DateObject {
   name?: any,
   value?: string[]
}
export interface DataTopBD {
   site?: string,
   data?: any[]
}