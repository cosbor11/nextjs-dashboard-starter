"use client"

import {useAuth } from "@/contexts/AuthContext";
import LoadingOverlay from "@/components/LoadingOverlay";
import { NextPage } from "next";

const Dashboard: NextPage = () => {
  const {user} = useAuth();

  return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <h1>DASHBOARD: Welcome {user?.displayName}!  </h1>

      </main>
  )
}

export default Dashboard