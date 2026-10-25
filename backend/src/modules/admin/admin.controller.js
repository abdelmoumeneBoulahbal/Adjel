import { getAllUsers } from './admin.service.js'
import { success, error } from '../../utils/response.js'

export const getAllUsersController = async (req, res) => {
  try {
    const { page, limit } = req.query
    const data = await getAllUsers({ page, limit })
    return success(res, data, 'Users retrieved', 200)
  } catch (err) {
    return error(res, 'Something went wrong', 500)
  }
}