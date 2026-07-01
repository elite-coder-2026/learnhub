import axios from 'axios'
import { FRAUD_API_URL } from '../config/env'
import { FraudCheckRequest, FraudCheckResult } from '../types/fraud.type'

const FRAUD_CHECK_TIMEOUT_MS = 2000

export const checkEnrollmentForFraud = async (
  input: FraudCheckRequest
): Promise<FraudCheckResult | null> => {
  if (!FRAUD_API_URL) {
    console.error('FRAUD_API_URL not configured — skipping fraud check', { enrollment_id: input.enrollment_id })
    return null
  }

  try {
    const response = await axios.post<FraudCheckResult>(`${FRAUD_API_URL}/check-enrollment`, input, {
      timeout: FRAUD_CHECK_TIMEOUT_MS
    })
    return response.data
  } catch (error) {
    console.error('Fraud check failed — failing open', error)
    return null
  }
}
