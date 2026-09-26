import { useMemo } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import * as S from './CoursePlayer.styles'
import AppShell from '../../components/AppShell'
import Container from '../../components/Container'
import Button from '../../components/Button'
import Skeleton from '../../components/Skeleton'
import InlineError from '../../components/InlineError'
import LessonList from '../../components/LessonList'
import { STUDENT_NAV } from '../../config/nav'
import { useCourse } from '../../hooks/useCourse'
import { useCourseProgress } from '../../hooks/useCourseProgress'
import { useLesson } from '../../hooks/useLesson'
import { useLessonCompletion } from '../../hooks/useLessonCompletion'
import type { CourseLesson } from '../../types/course'

const CoursePlayer: React.FC = () => {
  const { id, lessonId } = useParams<{ id: string; lessonId?: string }>()
  const navigate = useNavigate()

  const course = useCourse(id)
  const progress = useCourseProgress(id)
  const lesson = useLesson(lessonId)
  const completion = useLessonCompletion(id ?? '')

  const orderedLessons = useMemo<CourseLesson[]>(() => {
    if (!course.data) return []
    return [...course.data.modules]
      .sort((a, b) => a.position - b.position)
      .flatMap((module) =>
        [...module.lessons].sort((a, b) => a.position - b.position),
      )
  }, [course.data])

  const completedLessonIds = useMemo<Set<string>>(
    () =>
      new Set(
        progress.data?.lessons
          .filter((l) => l.completed)
          .map((l) => l.lesson_id) ?? [],
      ),
    [progress.data],
  )

  const buildLessonHref = (lid: string): string =>
    `/courses/${id}/learn/${lid}`

  if (course.isLoading || progress.isLoading) {
    return (
      <AppShell navItems={STUDENT_NAV}>
        <Container>
          <S.StatusWrap>
            <Skeleton height="360px" radius="lg" />
            <Skeleton height="28px" width="40%" />
          </S.StatusWrap>
        </Container>
      </AppShell>
    )
  }

  if (course.isError) {
    return (
      <AppShell navItems={STUDENT_NAV}>
        <Container>
          <S.StatusWrap>
            <InlineError message={course.error.message} />
          </S.StatusWrap>
        </Container>
      </AppShell>
    )
  }

  if (progress.isError) {
    return (
      <AppShell navItems={STUDENT_NAV}>
        <Container>
          <S.StatusWrap>
            <InlineError message="You need to enroll before you can view this course." />
            <div>
              <Button onClick={() => navigate(`/courses/${id}`)}>
                Go to course page
              </Button>
            </div>
          </S.StatusWrap>
        </Container>
      </AppShell>
    )
  }

  if (orderedLessons.length === 0) {
    return (
      <AppShell navItems={STUDENT_NAV}>
        <Container>
          <S.StatusWrap>
            <S.ProgressText>This course has no lessons yet.</S.ProgressText>
          </S.StatusWrap>
        </Container>
      </AppShell>
    )
  }

  if (!lessonId) {
    return (
      <Navigate
        to={buildLessonHref(orderedLessons[0].id)}
        replace
      />
    )
  }

  const currentIndex = orderedLessons.findIndex((l) => l.id === lessonId)
  const nextLesson =
    currentIndex >= 0 ? orderedLessons[currentIndex + 1] : undefined
  const isCompleted = completedLessonIds.has(lessonId)

  return (
    <AppShell navItems={STUDENT_NAV}>
      <Container>
        <S.Layout>
          <S.Main>
            {lesson.isLoading && <Skeleton height="360px" radius="lg" />}
            {lesson.isError && <InlineError message={lesson.error.message} />}
            {lesson.data && (
              <>
                <S.VideoFrame>
                  <S.Video controls src={lesson.data.content_url} />
                </S.VideoFrame>
                <S.LessonTitle>{lesson.data.title}</S.LessonTitle>
              </>
            )}

            <S.Toolbar>
              <Button
                variant={isCompleted ? 'secondary' : 'primary'}
                onClick={() =>
                  completion.mutate({ lessonId, completed: !isCompleted })
                }
                isLoading={completion.isPending}
              >
                {isCompleted ? 'Mark as not complete' : 'Mark complete'}
              </Button>
              {nextLesson && (
                <Button
                  variant="ghost"
                  onClick={() => navigate(buildLessonHref(nextLesson.id))}
                >
                  Next lesson
                </Button>
              )}
            </S.Toolbar>

            {completion.isError && (
              <InlineError message={completion.error.message} />
            )}

            {progress.data && (
              <S.ProgressText>
                {progress.data.completed_lessons} of{' '}
                {progress.data.total_lessons} lessons complete ·{' '}
                {progress.data.percent_complete}%
              </S.ProgressText>
            )}
          </S.Main>

          <S.Aside>
            {course.data && (
              <LessonList
                modules={course.data.modules}
                completedLessonIds={completedLessonIds}
                activeLessonId={lessonId}
                buildHref={buildLessonHref}
              />
            )}
          </S.Aside>
        </S.Layout>
      </Container>
    </AppShell>
  )
}

export default CoursePlayer
