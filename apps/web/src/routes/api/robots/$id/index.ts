import { getRobot } from '#/controllers/robots'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/robots/$id/')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { id } = params

        try {
          const robot = await getRobot(id)
          if (!robot) {
            return new Response('', { status: 404 })
          }
          return new Response(JSON.stringify(robot), { status: 200 })
        } catch (e) {
          const message =
            e instanceof Error ? e.message : 'Something went wrong'
          return new Response(message, { status: 500 })
        }
      },
    },
  },
})
