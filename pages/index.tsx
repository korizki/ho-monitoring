import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTools } from '@fortawesome/free-solid-svg-icons'
import elstyle from '../styles/dashboard/index.module.css'
import Head from 'next/head'

export default function Home() {
  return (
    <main className="flex-col flex justify-between absolute w-full h-[100%]">
      <Head>
        <title>Report Portal - PT. Putra Perkasa Abadi</title>
        <link rel="icon" href="./ppa.png" />
        <meta name="title" content="Report Portal - PT. Putra Perkasa Abadi" />
        <meta name="description" content="Web based Application for Monitoring Performance of All Site PT. Putra Perkasa Abadi. Getting update for Equipment Performance and others. " />
        <meta property="og:url" content="https://reports.ppa-ho.net/" />
        <meta property="og:image" content="./meta-image.png" />
      </Head>
      <div className={`p-[2em] pb-0 px-[5em] flex gap-[2em] ${elstyle.mainhead}`}>
        <img src="./ppa.png" className="w-[5em]" />
        <img src="./ss6.png" className="w-[5em] h-[5em]" />
      </div>
      <img src="./office.png" className="absolute z-[-1] opacity-[0.4] bottom-[0] left-[0] w-[40%]" />
      <div className={`flex-1 flex items-start px-[5em] ${elstyle.maincenter}`}>
        <div className="flex-1 pt-[5em]">
          <h1 className="text-[2.7em] text-slate-600">Welcome to,</h1>
          <h1 className="text-[4.5em] font-semibold text-rose-500 leading-[1.2]">PPA Report Portal</h1>
          <p className="text-[1.7em] mt-[2.5em] text-slate-600">Please select report below</p>
          <div className="p-[2em] px-0">
            <a href="/equipment-performance" className={`inline-block links ${elstyle.mainlink}`}>
              <i><FontAwesomeIcon icon={faTools} /></i>
              <p>
                <span className="text-[1.5em]">Equipment Performance</span>
              </p>
            </a>
          </div>
        </div>
        <img src="./meeting.png" className="w-[40%] translate-y-[2em]" />
      </div>
      <div className={`text-center p-[1.6em] footer ${elstyle.mainfooter}`}>
        <p className="text-[1.5em]">Report Portal by <strong>SS6 (Safe & Strong)</strong> &copy; 2023 - <span>Putra Perkasa Abadi</span></p>
      </div>
    </main>
  )
}