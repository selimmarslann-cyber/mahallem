import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";

/**
 * Authenticated layout - sadece giriş yapmış kullanıcılar erişebilir
 */
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
