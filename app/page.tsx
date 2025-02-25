import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import Navbar from 'components/layout/navbar';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Bagisto.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  return (
    <>
      <Navbar />
      <ThreeItemGrid />
      <Carousel />
      <Footer />
    </>
  );
}
