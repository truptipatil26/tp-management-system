import type { Api } from './api'
import { mockApi } from './mockApi'

export const isMockMode = import.meta.env.VITE_USE_MOCK !== 'false'

function createApi(): Api {
  if (isMockMode) return mockApi
  // Phase 2: return httpApi (talks to FastAPI)
  throw new Error('The real API is not built yet (Phase 2). Set VITE_USE_MOCK=true in .env')
}

export const api: Api = createApi()