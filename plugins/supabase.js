// plugins/supabase.js
import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const supabaseUrl = config.public.supabaseUrl
  const supabaseAnonKey = config.public.supabaseAnonKey

  const supabase = createClient(supabaseUrl, supabaseAnonKey)

  nuxtApp.provide('supabase', supabase)
})
