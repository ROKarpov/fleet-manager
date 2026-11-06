import { Link, useMatches } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '#/components/ui/breadcrumb'

export function AppBreadcrumbs() {
  const matches = useMatches()

  const breadcrumbableMatches = matches.filter(
    (match) =>
      match.staticData &&
      typeof match.staticData === 'object' &&
      'title' in match.staticData,
  )

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbableMatches.map((match, index) =>
          index < breadcrumbableMatches.length - 1 ? (
            <>
              <BreadcrumbItem className="hidden md:block" key={match.id}>
                <BreadcrumbLink
                  render={(props) => (
                    <Link {...props} to={match.fullPath} params={match.params}>
                      {(match.staticData as { title: string }).title}
                    </Link>
                  )}
                ></BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
            </>
          ) : (
            <BreadcrumbItem key={match.id}>
              <BreadcrumbPage>
                {(match.staticData as { title: string }).title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          ),
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
