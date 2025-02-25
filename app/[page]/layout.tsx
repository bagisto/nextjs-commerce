import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="w-full">
        <Navbar />
        <div className="mx-8 max-w-2xl py-20 sm:mx-auto"> {children}</div>
      </div>
      <Footer />
    </>
  );
}
