'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Child } from '@/lib/types'

export default function DashboardPage() {
  const router = useRouter()
  const [children, setChildren] = useState<Child[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    async function load() {
      // ハッシュフラグメントからセッションを処理
      if (window.location.hash) {
        await supabase.auth.getSession()
        window.history.replaceState(null, '', window.location.pathname)
      }

      const { data: { session } } = await supabase.auth.getSession()
      }
      