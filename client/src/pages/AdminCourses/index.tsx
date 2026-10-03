import { useState } from 'react'
import { Link } from 'react-router-dom'
import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import Button from '../../components/Button'
import ConfirmDialog from '../../components/ConfirmDialog'
import DataTable, { type Column } from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { ADMIN_NAV } from '../../config/nav'
import { useAdminCourses, useRemoveCourse } from '../../hooks/useAdmin'
import type { Course } from '../../types/course'
import { formatDate } from '../../utils/format'
import { formatPrice } from '../../utils/price'
import * as S from './AdminCourses.styles'

const AdminCourses: React.FC = () => {
  const courses = useAdminCourses()
  const remove = useRemoveCourse()
  const [pendingCourse, setPendingCourse] = useState<Course | null>(null)

  const rows = courses.data?.pages.flatMap((page) => page.data) ?? []

  const columns: Column<Course>[] = [
    { key: 'title', label: 'Course', render: (row) => <Link to={`/courses/${row.id}`}>{row.title}</Link> },
    { key: 'category', label: 'Category', render: (row) => row.category ?? '—' },
    {
      key: 'level',
      label: 'Level',
      render: (row) => (row.level ? <StatusBadge tone="primary">{row.level}</StatusBadge> : '—'),
    },
    { key: 'price', label: 'Price', render: (row) => formatPrice(row.price_cents) },
    { key: 'created', label: 'Created', render: (row) => formatDate(row.created_at) },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) => (
        <Button variant="secondary" size="sm" onClick={() => setPendingCourse(row)}>
          Remove
        </Button>
      ),
    },
  ]

  const closeDialog = (): void => {
    setPendingCourse(null)
    remove.reset()
  }

  return (
    <AppShell navItems={ADMIN_NAV}>
      <Container>
        <S.Body>
          <S.Header>
            <S.TitleGroup>
              <S.Title>Courses</S.Title>
              <S.Subtitle>All published courses. Removing a course hides it from the catalog.</S.Subtitle>
            </S.TitleGroup>
          </S.Header>
          <DataTable
            label="Courses"
            columns={columns}
            rows={rows}
            getRowId={(row) => row.id}
            isLoading={courses.isLoading}
            errorMessage={courses.error?.message ?? null}
            emptyMessage="No courses found."
            hasMore={courses.hasNextPage}
            isLoadingMore={courses.isFetchingNextPage}
            onLoadMore={() => void courses.fetchNextPage()}
          />
        </S.Body>
      </Container>
      <ConfirmDialog
        isOpen={pendingCourse !== null}
        title="Remove course?"
        message={`"${pendingCourse?.title ?? ''}" will be hidden from the catalog and students.`}
        confirmLabel="Remove course"
        isPending={remove.isPending}
        errorMessage={remove.error?.message ?? null}
        onCancel={closeDialog}
        onConfirm={() => {
          if (pendingCourse) remove.mutate(pendingCourse.id, { onSuccess: closeDialog })
        }}
      />
    </AppShell>
  )
}

export default AdminCourses
