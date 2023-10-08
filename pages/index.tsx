import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTools } from '@fortawesome/free-solid-svg-icons'

export default function Home() {
  return (
    <main className="flex-col flex justify-between absolute w-full h-[100%]">
      <div className="p-[2em] pb-0 px-[5em] flex gap-[2em]">
        <img src="./ppa.png" className="w-[5em]" />
        <img src="./ss6.png" className="w-[5em] h-[5em]" />
      </div>
      <img src="./office.png" className="absolute z-[-1] opacity-[0.4] bottom-[0] left-[0] w-[40%]" />
      <div className="flex-1 flex items-start px-[5em]">
        <div className="flex-1 pt-[5em]">
          <h1 className="text-[2.7em] text-slate-600">Welcome to,</h1>
          <h1 className="text-[4.5em] font-semibold text-rose-500 leading-[1.2]">PPA Report Portal</h1>
          <p className="text-[1.7em] mt-[2.5em] text-slate-600">Please select report below</p>
          <div className="p-[2em] px-0">
            <a href="/equipment-performance" className="inline-block links">
              <p>
                <i><FontAwesomeIcon icon={faTools} /></i>
                <span className="text-[1.5em]">Equipment Performance</span>
              </p>
            </a>
          </div>
        </div>
        <img src="./meeting.png" className="w-[40%] translate-y-[2em]" />
      </div>
      <div className="text-center p-[1.6em] footer">
        <p className="text-[1.5em]">Report Portal by <strong>SS6 (Safe & Strong)</strong> &copy; 2023 - Putra Perkasa Abadi</p>
      </div>
    </main>
  )
}