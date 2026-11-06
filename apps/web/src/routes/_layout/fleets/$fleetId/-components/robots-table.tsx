import { Card, CardContent } from '#/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table'
import type { Robot, RobotSignal } from '#/generated/prisma/browser'
import { routeFactory } from '#/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useTable, type ColumnDef } from '@tanstack/react-table'

type EnhancedRobot = Robot & { latestSignal?: RobotSignal }

type RobotTableContentProps = { fleetId: string; robots: EnhancedRobot[] }

const robotTableColumns: ColumnDef<{}, EnhancedRobot>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorFn: ({ id }) => id,
  },
  {
    id: 'name',
    header: 'Name',
    accessorFn: ({ name }) => name,
  },
  {
    id: 'coordinates',
    header: 'Coordinates',
    accessorFn: ({ latestSignal }) => {
      const metrics = latestSignal?.metrics
      if (
        metrics &&
        typeof metrics === 'object' &&
        !Array.isArray(metrics) &&
        'position' in metrics
      ) {
        const position = metrics.position as { x: number; y: number }
        return `(${position.x}, ${position.y})`
      }
      return '-'
    },
  },
  {
    id: 'status',
    header: 'Status',
    accessorFn: ({ latestSignal }) => {
      const metrics = latestSignal?.metrics
      if (
        metrics &&
        typeof metrics === 'object' &&
        !Array.isArray(metrics) &&
        'status' in metrics
      ) {
        return metrics.status
      }
      return '-'
    },
  },
  {
    id: 'receivedAt',
    header: 'Last updated at',
    accessorFn: ({ latestSignal }) => {
      return latestSignal?.receivedAt ?? '-'
    },
  },
]

function RobotTableContent({ fleetId, robots }: RobotTableContentProps) {
  const table = useTable({
    data: robots,
    features: {},
    columns: robotTableColumns,
  })

  const navigate = useNavigate()

  const tableRows = table.getRowModel().rows

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((group) => (
          <TableRow key={group.id}>
            {group.headers.map((header) => (
              <TableHead
                key={header.id}
                colSpan={header.colSpan}
                rowSpan={header.rowSpan}
              >
                {header.isPlaceholder ? null : (
                  <table.FlexRender header={header} />
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {tableRows.length ? (
          tableRows.map((row) => (
            <TableRow
              key={row.id}
              onClick={() =>
                navigate({
                  to: '/fleets/$fleetId/robots/$robotId',
                  params: { fleetId, robotId: row.original.id },
                })
              }
            >
              {row.getAllCells().map((cell) => (
                <TableCell key={cell.id}>
                  <table.FlexRender cell={cell} />
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={table.getAllColumns().length}
              className="text-center"
            >
              No data available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

type RobotTableProps = {
  fleetId: string
}

export function RobotTable({ fleetId }: RobotTableProps) {
  const {
    data: robots,
    isFetching,
    isError,
  } = useQuery({
    queryKey: routeFactory.robots.all(fleetId),
    queryFn: () =>
      fetch(`/api/fleets/${fleetId}/robots`).then(
        (response): Promise<EnhancedRobot[]> => response.json(),
      ),
  })

  if (isFetching) {
    return 'Loading'
  }

  if (isError) {
    return 'Error loading data'
  }

  return <RobotTableContent fleetId={fleetId} robots={robots ?? []} />
}
