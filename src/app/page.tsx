import { Button } from '@/components/ui/button';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { getValidCategories } from '@/src/backend/posts';
import Image from 'next/image';
import Link from 'next/link';

export default async function Index() {
  // const [categories] = await Promise.all([getValidCategories()]);

  return (
    <header className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col min-h-screen gap-16 items-center justify-center animate-in">
        <h1 className="sr-only">BeaverCoding Homepage</h1>
        <Image src={'/logo.png'} alt="logo" width={200} height={200} />
        <p className="text-3xl lg:text-4xl !leading-tight mx-auto text-center break-keep">
          BeaverCoding <br />
          <span className="font-bold">A Full-Stack Problem Solver</span>
          <br /> for your business.
        </p>
        <Button asChild>
          <Link href="/about">Learn More</Link>
        </Button>
      </div>
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      {/* <div className="flex flex-col mx-auto items-center">
        <h1>Tech Stacks & Categories</h1>
        <HoverEffect items={categories} />
      </div> */}
    </header>
  );
}
