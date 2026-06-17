const {
  VITE_ADSTERRA_IFRAME_KEY,
  VITE_ADSTERRA_IFRAME_SRC,
  VITE_ADSTERRA_NATIVE_BANNER_SRC,
  VITE_ADSTERRA_NATIVE_BANNER_CONTAINER_ID,
  VITE_ADSTERRA_SMARTLINK_URL,
} = import.meta.env;

export const ADSTERRA_IFRAME_160X600_SCRIPTS = [
  {
    kind: 'inline' as const,
    code: `
      var atOptions = {
        key: '${VITE_ADSTERRA_IFRAME_KEY ?? ''}',
        format: 'iframe',
        height: 600,
        width: 160,
        params: {}
      };
    `,
  },
  {
    kind: 'external' as const,
    src: VITE_ADSTERRA_IFRAME_SRC ?? '',
    async: true,
  },
];

export const ADSTERRA_NATIVE_BANNER_SCRIPTS = [
  {
    kind: 'external' as const,
    src: VITE_ADSTERRA_NATIVE_BANNER_SRC ?? '',
    async: true,
    dataCfasync: false,
  },
];

export const ADSTERRA_NATIVE_BANNER_CONTAINER_ID = VITE_ADSTERRA_NATIVE_BANNER_CONTAINER_ID ?? '';

export const ADSTERRA_SMARTLINK_URL = VITE_ADSTERRA_SMARTLINK_URL ?? '';
