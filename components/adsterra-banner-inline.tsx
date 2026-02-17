'use client'

interface AdsterraBannerProps {
  format: '160x300' | '160x600' | '300x250' | '468x60' | '728x90' | 'native' | 'social'
}

export function AdsterraBanner({ format }: AdsterraBannerProps) {
  return (
    <div className={`flex justify-center items-center overflow-hidden my-4 mx-auto ${
      format === '160x300' ? 'w-[160px] h-[300px]' : 
      format === '160x600' ? 'w-[160px] h-[600px]' : 
      format === '300x250' ? 'w-[300px] h-[250px]' : 
      format === '468x60' ? 'w-[468px] h-[60px]' : 
      format === '728x90' ? 'w-full max-w-[728px] h-[90px]' : 
      format === 'native' ? 'w-full min-h-[250px]' : 
      format === 'social' ? 'w-full min-h-[50px]' : 
      'w-full min-h-[100px]'
    }`}>
      {format === '160x300' && (
        <div dangerouslySetInnerHTML={{
          __html: `
            <script>
              atOptions = {
                'key' : '6e9a519272442fa242b5a43e53ddc7fd',
                'format' : 'iframe',
                'height' : 300,
                'width' : 160,
                'params' : {}
              };
            </script>
            <script src="https://www.highperformanceformat.com/6e9a519272442fa242b5a43e53ddc7fd/invoke.js"></script>
          `
        }} />
      )}
      
      {format === '160x600' && (
        <div dangerouslySetInnerHTML={{
          __html: `
            <script>
              atOptions = {
                'key' : '22bed31723f24472a78afb44a7addb6b',
                'format' : 'iframe',
                'height' : 600,
                'width' : 160,
                'params' : {}
              };
            </script>
            <script src="https://www.highperformanceformat.com/22bed31723f24472a78afb44a7addb6b/invoke.js"></script>
          `
        }} />
      )}
      
      {format === '300x250' && (
        <div dangerouslySetInnerHTML={{
          __html: `
            <script>
              atOptions = {
                'key' : '1ad6f564f3ca7bb42752dba86368d149',
                'format' : 'iframe',
                'height' : 250,
                'width' : 300,
                'params' : {}
              };
            </script>
            <script src="https://www.highperformanceformat.com/1ad6f564f3ca7bb42752dba86368d149/invoke.js"></script>
          `
        }} />
      )}
      
      {format === '468x60' && (
        <div dangerouslySetInnerHTML={{
          __html: `
            <script>
              atOptions = {
                'key' : 'a8ea859722150189e57a87b6579578f3',
                'format' : 'iframe',
                'height' : 60,
                'width' : 468,
                'params' : {}
              };
            </script>
            <script src="https://www.highperformanceformat.com/a8ea859722150189e57a87b6579578f3/invoke.js"></script>
          `
        }} />
      )}
      
      {format === '728x90' && (
        <div dangerouslySetInnerHTML={{
          __html: `
            <script>
              atOptions = {
                'key' : '5a8dd45e78414c6e5be9db9eaffed61f',
                'format' : 'iframe',
                'height' : 90,
                'width' : 728,
                'params' : {}
              };
            </script>
            <script src="https://www.highperformanceformat.com/5a8dd45e78414c6e5be9db9eaffed61f/invoke.js"></script>
          `
        }} />
      )}
      
      {format === 'native' && (
        <div dangerouslySetInnerHTML={{
          __html: `
            <div id="container-c08de902b7930682919199d915646b97"></div>
            <script async data-cfasync="false" src="https://pl28722946.effectivegatecpm.com/c08de902b7930682919199d915646b97/invoke.js"></script>
          `
        }} />
      )}
      
      {format === 'social' && (
        <div dangerouslySetInnerHTML={{
          __html: `
            <script src="https://pl28722941.effectivegatecpm.com/9a/dd/34/9add34aad611a8243e9fa65055bde309.js"></script>
          `
        }} />
      )}
    </div>
  )
}
