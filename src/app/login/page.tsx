import Container from "@/components/Container";
import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <Container>
      <section className="pt-16">
        <div className="max-w-lg">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            CMS Access
          </p>
          <h1 className="mt-3 text-3xl font-semibold">Sign in to your dashboard</h1>
          <p className="mt-2 text-slate-600">
            Use the admin credentials from your environment to manage content.
          </p>
          <LoginForm />
        </div>
      </section>
    </Container>
  );
}
