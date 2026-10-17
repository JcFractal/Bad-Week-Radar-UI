import * as React from 'react';
import { useAppNavigate } from '@/presentation/navigation';
import type { PatientRecord } from '../../domain/entities/patientRecord';
import { useRepositories } from '../app-context';
import { CoachDashboardView } from '../views/coach-dashboard.view';
import { ScreenError, ScreenLoading } from '../screen-state';
import type { RepoError } from '../../domain/shared';

const order: Readonly<Record<string, number>> = {
  'Review suggested': 0,
  Watch: 1,
  Stable: 2,
  'Insufficient data': 3,
};

export default function CoachDashboardRoute(): React.ReactElement {
  const repositories = useRepositories();
  const navigate = useAppNavigate();
  const [patients, setPatients] = React.useState<readonly PatientRecord[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<RepoError | null>(null);
  const [query, setQuery] = React.useState('');
  const [token, setToken] = React.useState(0);

  React.useEffect(() => {
    let live = true;
    setLoading(true);
    setError(null);
    void repositories.patientRecord
      .listAll()
      .then((res) => {
        if (!live) return;
        if (res === null) {
          setPatients([]);
        } else if (res.ok === false) {
          setError(res.error);
        } else {
          setPatients(res.data.items);
        }
        setLoading(false);
      })
      .catch((cause: unknown) => {
        console.error('[archie] roster load failed:', cause);
        if (!live) return;
        setError({ kind: 'transport', message: 'Roster load failed', detail: 'rejected promise' });
        setLoading(false);
      });
    return () => {
      live = false;
    };
  }, [repositories, token]);

  const visible = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return patients
      .filter((p) => q === '' || p.patientCode.toLowerCase().includes(q) || p.treatmentPlan.toLowerCase().includes(q))
      .slice()
      .sort((a, b) => (order[a.status] ?? 9) - (order[b.status] ?? 9));
  }, [patients, query]);

  return (
    <>
      {loading ? (
        <ScreenLoading />
      ) : error !== null ? (
        <ScreenError error={error} onRetry={() => setToken((n) => n + 1)} />
      ) : (
        <CoachDashboardView
          patients={visible}
          query={query}
          onQueryChange={setQuery}
          onOpenPatient={(id) => navigate('/patient-detail/' + id)}
        />
      )}
    </>
  );
}
