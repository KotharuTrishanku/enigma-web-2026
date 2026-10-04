import './globals.css';

export const metadata = {
  title: 'Enigma Web',
  description: 'Technical Club of IIIT Srcity',
};

export default function RootLayout({children, }:{children: React.ReactNode;}){
  
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <main className="relative z-10 min-h-screen">{children}</main>
      </body>
    </html>
  );
}