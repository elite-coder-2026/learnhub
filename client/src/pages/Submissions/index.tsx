import { useEffect, useState } from 'react'
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn'
import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import Button from '../../components/Button'
import DataTable, { type Column } from '../../components/DataTable'
import Dropdown, { type DropdownOption } from '../../components/Dropdown'
import EmptyState from '../../components/EmptyState'
import GradeDialog from '../../components/GradeDialog'
import InlineError from '../../components/InlineError'
import StatusBadge from '../../components/StatusBadge'
import { INSTRUCTOR_NAV } from '../../config/nav'
import { useInstructorAnalytics } from '../../hooks/useDashboardQueries'
import { useAssignmentSubmissions, useCourseAssignments, useGradeSubmission } from '../../hooks/useSubmissions'
import type { SubmissionWithStudent } from '../../types/assignment'
import { formatDate, formatPersonName } from '../../utils/format'
import * as S from './Submissions.styles'

const Submissions: React.FC = () => {
  const courses = useInstructorAnalytics()
  const [courseId, setCourseId] = useState<string | null>(null)
  const [assignmentId, setAssignmentId] = useState<string | null>(null)
  const assignments = useCourseAssignments(courseId)
  const submissions = useAssignmentSubmissions(assignmentId)
  const grade = useGradeSubmission()
  const [gradingSubmission, setGradingSubmission] = useState<SubmissionWithStudent | null>(null)

  useEffect(() => {
    if (courseId === null && courses.data && courses.data.length > 0) setCourseId(courses.data[0].course_id)
  }, [courseId, courses.data])

  useEffect(() => {
    setAssignmentId(assignments.data?.[0]?.id ?? null)
  }, [assignments.data])

  const courseOptions: DropdownOption[] = (courses.data ?? []).map((c) => ({ value: c.course_id, label: c.title }))
  const assignmentOptions: DropdownOption[] = (assignments.data ?? []).map((a) => ({ value: a.id, label: a.title }))
  const rows = submissions.data?.pages.flatMap((page) => page.data) ?? []

  const columns: Column<SubmissionWithStudent>[] = [
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
    { key: 'submitted', label: 'Submitted', render: (row) => formatDate(row.submitted_at) },
    { key: 'answer', label: 'Answer', render: (row) => <S.Preview>{row.submission_text ?? (row.file_url ? 'File attached' : '—')}</S.Preview> },
    {
      key: 'status',
      label: 'Status',
      render: (row) => <StatusBadge tone={row.status === 'graded' ? 'success' : 'warning'}>{row.status}</StatusBadge>,
    },
    { key: 'grade', label: 'Grade', render: (row) => (row.grade === null ? '—' : `${row.grade}/100`) },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button size="sm" variant={row.status === 'graded' ? 'secondary' : 'primary'} onClick={() => setGradingSubmission(row)}>
          {row.status === 'graded' ? 'Regrade' : 'Grade'}
        </Button>
      ),
    },
  ]

  const closeDialog = (): void => {
    setGradingSubmission(null)
    grade.reset()
  }

  const hasNoCourses = courses.data !== undefined && courses.data.length === 0
  const hasNoAssignments = assignments.data !== undefined && assignments.data.length === 0

  return (
    <AppShell navItems={INSTRUCTOR_NAV}>
      <Container>
        <S.Body>
          <S.TitleGroup>
            <S.Title>Submissions</S.Title>
            <S.Subtitle>Review and grade student work for your courses.</S.Subtitle>
          </S.TitleGroup>

          {courses.isError && <InlineError message={courses.error.message} />}
          {assignments.isError && <InlineError message={assignments.error.message} />}

          {hasNoCourses ? (
            <EmptyState
              icon={AssignmentTurnedInIcon}
              message="Create a course to start receiving submissions."
              ctaLabel="Create course"
              ctaTo="/courses/new"
            />
          ) : (
            <>
              <S.Filters>
                <Dropdown label="Course" options={courseOptions} value={courseId} onChange={setCourseId} placeholder="Loading courses…" />
                <Dropdown
                  label="Assignment"
                  options={assignmentOptions}
                  value={assignmentId}
                  onChange={setAssignmentId}
                  placeholder={hasNoAssignments ? 'No assignments' : 'Select an assignment'}
                />
              </S.Filters>

              {hasNoAssignments ? (
                <S.Note>This course has no assignments yet, so there's nothing to grade.</S.Note>
              ) : (
                <DataTable
                  label="Submissions"
                  columns={columns}
                  rows={rows}
                  getRowId={(row) => row.id}
                  isLoading={assignmentId !== null && submissions.isLoading}
                  errorMessage={submissions.error?.message ?? null}
                  emptyMessage="No submissions for this assignment yet."
                  hasMore={submissions.hasNextPage}
                  isLoadingMore={submissions.isFetchingNextPage}
                  onLoadMore={() => void submissions.fetchNextPage()}
                />
              )}
            </>
          )}
        </S.Body>
      </Container>
      {gradingSubmission && (
        <GradeDialog
          submission={gradingSubmission}
          isPending={grade.isPending}
          errorMessage={grade.error?.message ?? null}
          onCancel={closeDialog}
          onSubmit={(input) => grade.mutate({ submissionId: gradingSubmission.id, input }, { onSuccess: closeDialog })}
        />
      )}
    </AppShell>
  )
}

export default Submissions
