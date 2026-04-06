import { useEffect, useState } from "react";
import { Loader2, LogOut, UserRoundPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { getCurrentUser, onSupabaseAuthChange, signOutUser } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

interface AuthDialogProps {
  userEmail?: string | null;
}

const AuthDialog = ({ userEmail }: AuthDialogProps) => {
  const [loadingAction, setLoadingAction] = useState<"signout" | null>(null);
  const [resolvedUserEmail, setResolvedUserEmail] = useState<string | null>(userEmail ?? null);

  useEffect(() => {
    if (typeof userEmail !== "undefined") {
      setResolvedUserEmail(userEmail ?? null);
      return;
    }

    getCurrentUser()
      .then((user) => setResolvedUserEmail(user?.email ?? null))
      .catch(() => setResolvedUserEmail(null));

    const { data } = onSupabaseAuthChange((_event, session) => {
      setResolvedUserEmail(session?.user?.email ?? null);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [userEmail]);

  const handleSignOut = async () => {
    setLoadingAction("signout");
    try {
      await signOutUser();
      toast.success("Sessão encerrada.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível sair.");
    } finally {
      setLoadingAction(null);
    }
  };

  const displayEmail = userEmail ?? resolvedUserEmail;

  if (displayEmail) {
    return (
      <div className="flex flex-col gap-2">
        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground text-center break-all">
          {displayEmail}
        </span>
        <Button type="button" size="sm" variant="outline" onClick={handleSignOut} disabled={loadingAction === "signout"}>
          {loadingAction === "signout" ? <Loader2 className="animate-spin" /> : <LogOut className="w-4 h-4" />}
          Sair
        </Button>
      </div>
    );
  }

  return (
    <Button type="button" size="sm" variant="outline" asChild>
      <Link to="/auth">
        <UserRoundPlus className="w-4 h-4" />
        Entrar / Cadastro
      </Link>
    </Button>
  );
};

export default AuthDialog;
