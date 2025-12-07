"use client"

import React from 'react'
import dynamic from 'next/dynamic'

const DynamicScene = dynamic(() => import("@/app/components/Scene"), { ssr: false })



function ModelComponenet() {
  return (
    <main>
      <DynamicScene />
    </main>
  )
}

export default ModelComponenet
