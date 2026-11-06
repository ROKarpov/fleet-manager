import { getFleet } from '#/controllers/fleets'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/api/fleets/$id/')({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { id } = params

        try {
          const fleets = await getFleet(id);
          return new Response(JSON.stringify(fleets), { status: 200 })
        } catch (e) {
          const message =
            e instanceof Error ? e.message : 'Something went wrong'
          return new Response(message, { status: 500 })
        }
      },
    },
  },
})
