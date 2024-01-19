export default async function Index() {
  return (
    <header className="flex-1 flex flex-col gap-6">
      <div className="flex flex-col gap-16 items-center">
        <h1 className="sr-only">비버코딩 홈페이지</h1>
        <p className="text-3xl lg:text-4xl !leading-tight mx-auto text-center break-keep">
          비버코딩은 비즈니스를 위한 <br /> 가장{' '}
          <span className="font-bold">단순</span>
          하고 <span className="font-bold">강력한 </span>
          해결책을 제시합니다.
        </p>
        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
      </div>
    </header>
  );
}
