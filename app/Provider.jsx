import {NextUIProvider} from "@nextui-org/react";

export default function Provider({children}) {
  return (
    <NextUIProvider>
      <main className="bg-sky-100 h-screen" style={{ height: "100vh", width: "100vw" }}>
        {children}
      </main>
    </NextUIProvider>
  );
}