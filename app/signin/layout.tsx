"use client"

import { AuthProvider } from "@/contexts/AuthContext"
import React from "react"

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
        <AuthProvider>{children}</AuthProvider>
    )
  }