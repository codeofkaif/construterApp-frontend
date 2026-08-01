import type { TimelinePhase } from './mockData'

// ---------------------------------------------------------------------------
// Admin-side client + project record types
// All mock data array exports have been removed.
// Real data is fetched via adminService / useAdminData hook.
// ---------------------------------------------------------------------------

export type AdminProjectStatus = 'On Track' | 'Delayed'

export type AdminClient = {
  id: string
  clientName: string
  projectTitle: string
  location: string
  progress: number           // 0-100
  currentStage: string
  stageStartDate: string     // YYYY-MM-DD
  estCompletion: string      // YYYY-MM-DD
  nextMilestoneName: string
  nextMilestoneDate: string  // YYYY-MM-DD
  timelinePhases: TimelinePhase[]
  totalBudget: number        // ₹
  paid: number               // ₹
}
