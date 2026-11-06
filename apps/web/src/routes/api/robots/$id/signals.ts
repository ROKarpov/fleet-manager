import { getRobotSignals } from '#/controllers/signals'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/robots/$id/signals')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { id } = params

        try {
          const robotSignals = await getRobotSignals(id)
          if (!robotSignals) {
            return new Response('', { status: 404 })
          }
          return new Response(JSON.stringify(robotSignals), { status: 200 })
        } catch (e) {
          const message =
            e instanceof Error ? e.message : 'Something went wrong'
          return new Response(message, { status: 500 })
        }
      },
    },
  },
})
