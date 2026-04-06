import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, LogIn, UserRoundPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import clipzyLogo from "@/assets/clipzyLogo.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getCurrentUser, signInWithEmail, signUpWithEmail } from "@/lib/supabase";

const Auth = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingAction, setLoadingAction] = useState<"login" | "signup" | null>(null);

  useEffect(() => {
    getCurrentUser()
      .then((user) => {
        if (user) {
          navigate("/", { replace: true });
        }
      })
      .catch(() => {});
  }, [navigate]);

  const validateForm = (requireConfirmation = false) => {
    if (!email || !password) {
      toast.error("Preencha email e senha.");
      return false;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      return false;
    }

    if (requireConfirmation && password !== confirmPassword) {
      toast.error("As senhas não coincidem.");
      return false;
    }

    return true;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoadingAction("login");
    try {
      await signInWithEmail(email, password);
      toast.success("Login realizado com sucesso.");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível entrar.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleSignUp = async () => {
    if (!validateForm(true)) return;

    setLoadingAction("signup");
    try {
      await signUpWithEmail(email, password);
      toast.success("Conta criada com sucesso.");
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível criar a conta.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="min-h-screen grid bg-background text-foreground lg:grid-cols-2">
      <section className="hidden lg:flex flex-col justify-between border-r border-border bg-muted/40 p-10">
        <div className="flex items-center gap-3">
          <img src={clipzyLogo} alt="Clipzy logo" className="h-16 w-auto object-contain" />
        </div>

        <div className="max-w-md space-y-4">
          <span className="inline-flex rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Clipzy Access
          </span>
          <h1 className="text-4xl font-black tracking-tight">Entre para criar, salvar e gerenciar seus vídeos.</h1>
          <p className="text-sm text-muted-foreground">
            Faça login ou crie sua conta para sincronizar projetos e armazenar seus exports com segurança no Supabase.
          </p>
        </div>

        <Button asChild variant="ghost" className="w-fit">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Voltar para o Clipzy
          </Link>
        </Button>
      </section>

      <section className="flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-md border-border/80 shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex justify-center lg:hidden">
              <img src={clipzyLogo} alt="Clipzy logo" className="h-14 w-auto object-contain" />
            </div>
            <div className="space-y-1 text-center">
              <CardTitle className="text-2xl">Acesse sua conta</CardTitle>
              <CardDescription>
                Entre ou cadastre-se para usar todos os recursos do `Clipzy`.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Cadastro</TabsTrigger>
              </TabsList>

              <TabsContent value="login" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="voce@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Senha</label>
                  <Input
                    type="password"
                    placeholder="Sua senha"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="button" className="w-full" onClick={handleSignIn} disabled={loadingAction !== null}>
                  {loadingAction === "login" ? <Loader2 className="animate-spin" /> : <LogIn className="w-4 h-4" />}
                  Entrar
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    type="email"
                    placeholder="voce@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Senha</label>
                  <Input
                    type="password"
                    placeholder="Crie uma senha"
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirmar senha</label>
                  <Input
                    type="password"
                    placeholder="Repita a senha"
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button type="button" className="w-full" onClick={handleSignUp} disabled={loadingAction !== null}>
                  {loadingAction === "signup" ? <Loader2 className="animate-spin" /> : <UserRoundPlus className="w-4 h-4" />}
                  Criar conta
                </Button>
              </TabsContent>
            </Tabs>

            <p className="mt-4 text-center text-xs text-muted-foreground lg:hidden">
              <Link to="/" className="inline-flex items-center gap-1 hover:text-foreground">
                <ArrowLeft className="w-3.5 h-3.5" />
                Voltar para o Clipzy
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default Auth;
