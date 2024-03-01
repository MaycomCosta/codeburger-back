import { v4 } from 'uuid'
import User from '../models/User'
import * as Yup from 'yup'

class UserController {
  async store(resquest, response) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required().email(),
      password: Yup.string().required().min(6),
      admin: Yup.boolean(),
    })

    try {
      await schema.validateSync(resquest.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    const { name, email, password, admin } = resquest.body

    const userExists = await User.findOne({
      where: { email },
    })

    if (userExists) {
      return response.status(409).json({ error: 'User already exists' })
    }

    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
    })

    return response.status(201).json({ id: user.id, name, email, admin })
  }
}

export default new UserController()

/*
store => cadastro/adicionar
index => listar varios
show => listar apenas um
update => atualizar
delete = deletar 
*/
