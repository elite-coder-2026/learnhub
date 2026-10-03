import { useState } from 'react'
import type { SvgIconComponent } from '@mui/icons-material'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutlineOutlined'
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined'
import QuizOutlinedIcon from '@mui/icons-material/QuizOutlined'
import CheckIcon from '@mui/icons-material/Check'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ProgressBar from '../ProgressBar'
import type { CourseLesson, CourseModule } from '../../types/course'
import * as S from './LessonList.styles'

interface LessonListProps {
  modules: CourseModule[]
  courseTitle?: string
  completedLessonIds?: Set<string>
  activeLessonId?: string
  buildHref?: (lessonId: string) => string
}

export type LessonState = 'notStarted' | 'completed' | 'current'

const VIDEO_PATTERN = /\.(mp4|webm|mov|m3u8)(\?|$)|youtube\.com|youtu\.be|vimeo\.com/i
const QUIZ_PATTERN = /quiz/i

const getLessonTypeIcon = (lesson: CourseLesson): SvgIconComponent => {
  const url = lesson.content_url ?? ''
  if (QUIZ_PATTERN.test(url) || QUIZ_PATTERN.test(lesson.title)) return QuizOutlinedIcon
  if (VIDEO_PATTERN.test(url)) return PlayCircleOutlineIcon
  return ArticleOutlinedIcon
}

const byPosition = <T extends { position: number }>(items: T[]): T[] =>
  [...items].sort((a, b) => a.position - b.position)

const LessonList: React.FC<LessonListProps> = ({
  modules,
  courseTitle,
  completedLessonIds,
  activeLessonId,
  buildHref,
}) => {
  const [collapsedModuleIds, setCollapsedModuleIds] = useState<Set<string>>(() => new Set())
  const sortedModules = byPosition(modules)
  const totalLessons = sortedModules.reduce((sum, m) => sum + m.lessons.length, 0)
  const isCompleted = (lessonId: string): boolean => completedLessonIds?.has(lessonId) ?? false
  const completedCount = sortedModules.reduce(
    (sum, m) => sum + m.lessons.filter((lesson) => isCompleted(lesson.id)).length,
    0,
  )
  const overallPercent = totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100)

  const toggleModule = (moduleId: string): void => {
    setCollapsedModuleIds((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) next.delete(moduleId)
      else next.add(moduleId)
      return next
    })
  }

  const getLessonState = (lessonId: string): LessonState => {
    if (lessonId === activeLessonId) return 'current'
    return isCompleted(lessonId) ? 'completed' : 'notStarted'
  }

  return (
    <S.Container aria-label="Course lessons">
      {courseTitle && (
        <S.PanelHeader>
          <S.CourseTitle>{courseTitle}</S.CourseTitle>
          <ProgressBar percent={overallPercent} label={`${courseTitle} progress`} />
          <S.PanelMeta>
            {completedCount} of {totalLessons} lessons
          </S.PanelMeta>
        </S.PanelHeader>
      )}

      {sortedModules.map((courseModule) => {
        const lessons = byPosition(courseModule.lessons)
        const moduleCompleted = lessons.filter((lesson) => isCompleted(lesson.id)).length
        const isCollapsed = collapsedModuleIds.has(courseModule.id)
        const listId = `module-${courseModule.id}-lessons`

        return (
          <S.Section key={courseModule.id}>
            <S.SectionHeader
              type="button"
              aria-expanded={!isCollapsed}
              aria-controls={listId}
              onClick={() => toggleModule(courseModule.id)}
            >
              <S.Chevron $isCollapsed={isCollapsed} aria-hidden="true">
                <ExpandMoreIcon fontSize="inherit" />
              </S.Chevron>
              <S.SectionTitle>{courseModule.title}</S.SectionTitle>
              <S.SectionCount>
                {moduleCompleted}/{lessons.length}
              </S.SectionCount>
            </S.SectionHeader>

            {!isCollapsed && (
              <S.List id={listId}>
                {lessons.map((lesson, index) => {
                  const state = getLessonState(lesson.id)
                  const TypeIcon = getLessonTypeIcon(lesson)
                  const content = (
                    <>
                      <S.StateIcon $state={state} aria-label={state === 'completed' ? 'Completed' : undefined}>
                        {state === 'completed' && <CheckIcon fontSize="inherit" />}
                      </S.StateIcon>
                      <S.LessonNumber>{index + 1}</S.LessonNumber>
                      <S.LessonTitle>{lesson.title}</S.LessonTitle>
                      <S.TypeIcon aria-hidden="true">
                        <TypeIcon fontSize="inherit" />
                      </S.TypeIcon>
                    </>
                  )

                  return (
                    <li key={lesson.id}>
                      {buildHref ? (
                        <S.RowLink
                          to={buildHref(lesson.id)}
                          $isActive={state === 'current'}
                          aria-current={state === 'current' ? 'page' : undefined}
                        >
                          {content}
                        </S.RowLink>
                      ) : (
                        <S.StaticRow $isActive={state === 'current'}>{content}</S.StaticRow>
                      )}
                    </li>
                  )
                })}
              </S.List>
            )}
          </S.Section>
        )
      })}
    </S.Container>
  )
}

export default LessonList
