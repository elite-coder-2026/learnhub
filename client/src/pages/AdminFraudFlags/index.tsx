import { useState } from 'react'
import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import Button from '../../components/Button'
import DataTable, { type Column } from '../../components/DataTable'
import Dropdown, { type DropdownOption } from '../../components/Dropdown'
import InlineError from '../../components/InlineError'
import StatusBadge, { type StatusTone } from '../../components/StatusBadge'
import { ADMIN_NAV } from '../../config/nav'
import { useFraudFlags, useReviewFraudFlag } from '../../hooks/useAdmin'
import type { FraudFlag, FraudFlagStatus } from '../../types/admin'
import { formatDate, formatPersonName } from '../../utils/format'
import * as S from './AdminFraudFlags.styles'

type StatusFilter = FraudFlagStatus | 'all'

const STATUS_OPTIONS: DropdownOption<StatusFilter>[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'dismissed', label: 'Dismissed' },
  { value: 'all', label: 'All flags' },
]

const STATUS_TONE: Record<FraudFlagStatus, StatusTone> = {
  pending: 'warning',
  reviewed: 'danger',
  dismissed: 'neutral',
}

const AdminFraudFlags: React.FC = () => {
  const [status, setStatus] = useState<StatusFilter>('pending')
  const flags = useFraudFlags(status === 'all' ? null : status)
  const review = useReviewFraudFlag()

  const rows = flags.data?.pages.flatMap((page) => page.data) ?? []
  const isReviewing = (flagId: string): boolean => review.isPending && review.variables?.id === flagId

  const columns: Column<FraudFlag>[] = [
    {
      key: 'student',
      label: 'Student',
      render: (row) => (
        <>
          {formatPersonName(row.student_first_name, row.student_last_name)}
          <S.Muted>{row.student_email}</S.Muted>
        </>
      ),
    },
    { key: 'course', label: 'Course', render: (row) => row.course_title },
    { key: 'risk', label: 'Risk', render: (row) => `${Math.round(Number(row.risk_score) * 100)}%` },
    { key: 'reason', label: 'Reason', render: (row) => row.reason ?? '—' },
    { key: 'status', label: 'Status', render: (row) => <StatusBadge tone={STATUS_TONE[row.status]}>{row.status}</StatusBadge> },
    { key: 'flagged', label: 'Flagged', render: (row) => formatDate(row.created_at) },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) =>
        row.status === 'pending' ? (
          <S.Actions>
            <Button
              size="sm"
              variant="danger"
              isLoading={isReviewing(row.id) && review.variables?.status === 'reviewed'}
              onClick={() => review.mutate({ id: row.id, status: 'reviewed' })}
            >
              Confirm fraud
            </Button>
            <Button
              size="sm"
              variant="secondary"
              isLoading={isReviewing(row.id) && review.variables?.status === 'dismissed'}
              onClick={() => review.mutate({ id: row.id, status: 'dismissed' })}
            >
              Dismiss
            </Button>
          </S.Actions>
        ) : null,
    },
  ]

  return (
    <AppShell navItems={ADMIN_NAV}>
      <Container>
        <S.Body>
          <S.Header>
            <S.TitleGroup>
              <S.Title>Fraud flags</S.Title>
              <S.Subtitle>Enrollments the fraud service marked as suspicious.</S.Subtitle>
            </S.TitleGroup>
            <Dropdown<StatusFilter> label="Status" options={STATUS_OPTIONS} value={status} onChange={setStatus} />
          </S.Header>
          {review.isError && <InlineError message={review.error.message} />}
          <DataTable
            label="Fraud flags"
            columns={columns}
            rows={rows}
            getRowId={(row) => row.id}
            isLoading={flags.isLoading}
            errorMessage={flags.error?.message ?? null}
            emptyMessage={status === 'pending' ? 'No flags waiting for review.' : 'No flags found.'}
            hasMore={flags.hasNextPage}
            isLoadingMore={flags.isFetchingNextPage}
            onLoadMore={() => void flags.fetchNextPage()}
          />
        </S.Body>
      </Container>
    </AppShell>
  )
}

export default AdminFraudFlags
