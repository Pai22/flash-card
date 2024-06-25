import {NextUIProvider} from "@nextui-org/react";

export default function Provider({children}) {
  return (
    <NextUIProvider>
      <main className="bg-sky-100 min-h-screen">
        {children}
      </main>
    </NextUIProvider>
  );
}