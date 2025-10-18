export function ThemeScript() {
    const themeScript = `
    try {
      const theme = localStorage.getItem('cobrix-theme') || 'system';
      const isDark =
        theme === 'dark' ||
        (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Theme initialization error:', e);
    }
  `;

    return (
        <script
            dangerouslySetInnerHTML={{
                __html: themeScript
            }}
        />
    );
}
