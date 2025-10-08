"use client"

import { useState } from "react"
import { StatefulInput } from "@/components/stateful-input"

export default function Home() {
  const [normalValue, setNormalValue] = useState("")
  const [activeValue, setActiveValue] = useState("muk")
  const [errorValue, setErrorValue] = useState("mukunds735afesquidnet")
  const [filledValue, setFilledValue] = useState("mukunds735@safesquid.net")
  const [componentValue, setComponentValue] = useState("")

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-md mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-center mb-8">Input Component States</h1>

        {/* Normal State */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Normal State</h2>
          <StatefulInput
            placeholder="example@example.com"
            value={normalValue}
            onChange={(e) => setNormalValue(e.target.value)}
          />
        </div>

        {/* Active State */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Active state</h2>
          <StatefulInput value={activeValue} onChange={(e) => setActiveValue(e.target.value)} autoFocus />
        </div>

        {/* Error Case */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Error Case</h2>
          <StatefulInput value={errorValue} onChange={(e) => setErrorValue(e.target.value)} error="Incorrect email!" />
        </div>

        {/* Filled */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Filled</h2>
          <StatefulInput
            value={filledValue}
            onChange={(e) => setFilledValue(e.target.value)}
            showClearButton
            onClear={() => setFilledValue("")}
          />
        </div>

        {/* Component with Label */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Component</h2>
          <StatefulInput
            label="Text"
            placeholder="example@example.com"
            value={componentValue}
            onChange={(e) => setComponentValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
