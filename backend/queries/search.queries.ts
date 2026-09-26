import {pool} from '../config/db'

const searchCourses = async (query, filter, cursor, limit) => {
    const conditions = [`c.serach_vector @@ plainto_tsquery('English', $1')`]
    const params = [query]
    let paramIdx = 2

    if (filter.category) {
        conditions.push(`c.category ${paramIdx}`)
        params.push(filter.category)
        paramIdx++
    }
}