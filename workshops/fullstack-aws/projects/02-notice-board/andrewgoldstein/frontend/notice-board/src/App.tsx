import { useEffect, useState } from 'react'
import './App.css'
import notices from './services'
import type { Notice } from './types'

function App() {
  const [noticeList, setNoticeList] = useState<Notice[]>([])
  useEffect(() => {

    async function getNotices() {
      const newNotices: Notice[] = await notices();

      setNoticeList(newNotices);
    }

    getNotices();
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Notice Board</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {noticeList.map((notice, index) => (
            <div key={index} className="rounded-lg shadow-md p-6" style={{backgroundColor: (index % 2 === 0) ? "#FFFFFF" : "#FDFDFD"}}>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">{notice.name}</h3>
              <p className="text-gray-600">{notice.message}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default App
