import { useMemo } from 'react'
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'
import DownloadIcon from '@mui/icons-material/Download'
import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import Button from '../../components/Button'
import EmptyState from '../../components/EmptyState'
import InlineError from '../../components/InlineError'
import Skeleton from '../../components/Skeleton'
import { STUDENT_NAV } from '../../config/nav'
import { useCertificates } from '../../hooks/useCertificates'
import { useStudentDashboard } from '../../hooks/useDashboardQueries'
import { useDownloadCertificate } from '../../hooks/useDownloadCertificate'
import { useTheme } from 'styled-components'
import * as S from './Certificates.styles'

const SKELETON_KEYS = ['certificate-a', 'certificate-b', 'certificate-c']
const dateFormatter = new Intl.DateTimeFormat('en-US', { dateStyle: 'medium' })

const Certificates: React.FC = () => {
  const theme = useTheme()
  const certificates = useCertificates()
  const dashboard = useStudentDashboard()
  const download = useDownloadCertificate()

  const titleByCourseId = useMemo(() => {
    const titles = new Map<string, string>()
    for (const course of [...(dashboard.data?.completed ?? []), ...(dashboard.data?.inProgress ?? [])]) {
      titles.set(course.course_id, course.title)
    }
    return titles
  }, [dashboard.data])

  return (
    <AppShell navItems={STUDENT_NAV}>
      <Container>
        <S.Body>
          <S.Header>
            <S.Title>Certificates</S.Title>
            <S.Subtitle>Certificates you've earned by completing courses.</S.Subtitle>
          </S.Header>

          {certificates.isLoading && (
            <S.Grid aria-busy="true">
              {SKELETON_KEYS.map((key) => (
                <Skeleton key={key} height={theme.sizes.courseCardSkeleton} radius="lg" />
              ))}
            </S.Grid>
          )}
          {certificates.isError && <InlineError message={certificates.error.message} />}
          {download.isError && <InlineError message={download.error.message} />}
          {certificates.data && certificates.data.length === 0 && (
            <EmptyState
              icon={WorkspacePremiumIcon}
              message="Complete every lesson in a course to earn its certificate."
              ctaLabel="Browse courses"
              ctaTo="/courses"
            />
          )}
          {certificates.data && certificates.data.length > 0 && (
            <S.Grid>
              {certificates.data.map((certificate) => (
                <S.Card key={certificate.id}>
                  <S.Seal aria-hidden="true">
                    <WorkspacePremiumIcon fontSize="inherit" />
                  </S.Seal>
                  <S.CourseTitle>{titleByCourseId.get(certificate.course_id) ?? 'Completed course'}</S.CourseTitle>
                  <S.Meta>Issued {dateFormatter.format(new Date(certificate.issued_at))}</S.Meta>
                  <Button
                    variant="secondary"
                    size="sm"
                    isLoading={download.isPending && download.variables === certificate.id}
                    onClick={() => download.mutate(certificate.id)}
                  >
                    <DownloadIcon fontSize="inherit" />
                    Download PDF
                  </Button>
                </S.Card>
              ))}
            </S.Grid>
          )}
        </S.Body>
      </Container>
    </AppShell>
  )
}

export default Certificates
