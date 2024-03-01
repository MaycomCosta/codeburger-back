import * as Yup from 'yup'
import jwt from 'jsonwebtoken'
import User from '../models/User'
import authConfig from '../../config/auth'

class SessionController {
  async store(resquest, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    const userEmailOrPasswordIsIncorrect = () => {
      return response
        .status(401)
        .json({ error: 'make sure your email or password are correct.' })
    }

    if (!(await schema.isValid(resquest.body))) {
      userEmailOrPasswordIsIncorrect()
    }

    const { email, password } = resquest.body

    const user = await User.findOne({
      where: { email },
    })

    if (!user) {
      userEmailOrPasswordIsIncorrect()
    }

    if (!(await user.checkPassword(password))) {
      userEmailOrPasswordIsIncorrect()
    }

    return response.json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
      token: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
        expiresIn: authConfig.espiresIn,
      }),
    })
  }
}
export default new SessionController()
