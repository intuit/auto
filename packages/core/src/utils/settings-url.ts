import * as url from 'url';

export default function settingsUrl(apiUrl: string) {
  let { host } = url.parse(apiUrl);

  if (host && host.includes('api.')) {
    host = host.replace('api.', '');
  }

  return `https://${host}/settings/tokens/new`;
}
