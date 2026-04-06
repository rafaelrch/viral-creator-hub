const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-xs text-muted-foreground">
          Visão geral simples dos seus vídeos virais (em breve).
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
        <p>Em breve você verá métricas, últimos projetos e atalhos rápidos aqui.</p>
      </div>
    </div>
  );
};

export default Dashboard;

