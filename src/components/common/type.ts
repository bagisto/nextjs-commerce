export interface NextImageProps {
  src: string;
  alt: string;
  className?: string;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
}


export interface RatingTypes {
  length?: number;
  star: number;
  reviewCount?: number;
  size?: string;
  className?: string;
  totalReview?: number;
}