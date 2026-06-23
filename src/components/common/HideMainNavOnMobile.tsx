export function HideMainNavOnMobile() {
  return (
    <style>{`
      @media (max-width: 1024px) {
        header.main-nav {
          display: none !important;
        }
      }
    `}</style>
  );
}
