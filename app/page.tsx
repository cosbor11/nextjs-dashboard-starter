'use client'

import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function Home() {

  return (
    <AuthProvider>
      <LoadingOverlay />
    </AuthProvider>
  )
}
