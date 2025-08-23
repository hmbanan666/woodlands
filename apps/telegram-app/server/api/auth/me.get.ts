import process from 'node:process'

export default defineEventHandler(async (event) => {
  try {
    const { telegram } = useRuntimeConfig()
    const botToken = process.env.NODE_ENV !== 'development' ? telegram.botToken : telegram.devBotToken

    const token = getHeader(event, 'Authorization')
    if (!token) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    const [_, authData] = token.split(' ')
    if (!authData) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    const telegramData = validateTelegramData(authData, botToken)
    if (!telegramData?.user) {
      throw createError({
        statusCode: 400,
        message: 'User is not valid',
      })
    }

    const telegramId = telegramData.user.id.toString()

    return {
      id: telegramId,
      name: telegramData.user.first_name,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
