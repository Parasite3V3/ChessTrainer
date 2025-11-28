interface Stats {
  solved: number;
  failed: number;
  currentStreak: number;
  bestStreak: number;
  totalTimeMs: number;
  averageTime: number;
}

interface Props {
  stats: Stats;
}

const formatSeconds = (seconds: number) => {
  if (seconds === 0) {
    return "—";
  }
  return `${seconds}s`;
};

export const StatsPanel = ({ stats }: Props) => {
  return (
    <section className="panel">
      <h2>Статистика</h2>
      <div className="stats-grid">
        <article className="stat-card">
          <div className="stat-label">Решено</div>
          <div className="stat-value">{stats.solved}</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Ошибок</div>
          <div className="stat-value">{stats.failed}</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Серия</div>
          <div className="stat-value">{stats.currentStreak}</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Лучший результат</div>
          <div className="stat-value">{stats.bestStreak}</div>
        </article>
        <article className="stat-card">
          <div className="stat-label">Среднее время</div>
          <div className="stat-value">{formatSeconds(stats.averageTime)}</div>
        </article>
      </div>
    </section>
  );
};


