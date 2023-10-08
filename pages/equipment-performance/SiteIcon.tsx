import elstyle from '../../styles/dashboard/index.module.css'
export default function SiteIcon({ site }: any) {
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
         {
            site != '' ? (<img src={`./logo_site/${site}.png`} />) : false
         }
         <div>
            <h1>SITE {site}</h1>
            <p>{getSiteName(site)}</p>
         </div>
      </div>
   )
}