/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: { extend: { colors: {
    brand: { 500:'var(--brand-500)',600:'var(--brand-600)',700:'var(--brand-700)' },
    bg:'var(--bg)', surface:'var(--surface)', 'surface-2':'var(--surface-2)',
    border:'var(--border)', 'border-strong':'var(--border-strong)',
    text:'var(--text)', 'text-muted':'var(--text-muted)', 'text-subtle':'var(--text-subtle)',
    success:'var(--success)','success-bg':'var(--success-bg)',
    warning:'var(--warning)','warning-bg':'var(--warning-bg)',
    error:'var(--error)','error-bg':'var(--error-bg)',
  }, borderRadius:{ sm:'0.375rem', md:'0.75rem', lg:'1rem' } } },
  plugins: [],
};
