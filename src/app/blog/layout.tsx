import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sneaker Blog | SoleUp',
  description: 'A sneaker blog by SoleUp, dedicated to latest trends, industry news and guides for your sneaker collection.',
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}