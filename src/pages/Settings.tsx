const Settings = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-xs text-muted-foreground">
          Configurações da conta, integrações e preferências (em breve).
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
        <p>Por enquanto, as integrações são configuradas via variáveis de ambiente.</p>
      </div>
    </div>
  );
};

export default Settings;

