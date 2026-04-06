const Projects = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="px-6 py-4 border-b border-border bg-background/80 backdrop-blur-sm">
        <h1 className="text-xl font-bold">Projects</h1>
        <p className="text-xs text-muted-foreground">
          Lista de projetos salvos (em breve usando Supabase).
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
        <p>Nenhum projeto listado ainda. Gere alguns vídeos e depois conectamos aqui.</p>
      </div>
    </div>
  );
};

export default Projects;

