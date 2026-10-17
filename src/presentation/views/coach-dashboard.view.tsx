import * as React from 'react';
import type { PatientRecord } from '../../domain/entities/patientRecord';

export interface CoachDashboardViewProps {
  readonly patients: readonly PatientRecord[];
  readonly query: string;
  readonly onQueryChange: (value: string) => void;
  readonly onOpenPatient: (id: string) => void;
}

const statusClass: Readonly<Record<string, string>> = {
  'Review suggested': 'bg-destructive/10 text-destructive',
  Watch: 'bg-accent text-accent-foreground',
  Stable: 'bg-primary/10 text-primary',
  'Insufficient data': 'bg-muted text-muted-foreground',
};

export function CoachDashboardView(props: CoachDashboardViewProps): React.ReactElement {
  return (
    <main className="mx-auto w-full max-w-5xl space-y-4 p-6" data-agent-id="screen:coach-dashboard">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Roster</h1>
          <p className="text-sm text-muted-foreground">
            Patients ranked by analysis status. Open one to review wearable timelines.
          </p>
        </div>
        <input
          type="search"
          value={props.query}
          onChange={(e) => props.onQueryChange(e.target.value)}
          placeholder="Search patient ID or treatment plan"
          aria-label="Search patients"
          className="w-72 rounded-md border border-border bg-background px-3 py-2 text-sm"
        />
      </div>
      {props.patients.length === 0 ? (
        <div role="status" className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          No patients match your search.
        </div>
      ) : (
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {props.patients.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => props.onOpenPatient(p.id)}
                className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left hover:bg-muted"
              >
                <div className="min-w-0">
                  <div className="font-medium">{p.patientCode}</div>
                  <div className="truncate text-sm text-muted-foreground">{p.statusExplanation}</div>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm">
                  <span className="capitalize text-muted-foreground">{p.treatmentPlan}</span>
                  <span className={'rounded-full px-2 py-0.5 text-xs font-medium ' + (statusClass[p.status] ?? '')}>
                    {p.status}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

export default CoachDashboardView;
