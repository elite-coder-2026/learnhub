import { useState } from 'react'
import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import Button from '../../components/Button'
import ConfirmDialog from '../../components/ConfirmDialog'
import DataTable, { type Column } from '../../components/DataTable'
import StatusBadge from '../../components/StatusBadge'
import { ADMIN_NAV } from '../../config/nav'
import { useAuth } from '../../hooks/useAuth'
import { useAdminUsers, useDeactivateUser } from '../../hooks/useAdmin'
import type { AdminUser } from '../../types/admin'
import { formatDate, formatPersonName } from '../../utils/format'
import * as S from './AdminUsers.styles'

const AdminUsers: React.FC = () => {
  const { user } = useAuth()
  const users = useAdminUsers()
  const deactivate = useDeactivateUser()
  const [pendingUser, setPendingUser] = useState<AdminUser | null>(null)

  const rows = users.data?.pages.flatMap((page) => page.data) ?? []

  const columns: Column<AdminUser>[] = [
    {
      key: 'name',
      label: 'User',
      render: (row) => (
        <>
          {formatPersonName(row.first_name, row.last_name)}
          <S.Muted>{row.email}</S.Muted>
        </>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (row) => <StatusBadge tone={row.user_role === 'admin' ? 'danger' : 'primary'}>{row.user_role}</StatusBadge>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (row) => (
        <StatusBadge tone={row.is_active ? 'success' : 'neutral'}>{row.is_active ? 'Active' : 'Deactivated'}</StatusBadge>
      ),
    },
    { key: 'lastLogin', label: 'Last login', render: (row) => formatDate(row.last_login_at) },
    { key: 'joined', label: 'Joined', render: (row) => formatDate(row.created_at) },
    {
      key: 'actions',
      label: 'Actions',
      render: (row) =>
        row.is_active && row.id !== user?.userId ? (
          <Button variant="secondary" size="sm" onClick={() => setPendingUser(row)}>
            Deactivate
          </Button>
        ) : null,
    },
  ]

  const closeDialog = (): void => {
    setPendingUser(null)
    deactivate.reset()
  }

  return (
    <AppShell navItems={ADMIN_NAV}>
      <Container>
        <S.Body>
          <S.Header>
            <S.TitleGroup>
              <S.Title>Users</S.Title>
              <S.Subtitle>Every account on LearnHub. Deactivated users can no longer sign in.</S.Subtitle>
            </S.TitleGroup>
          </S.Header>
          <DataTable
            label="Users"
            columns={columns}
            rows={rows}
            getRowId={(row) => row.id}
            isLoading={users.isLoading}
            errorMessage={users.error?.message ?? null}
            emptyMessage="No users found."
            hasMore={users.hasNextPage}
            isLoadingMore={users.isFetchingNextPage}
            onLoadMore={() => void users.fetchNextPage()}
          />
        </S.Body>
      </Container>
      <ConfirmDialog
        isOpen={pendingUser !== null}
        title="Deactivate user?"
        message={`${pendingUser?.email ?? ''} will no longer be able to sign in.`}
        confirmLabel="Deactivate"
        isPending={deactivate.isPending}
        errorMessage={deactivate.error?.message ?? null}
        onCancel={closeDialog}
        onConfirm={() => {
          if (pendingUser) deactivate.mutate(pendingUser.id, { onSuccess: closeDialog })
        }}
      />
    </AppShell>
  )
}

export default AdminUsers
