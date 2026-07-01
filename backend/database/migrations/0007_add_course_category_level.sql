CREATE TYPE nx.course_level AS ENUM ('beginner', 'intermediate', 'advanced');

ALTER TABLE nx.courses
  ADD COLUMN category TEXT,
  ADD COLUMN level     nx.course_level;
