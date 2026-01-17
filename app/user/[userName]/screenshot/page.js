import React from 'react'
import UploadBox from './components/uploadForm';
const screenshot = () => {
  return (
    <>
      {/* <div className="container mx-auto p-4 ">
        <h1 className="text-3xl font-bold mb-4">Add Screenshot </h1>
        <div className="border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
          <p className="text-gray-500 mb-4">Drag and drop your screenshots here, or click to select files.</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Select Files</button>
        </div>
      </div> */}
      <UploadBox />
    </>
  )
}

export default screenshot
