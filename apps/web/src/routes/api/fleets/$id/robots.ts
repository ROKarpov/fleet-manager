import { getFleetRobots } from '#/controllers/robots'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/fleets/$id/robots')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { id } = params

        try {
          const robots = await getFleetRobots(id);
          return new Response(JSON.stringify(robots), { status: 200 })
        } catch (e) {
          const message =
            e instanceof Error ? e.message : 'Something went wrong'
          return new Response(message, { status: 500 })
        }
      },
    },
  },
})
