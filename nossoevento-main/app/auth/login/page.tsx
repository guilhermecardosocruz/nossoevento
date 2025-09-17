export const revalidate = 0;            // não usar cache nesta página
export const dynamic = "force-dynamic"; // força renderização dinâmica no servidor

import LoginForm from "./_form";

export default function LoginPage() {
  return <LoginForm />;
}

