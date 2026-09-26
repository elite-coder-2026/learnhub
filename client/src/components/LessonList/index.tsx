import * as S from './LessonList.styles'
import type { CourseModule } from '../../types/course'

interface LessonListProps {
  modules: CourseModule[]
  completedLessonIds?: Set<string>
  activeLessonId?: string
  buildHref?: (lessonId: string) => string
}

const LessonList: React.FC<LessonListProps> = ({
  modules,
  completedLessonIds,
  activeLessonId,
  buildHref,
}) => {
  const sortedModules = [...modules].sort((a, b) => a.position - b.position)

  return (
    <S.Container aria-label="Course lessons">
      {sortedModules.map((module) => {
        const lessons = [...module.lessons].sort(
          (a, b) => a.position - b.position,
        )
        return (
          <div key={module.id}>
            <S.ModuleTitle>{module.title}</S.ModuleTitle>
            <S.List>
              {lessons.map((lesson) => {
                const completed = completedLessonIds?.has(lesson.id) ?? false
                const marker = (
                  <S.Marker $completed={completed} aria-hidden="true">
                    {completed ? '✓' : ''}
                  </S.Marker>
                )
                return (
                  <li key={lesson.id}>
                    {buildHref ? (
                      <S.RowLink
                        to={buildHref(lesson.id)}
                        $isActive={lesson.id === activeLessonId}
                        aria-current={
                          lesson.id === activeLessonId ? 'page' : undefined
                        }
                      >
                        {marker}
                        <S.LessonTitle>{lesson.title}</S.LessonTitle>
                      </S.RowLink>
                    ) : (
                      <S.StaticRow>
                        {marker}
                        <S.LessonTitle>{lesson.title}</S.LessonTitle>
                      </S.StaticRow>
                    )}
                  </li>
                )
              })}
            </S.List>
          </div>
        )
      })}
    </S.Container>
  )
}

export default LessonList
