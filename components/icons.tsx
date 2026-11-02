// Inline icons (stroke = currentColor). Decorative unless a title is given.
type P = { className?: string };
const s = (d: React.ReactNode, vb = "0 0 24 24") => function Icon({ className = "h-4 w-4" }: P) {
  return <svg viewBox={vb} className={className} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>;
};
export const ArrowRight = s(<path d="M5 12h14M13 6l6 6-6 6" />);
export const ArrowUpRight = s(<path d="M7 17L17 7M8 7h9v9" />);
export const Plus = s(<path d="M12 5v14M5 12h14" />);
export const Minus = s(<path d="M5 12h14" />);
export const Check = s(<path d="M5 12.5l4.5 4.5L19 7.5" />);
export const X = s(<path d="M6 6l12 12M18 6L6 18" />);
export const Search = s(<><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>);
export const Phone = s(<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />);
export const Mail = s(<><rect x="2.5" y="4.5" width="19" height="15" rx="2" /><path d="M3 7l9 6 9-6" /></>);
export const Pin = s(<><path d="M20 10c0 6.5-8 12-8 12s-8-5.5-8-12a8 8 0 0 1 16 0z" /><circle cx="12" cy="10" r="2.8" /></>);
export const List = s(<><path d="M9 6h11M9 12h11M9 18h11" /><path d="M4 6h.01M4 12h.01M4 18h.01" /></>);
export const Menu = s(<path d="M4 7h16M4 12h16M4 17h16" />);
export const ChevronDown = s(<path d="M6 9l6 6 6-6" />);
export const Filter = s(<path d="M4 5h16l-6 7.5V19l-4 1v-7.5z" />);
export const Download = s(<><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 20h14" /></>);
export const Image = s(<><rect x="3" y="4" width="18" height="16" rx="2" /><circle cx="9" cy="10" r="2" /><path d="M21 16l-5-5-9 9" /></>);
export const Box = s(<><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8M12 13v8" /></>);
export const Send = s(<path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />);
export function WhatsApp({ className = "h-4 w-4" }: P) {
  return <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.7 17.8L0 24l6.3-1.7A11.8 11.8 0 0 0 24 12c0-3.2-1.2-6.1-3.6-8.4z" /></svg>;
}
