export interface FraudCheckRequest {
  student_id: string
  course_id: string
  enrollment_id: string
  enrolled_at: string
}

export interface FraudCheckResult {
  risk_score: number
  is_fraud: boolean
  reason: string | null
}

export type FraudFlagStatus = 'pending' | 'reviewed' | 'dismissed'

export interface FraudFlag {
  id: string
  student_id: string
  course_id: string
  enrollment_id: string
  risk_score: number
  reason: string | null
  status: FraudFlagStatus
  reviewed_by: string | null
  reviewed_at: Date | null
  created_at: Date
  updated_at: Date
}

export interface FraudFlagWithStudent extends FraudFlag {
  student_email: string
  student_first_name: string | null
  student_last_name: string | null
  course_title: string
}
