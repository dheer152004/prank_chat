import { ReactNode, useEffect, useRef } from 'react';

type ScriptConfig = {
  kind: 'inline' | 'external';
  code?: string;
  src?: string;
  async?: boolean;
  dataCfasync?: boolean;
};

interface AdSlotProps {
  className?: string;
  scriptHostClassName?: string;
  scripts: ScriptConfig[];
  children?: ReactNode;
}

export default function AdSlot({ className, scriptHostClassName, scripts, children }: AdSlotProps) {
  const scriptHostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = scriptHostRef.current;
    if (!host) return;

    host.innerHTML = '';

    const injectedScripts: HTMLScriptElement[] = [];

    scripts.forEach((scriptConfig) => {
      const script = document.createElement('script');

      if (scriptConfig.kind === 'inline') {
        script.text = scriptConfig.code ?? '';
      } else {
        script.src = scriptConfig.src ?? '';
        script.async = scriptConfig.async ?? true;
      }

      if (typeof scriptConfig.dataCfasync === 'boolean') {
        script.setAttribute('data-cfasync', scriptConfig.dataCfasync ? 'true' : 'false');
      }

      host.appendChild(script);
      injectedScripts.push(script);
    });

    return () => {
      injectedScripts.forEach((script) => script.remove());
      host.innerHTML = '';
    };
  }, [scripts]);

  return (
    <div className={className}>
      {children}
      <div ref={scriptHostRef} className={scriptHostClassName} />
    </div>
  );
}