const mapping: Record<string, string> = {
  locations: 'location',
  organizations: 'organization',
  times: 'time',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
